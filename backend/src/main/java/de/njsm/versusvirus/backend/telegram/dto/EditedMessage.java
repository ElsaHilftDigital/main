package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EditedMessage {

    @JsonProperty("chat_id")
    private long chatId;

    @JsonProperty("message_id")
    private long messageId;

    private String text;

    @JsonProperty("parse_mode")
    private String parseMode;

    @JsonProperty("disable_web_page_preview")
    private boolean disableWebPagePreview;

    @JsonProperty("reply_markup")
    private InlineKeyboardMarkup buttons;

    public EditedMessage(long chatId, long messageId, String text, InlineKeyboardMarkup buttons) {
        this.chatId = chatId;
        this.messageId = messageId;
        this.text = text;
        this.parseMode = "MarkdownV2";
        this.disableWebPagePreview = true;
        this.buttons = buttons;
    }

    public EditedMessage(MessageToBeSent message, long messageId) {
        this(message.getChatId(),
                messageId,
                message.getText(),
                message.getButtons());
    }

    public long getChatId() {
        return chatId;
    }

    public long getMessageId() {
        return messageId;
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

    public InlineKeyboardMarkup getButtons() {
        return buttons;
    }
}
