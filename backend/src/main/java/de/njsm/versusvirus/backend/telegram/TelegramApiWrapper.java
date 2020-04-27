package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.*;
import io.prometheus.client.Counter;
import okhttp3.OkHttpClient;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

import java.io.IOException;

@Component
@Profile("!dev")
class TelegramApiWrapper implements TelegramApi, CallbackQueryReplyer {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiWrapper.class);

    private String token;

    private ApiClient apiClient;

    private String domain;

    private static final Counter MESSAGES_SENT = Counter.build()
            .name("elsa_hilft_telegram_ll_messages_sent")
            .help("Number of total sent messages")
            .register();

    private static final Counter MESSAGES_EDITED = Counter.build()
            .name("elsa_hilft_telegram_ll_messages_edited")
            .help("Number of total edited messages")
            .register();

    private static final Counter MESSAGES_DELETED = Counter.build()
            .name("elsa_hilft_telegram_ll_messages_deleted")
            .help("Number of total deleted messages")
            .register();

    private static final Counter CALLBACK_QUERIES_ANSWERED = Counter.build()
            .name("elsa_hilft_telegram_ll_callback_queries_answered")
            .help("Number of total answered callback queries")
            .register();

    private static final Counter IMAGES_DOWNLOADED = Counter.build()
            .name("elsa_hilft_telegram_ll_images_downloaded")
            .help("Number of total downloaded images")
            .register();

    TelegramApiWrapper(@Value("${telegram.bot.token}") String token, @Value("${deployment.domain}") String domain) {
        this.domain = domain;
        RequestInterceptor logger = new RequestInterceptor();
        apiClient = new Retrofit.Builder()
                .baseUrl("https://api.telegram.org")
                .client(new OkHttpClient.Builder().addInterceptor(logger).build())
                .addConverterFactory(JacksonConverterFactory.create())
                .build()
                .create(ApiClient.class);
        this.token = token;
        registerWebhook();
    }

    @Override
    public Message sendMessage(MessageToBeSent message) {
        LOG.debug("Sending message to {}", message.getChatId());
        Call<TelegramResponse<Message>> call = apiClient.sendMessage(token, message);
        MESSAGES_SENT.inc();
        return executeQuery(call);
    }

    public Message editMessage(EditedMessage message) {
        LOG.debug("Editing message to {}", message.getChatId());
        Call<TelegramResponse<Message>> call = apiClient.editMessageText(token, message);
        MESSAGES_EDITED.inc();
        return executeQuery(call);
    }

    @Override
    public void answerCallbackQuery(CallbackQueryAnswer query) {
        LOG.debug("Answering callback query {}", query.getCallbackQueryId());
        Call<TelegramResponse<Void>> call = apiClient.answerCallbackQuery(token, query);
        CALLBACK_QUERIES_ANSWERED.inc();
        executeQuery(call);
    }

    @Override
    public void deleteMessage(long chatId, long messageId) {
        LOG.debug("Deleting message in chat {}", chatId);
        Call<TelegramResponse<Void>> call = apiClient.deleteMessage(token, chatId, messageId);
        MESSAGES_DELETED.inc();
        executeQuery(call);
    }

    @Override
    public Image getFile(String fileId) {
        LOG.debug("Downloading file {}", fileId);
        Call<TelegramResponse<File>> call = apiClient.getFile(token, fileId);
        IMAGES_DOWNLOADED.inc();
        File file = executeQuery(call);
        if (file == null) {
            throw new RuntimeException("No file found, see above");
        }

        Call<ResponseBody> rawFileCall = apiClient.getRawFile(token, file.getFilePath());
        Image body = executeRawQuery(rawFileCall);
        if (body == null || body.getMimeType() == null || body.getData() == null) {
            throw new RuntimeException("No file content found, see above");
        }

        body.extractFileExtension(file.getFilePath());

        return body;
    }

    private void registerWebhook() {
        LOG.debug("Setting webhook to production");
        String url = "https://" + domain + "/api/v1" + TelegramController.TELEGRAM_WEBHOOK;
        Call<TelegramResponse<Void>> call = apiClient.setWebhook(token, new WebhookRequest(url));
        executeQuery(call);
    }

    @Nullable
    private <T> T executeQuery(Call<TelegramResponse<T>> call) {
        try {
            Response<TelegramResponse<T>> r = call.execute();
            return returnResponse(r);
        } catch (IOException e) {
            LOG.error("Error connecting to the server", e);
            return null;
        }
    }

    @Nullable
    private Image executeRawQuery(Call<ResponseBody> call) {
        try {
            Response<ResponseBody> r = call.execute();
            ResponseBody body = returnRawResponse(r);
            if (body == null) {
                return null;
            }
            return new Image(body.bytes(), r.headers().get("content-type"));
        } catch (IOException e) {
            LOG.error("Error connecting to the server", e);
            return null;
        }
    }

    private <D> D returnResponse(Response<TelegramResponse<D>> response) {
        if (!response.isSuccessful()
                || response.body() == null
                || !response.body().isOk()) {
            logResponse(response);
            return null;
        } else {
            return response.body().getResult();
        }
    }

    private ResponseBody returnRawResponse(Response<ResponseBody> response) {
        if (!response.isSuccessful()
                || response.body() == null) {
            logResponse(response);
            return null;
        } else {
            return response.body();
        }
    }

    private void logResponse(Response<?> r) {
        if (r.errorBody() != null) {
            try {
                LOG.error("Response was an error:\n" + r.errorBody().string());
            } catch (IOException e) {
                LOG.error("Response was an error and the body returned an exception");
            }
        }
        if (r.body() != null) {
            LOG.error("Response was an error:\n" + r.body().toString());
        }
    }
}
