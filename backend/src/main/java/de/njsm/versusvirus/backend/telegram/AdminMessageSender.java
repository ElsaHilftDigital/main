package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AdminMessageSender {

    private TelegramApiWrapper api;

    private TelegramMessages telegramMessages;

    @Autowired
    public AdminMessageSender(TelegramApiWrapper api, TelegramMessages telegramMessages) {
        this.api = api;
        this.telegramMessages = telegramMessages;
    }

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

    public void notifyAboutMissingMoney(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getMoneyIsMissing());
        api.sendMessage(m);
    }
}
