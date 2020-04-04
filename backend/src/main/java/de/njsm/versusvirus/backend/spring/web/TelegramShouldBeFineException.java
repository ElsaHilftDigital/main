package de.njsm.versusvirus.backend.spring.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.OK)
public class TelegramShouldBeFineException extends RuntimeException {
    public TelegramShouldBeFineException() {
    }

    public TelegramShouldBeFineException(String message) {
        super(message);
    }

    public TelegramShouldBeFineException(String message, Throwable cause) {
        super(message, cause);
    }

    public TelegramShouldBeFineException(Throwable cause) {
        super(cause);
    }

    public TelegramShouldBeFineException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
