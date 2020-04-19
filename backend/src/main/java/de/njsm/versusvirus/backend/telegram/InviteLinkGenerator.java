package de.njsm.versusvirus.backend.telegram;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.util.UUID;

@Component
public class InviteLinkGenerator {

    private String botName;

    public InviteLinkGenerator(@Value("${telegram.bot.name}") String botName) {
        this.botName = botName;
    }

    public String getInviteLink(UUID userId) {
        return MessageFormat.format("{0}start={1}", getBaseUrl(), userId);
    }

    public String getBaseUrl() {
        return "https://t.me/" + botName + "?";
    }
}
