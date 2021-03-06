package de.njsm.versusvirus.backend.telegram.dto;

public class WebhookRequest {

    private String url;

    private String[] allowedUpdates;

    public WebhookRequest(String url) {
        this.url = url;
        allowedUpdates = new String[] {
                "message",
        };
    }

    public String getUrl() {
        return url;
    }

    public String[] getAllowedUpdates() {
        return allowedUpdates;
    }
}
