package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class File {

    @JsonProperty("file_id")
    private String id;

    @JsonProperty("file_unique_id")
    private String uniqueId;

    @JsonProperty("file_size")
    private int size;

    @JsonProperty("file_path")
    private String filePath;

    public String getId() {
        return id;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public int getSize() {
        return size;
    }

    public String getFilePath() {
        return filePath;
    }
}
