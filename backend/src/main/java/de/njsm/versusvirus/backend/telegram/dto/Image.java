package de.njsm.versusvirus.backend.telegram.dto;

public class Image {

    private byte[] data;

    private String mimeType;

    public Image(byte[] data, String mimeType) {
        this.data = data;
        this.mimeType = mimeType;
    }

    public byte[] getData() {
        return data;
    }

    public String getMimeType() {
        return mimeType;
    }
}
