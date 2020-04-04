package de.njsm.versusvirus.backend.telegram;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AdminMessageFacade {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiWrapper.class);

    private TelegramApiWrapper api;
    private TelegramMessages telegramMessages;

    @Autowired
    public AdminMessageFacade(TelegramApiWrapper api, TelegramMessages telegramMessages) {
        this.api = api;
        this.telegramMessages = telegramMessages;
    }

    public void publishReceipt() {

    }
}
