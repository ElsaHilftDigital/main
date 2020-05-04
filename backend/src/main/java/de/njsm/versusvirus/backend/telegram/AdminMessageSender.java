package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.util.HashSet;

@Component
public class AdminMessageSender {

    private static final Logger LOG = LoggerFactory.getLogger(AdminMessageSender.class);

    private final TelegramApi api;

    private final TelegramMessages telegramMessages;

    private final long moderatorChatId;

    @Autowired
    public AdminMessageSender(TelegramApi api, TelegramMessages telegramMessages, @Value("${telegram.moderatorchat.id}") long moderatorChatId) {
        this.api = api;
        this.telegramMessages = telegramMessages;
        this.moderatorChatId = moderatorChatId;
    }

    public void newHelperHasRegistered() {
        var m = new MessageToBeSent(moderatorChatId, telegramMessages.getNewHelperHasRegistered());
        api.sendMessage(m);
    }

    public void helpersHaveApplied() {
        var m = new MessageToBeSent(moderatorChatId, telegramMessages.getHelpersAppliedForPurchase());
        api.sendMessage(m);
    }

    public void helperHasRejected() {
        var m = new MessageToBeSent(moderatorChatId, telegramMessages.getHelperRejectedPurchase());
        api.sendMessage(m);
    }

    public void receiptHasBeenSubmitted() {
        var m = new MessageToBeSent(moderatorChatId, telegramMessages.getReceiptHasBeenSubmitted());
        api.sendMessage(m);
    }

    public void notifyAboutMissingMoney() {
        var m = new MessageToBeSent(moderatorChatId, telegramMessages.getMoneyIsMissing());
        api.sendMessage(m);
    }

    public void forwardVolunteerMessage(Message message) {
        String purgedMessageText = message.getPurgedText();
        if (purgedMessageText.isEmpty()) {
            LOG.info("Not forwarding text '{}'", message.getText());
            return;
        }

        var firstName = message.getFrom().getFirstName() != null ? message.getFrom().getFirstName() : "";
        var lastName = message.getFrom().getLastName() != null ? message.getFrom().getLastName() : "";

        var forwardedMessage = MessageFormat.format(telegramMessages.getForwardedMessage(),
                escapeMarkdownCharacters(firstName),
                escapeMarkdownCharacters(lastName),
                "tg://user?id=" + message.getFrom().getId(),
                escapeMarkdownCharacters(message.getText()));

        var m = new MessageToBeSent(moderatorChatId, forwardedMessage);
        api.sendMessage(m);
    }

    static String escapeMarkdownCharacters(String message) {
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
