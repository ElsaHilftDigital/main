package de.njsm.versusvirus.backend.telegram.dto;

public class CallbackQuery {

    private String id;

    private User from;

    private String data;

    private Message message;

    public User getFrom() {
        return from;
    }

    public String getData() {
        return data;
    }

    public Message getMessage() {
        return message;
    }
}
