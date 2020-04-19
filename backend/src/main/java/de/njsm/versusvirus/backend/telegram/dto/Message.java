package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonProperty("new_chat_members")
    private User[] newChatMembers;

    @JsonProperty("group_chat_created")
    private boolean groupChatCreated;

    public Message() {
    }

    public Message(long id, User from, int date, String text) {
        this.id = id;
        this.from = from;
        this.date = date;
        this.text = text;
    }

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

    public User[] getNewChatMembers() {
        return newChatMembers;
    }

    public boolean isGroupChatCreated() {
        return groupChatCreated;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public void setDate(int date) {
        this.date = date;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public void setForwardFrom(User forwardFrom) {
        this.forwardFrom = forwardFrom;
    }

    public void setForwardFromChat(Chat forwardFromChat) {
        this.forwardFromChat = forwardFromChat;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setPhoto(PhotoSize[] photo) {
        this.photo = photo;
    }

    public void setEntities(MessageEntity[] entities) {
        this.entities = entities;
    }

    public void setNewChatMembers(User[] newChatMembers) {
        this.newChatMembers = newChatMembers;
    }

    public void setGroupChatCreated(boolean groupChatCreated) {
        this.groupChatCreated = groupChatCreated;
    }

    @JsonIgnore
    public String getPurgedText() {
        String text = getText();
        if (entities != null) {
            for (MessageEntity e : entities) {
                text = text.replace(e.extractCommand(getText()), "");
            }
        }
        return text;
    }
}
