package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.File;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import de.njsm.versusvirus.backend.telegram.dto.TelegramResponse;
import de.njsm.versusvirus.backend.telegram.dto.Update;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.*;

/**
 * https://core.telegram.org/bots/api
 */
public interface ApiClient {

    @GET("/bot{token}/getUpdates")
    Call<TelegramResponse<Update[]>> getUpdates(@Path("token") String token,
                                                @Query("offset") int offset,
                                                @Query("limit") int answerLimit,
                                                @Query("timeout") int timeoutInSeconds,
                                                @Query("allowed_updates") String[] allowedUpdateTypes);

    @POST("/bot{token}/sendMessage")
    Call<TelegramResponse<Void>> sendMessage(@Path("token") String token,
                                             @Body MessageToBeSent message);

    @GET("/bot{token}/getFile")
    Call<TelegramResponse<File>> getFile(@Path("token") String token,
                                         @Query("file_id") String fileId);

    @GET("/file/bot{token}/{filePath}")
    Call<ResponseBody> getRawFile(@Path("token") String token,
                                  @Path("filePath") String filePath);
}
