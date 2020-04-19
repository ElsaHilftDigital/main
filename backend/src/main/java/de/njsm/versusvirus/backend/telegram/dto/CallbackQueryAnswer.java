package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CallbackQueryAnswer {

    @JsonProperty("callback_query_id")
    private String callbackQueryId;

    public CallbackQueryAnswer(CallbackQuery query) {
        this.callbackQueryId = query.getId();
    }

    public String getCallbackQueryId() {
        return callbackQueryId;
    }
}
