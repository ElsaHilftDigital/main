package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageToBeSent {

    @JsonProperty("chat_id")
    private long chatId;

    private String text;

    @JsonProperty("parse_mode")
    private String parseMode;

    @JsonProperty("disable_web_page_preview")
    private boolean disableWebPagePreview;

    public MessageToBeSent(long chatId, String markdownText) {
        this.chatId = chatId;
        this.text = markdownText;
        this.parseMode = "Markdown";
        this.disableWebPagePreview = true;
    }

    public long getChatId() {
        return chatId;
    }

    public String getText() {
        return text;
    }

    public String getParseMode() {
        return parseMode;
    }

    public boolean isDisableWebPagePreview() {
        return disableWebPagePreview;
    }
}
