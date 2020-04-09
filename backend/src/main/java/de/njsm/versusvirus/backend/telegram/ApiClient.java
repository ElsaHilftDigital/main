package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.*;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.*;

/**
 * https://core.telegram.org/bots/api
 */
interface ApiClient {

    @POST("/bot{token}/setWebhook")
    Call<TelegramResponse<Void>> setWebhook(@Path("token") String token,
                                            @Body WebhookRequest request);

    @POST("/bot{token}/sendMessage")
    Call<TelegramResponse<Message>> sendMessage(@Path("token") String token,
                                                @Body MessageToBeSent message);

    @POST("/bot{token}/answerCallbackQuery")
    Call<TelegramResponse<Void>> answerCallbackQuery(@Path("token") String token,
                                                     @Body CallbackQueryAnswer answer);

    @GET("/bot{token}/getFile")
    Call<TelegramResponse<File>> getFile(@Path("token") String token,
                                         @Query("file_id") String fileId);

    @GET("/file/bot{token}/{filePath}")
    Call<ResponseBody> getRawFile(@Path("token") String token,
                                  @Path("filePath") String filePath);

    @POST("/bot{token}/deleteMessage")
    Call<TelegramResponse<Void>> deleteMessage(@Path("token") String token,
                                               @Query("chat_id") long chatId,
                                               @Query("message_id") long messageId);
}
