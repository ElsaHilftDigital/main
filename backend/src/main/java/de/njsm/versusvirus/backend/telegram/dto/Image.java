package de.njsm.versusvirus.backend.telegram.dto;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Image {

    private byte[] data;

    private String mimeType;

    private String fileExtension;

    public Image(byte[] data, String mimeType) {
        this.data = data;
        this.mimeType = mimeType;
        this.fileExtension = fileExtension;
    }

    public byte[] getData() {
        return data;
    }

    public String getMimeType() {
        return mimeType;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public void extractFileExtension(String filePath) {
        Pattern p = Pattern.compile(".*\\.([^.]*)");
        Matcher m = p.matcher(filePath);
        m.find();
        fileExtension = m.group(1);
    }
}
