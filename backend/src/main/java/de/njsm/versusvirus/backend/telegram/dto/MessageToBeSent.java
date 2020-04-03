package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageToBeSent {

    private int id;

    private String text;

    public MessageToBeSent(int id, String text) {
        this.id = id;
        this.text = text;
    }
}
