package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Message {

    @JsonProperty("message_id")
    private long id;

    private User from;

    /**
     * unix time
     */
    private int date;

    private Chat chat;

    @JsonProperty("forward_from")
    private User forwardFrom;

    @JsonProperty("forward_from_chat")
    private Chat forwardFromChat;

    private String text;

    private PhotoSize[] photo;

    private MessageEntity[] entities;

    public long getId() {
        return id;
    }

    public User getFrom() {
        return from;
    }

    public int getDate() {
        return date;
    }

    public Chat getChat() {
        return chat;
    }

    public User getForwardFrom() {
        return forwardFrom;
    }

    public Chat getForwardFromChat() {
        return forwardFromChat;
    }

    public String getText() {
        return text;
    }

    public PhotoSize[] getPhoto() {
        return photo;
    }

    public MessageEntity[] getEntities() {
        return entities;
    }
}
