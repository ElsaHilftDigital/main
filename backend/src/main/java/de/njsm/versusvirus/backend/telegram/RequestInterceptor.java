package de.njsm.versusvirus.backend.telegram;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

class RequestInterceptor implements Interceptor {

    private static final Logger LOG = LoggerFactory.getLogger(RequestInterceptor.class);

    @Override public Response intercept(Chain chain) throws IOException {
        Request request = chain.request();

        LOG.debug("OkHttp: {}", String.format("Sending request %s\n%s",
                request.url(), request.headers()));

        return chain.proceed(request);
    }
}