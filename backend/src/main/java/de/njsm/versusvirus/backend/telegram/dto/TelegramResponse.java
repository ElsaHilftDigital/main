package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TelegramResponse<T> {

    private boolean ok;

    private String description;

    /**
     * ok implies result != null
     */
    private T result;

    public boolean isOk() {
        return ok;
    }

    public String getDescription() {
        return description;
    }

    public T getResult() {
        return result;
    }
}
