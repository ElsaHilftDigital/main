package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PhotoSize {

    @JsonProperty("file_id")
    private String id;

    @JsonProperty("file_unique_id")
    private String uniqueId;

    private int width;

    private int height;

    @JsonProperty("file_size")
    private int size;

    public String getId() {
        return id;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public int getSize() {
        return size;
    }
}
