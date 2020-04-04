package de.njsm.versusvirus.backend.telegram;

import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;

import java.io.IOException;

class RequestInterceptor implements Interceptor {

    private static final Logger LOG = LoggerFactory.getLogger(RequestInterceptor.class);

    @Override public Response intercept(Chain chain) throws IOException {
        Request request = chain.request();

        LOG.debug("OkHttp Request: {}\n{}",
                request.url(),
                request.headers());

        Response r = chain.proceed(request);
        ResponseBody b = r.peekBody(1000000L);
        var type = b.contentType();
        if (type != null && type.toString().equals(MediaType.APPLICATION_JSON.toString())) {
            LOG.debug("OkHttp Response: {}\n{}\n{}",
                    r.code(),
                    r.headers(),
                    b.string());
        } else {
            LOG.debug("OkHttp Response: {}\n{}",
                    r.code(),
                    r.headers());
        }
        return r;
    }
}