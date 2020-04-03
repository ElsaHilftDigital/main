package de.njsm.versusvirus.backend.telegram;

public class PhotoDownloader {

    private TelegramApiWrapper api;

    public PhotoDownloader(TelegramApiWrapper api) {
        this.api = api;
    }

    public byte[] getFile(String fileId) {
        return api.getFile(fileId);
    }
}
