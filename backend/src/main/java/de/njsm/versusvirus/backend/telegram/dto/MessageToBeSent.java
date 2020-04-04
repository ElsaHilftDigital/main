package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageToBeSent {

    private int id;

    private String text;

    @JsonProperty("parse_mode")
    private String parseMode;

    @JsonProperty("disable_web_page_preview")
    private boolean disableWebPagePreview;

    public MessageToBeSent(int id, String markdownText) {
        this.id = id;
        this.text = markdownText;
        this.parseMode = "Markdown";
        this.disableWebPagePreview = true;
    }

    public int getId() {
        return id;
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
