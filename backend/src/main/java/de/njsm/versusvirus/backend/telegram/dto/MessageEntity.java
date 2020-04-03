package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageEntity {

    private String type;

    private int offset;

    private int length;

    public String getType() {
        return type;
    }

    public int getOffset() {
        return offset;
    }

    public int getLength() {
        return length;
    }

    public String extractCommand(String message) {
        return message.substring(offset, offset + length);
    }
}
