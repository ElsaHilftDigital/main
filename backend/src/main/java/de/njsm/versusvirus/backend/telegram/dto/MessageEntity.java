package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageEntity {

    private String type;

    private int offset;

    private int length;

    private String url;

    private User user;

    private String language;

    public MessageEntity(String type, int offset, int length) {
        this.type = type;
        this.offset = offset;
        this.length = length;
    }

    public String getType() {
        return type;
    }

    public int getOffset() {
        return offset;
    }

    public int getLength() {
        return length;
    }

    public String getUrl() {
        return url;
    }

    public User getUser() {
        return user;
    }

    public String getLanguage() {
        return language;
    }

    public String extractCommand(String message) {
        int endOfCommandLine = message.indexOf('\n', offset);
        if (endOfCommandLine == -1) {
            endOfCommandLine = message.length();
        }
        return message.substring(offset, endOfCommandLine);
    }
}
