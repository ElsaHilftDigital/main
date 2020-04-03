package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.*;
import okhttp3.OkHttpClient;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

import java.io.IOException;
import java.util.concurrent.LinkedTransferQueue;

class TelegramApiWrapper {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiWrapper.class);

    private String token;

    private ApiClient apiClient;

    private LinkedTransferQueue<Update> updates;

    private int offset;

    public TelegramApiWrapper(String token, int offset) {
        apiClient = new Retrofit.Builder()
                .baseUrl("https://api.telegram.org")
                .client(new OkHttpClient.Builder().build())
                .addConverterFactory(JacksonConverterFactory.create())
                .build()
                .create(ApiClient.class);
        updates = new LinkedTransferQueue<>();
        this.token = token;
        this.offset = offset;
        registerWebhook();
    }

    public void sendMessage(MessageToBeSent message) {
        Call<TelegramResponse<Void>> call = apiClient.sendMessage(token, message);
        executeQuery(call);
    }

    public byte[] getFile(String fileId) {
        Call<TelegramResponse<File>> call = apiClient.getFile(token, fileId);
        File file = executeQuery(call);
        if (file == null) {
            throw new RuntimeException("No file found, see above");
        }

        Call<ResponseBody> rawFileCall = apiClient.getRawFile(token, file.getFilePath());
        byte[] body = executeRawQuery(rawFileCall);
        if (body == null) {
            throw new RuntimeException("No file content found, see above");
        }

        return body;
    }

    private void registerWebhook() {
        Call<TelegramResponse<Void>> call = apiClient.setWebhook(token,
                new WebhookRequest("https://versusvirus.njsm.de/api/v1/telegram/the/next/path/is/a/password/Wz4Bg0pZUybWCbyjjRxpol"));
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
    private byte[] executeRawQuery(Call<ResponseBody> call) {
        try {
            Response<ResponseBody> r = call.execute();
            ResponseBody body = returnRawResponse(r);
            if (body == null) {
                return null;
            }
            return body.bytes();
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