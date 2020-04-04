package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Chat {

    private long id;

    /**
     * "private", "group", "supergroup" or "channel"
     */
    private String type;

    private String title;

    private String username;

    private String first_name;

    private String last_name;

    private String description;

    public long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getUsername() {
        return username;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getDescription() {
        return description;
    }
}
