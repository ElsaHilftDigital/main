package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
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

    // TODO link
    public void newHelperHasRegistered(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getNewHelperHasRegistered());
        api.sendMessage(m);
    }

    public void helpersHaveApplied(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getHelpersAppliedForPurchase());
        api.sendMessage(m);
    }

    public void helperHasRejected(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getHelperRejectedPurchase());
        api.sendMessage(m);
    }

    public void receiptHasBeenSubmitted(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getReceiptHasBeenSubmitted());
        api.sendMessage(m);
    }
}
