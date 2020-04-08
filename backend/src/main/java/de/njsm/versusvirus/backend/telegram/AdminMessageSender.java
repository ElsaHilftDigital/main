package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.util.HashSet;

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

    public void forwardVolunteerMessage(long chatId, Message message) {
        var forwardedMessage = MessageFormat.format(telegramMessages.getForwardedMessage(),
                message.getFrom().getFirstName(),
                message.getFrom().getLastName(),
                escapeMarkdownCharacters(message.getText()));

        var m = new MessageToBeSent(chatId, forwardedMessage);
        api.sendMessage(m);
    }

    private static String escapeMarkdownCharacters(String message) {
        HashSet<Character> escapeableCharacters = getEscapeCharacters();
        StringBuilder builder = new StringBuilder();
        for (char c : message.toCharArray()) {
            if (escapeableCharacters.contains(c)) {
                builder.append('\\');
            }
            builder.append(c);
        }
        return builder.toString();
    }

    private static HashSet<Character> getEscapeCharacters() {
        HashSet<Character> escapeableCharacters = new HashSet<>();
        escapeableCharacters.add('_');
        escapeableCharacters.add('*');
        escapeableCharacters.add('[');
        escapeableCharacters.add(']');
        escapeableCharacters.add('(');
        escapeableCharacters.add(')');
        escapeableCharacters.add('~');
        escapeableCharacters.add('`');
        escapeableCharacters.add('>');
        escapeableCharacters.add('#');
        escapeableCharacters.add('+');
        escapeableCharacters.add('-');
        escapeableCharacters.add('=');
        escapeableCharacters.add('|');
        escapeableCharacters.add('{');
        escapeableCharacters.add('}');
        escapeableCharacters.add('.');
        escapeableCharacters.add('!');
        return escapeableCharacters;
    }
}
