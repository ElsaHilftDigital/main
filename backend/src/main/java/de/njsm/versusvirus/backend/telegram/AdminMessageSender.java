package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Moderator;
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

    public void helpersHaveApplied(Moderator moderator, long purchaseNumber) {
        String template = telegramMessages.getHelpersAppliedForPurchase();
        var m = formatWithModeratorAndPurchaseNumber(template, moderator.getName(), purchaseNumber);
        api.sendMessage(m);
    }

    public void helperHasRejected(Moderator moderator, long purchaseNumber) {
        String template = telegramMessages.getHelperRejectedPurchase();
        var m = formatWithModeratorAndPurchaseNumber(template, moderator.getName(), purchaseNumber);
        api.sendMessage(m);
    }

    public void receiptHasBeenSubmitted(Moderator moderator, long purchaseNumber) {
        String template = telegramMessages.getReceiptHasBeenSubmitted();
        var m = formatWithModeratorAndPurchaseNumber(template, moderator.getName(), purchaseNumber);
        api.sendMessage(m);
    }

    public void notifyAboutMissingMoney(Moderator moderator, long purchaseNumber) {
        String template = telegramMessages.getMoneyIsMissing();
        var m = formatWithModeratorAndPurchaseNumber(template, moderator.getName(), purchaseNumber);
        api.sendMessage(m);
    }

    private MessageToBeSent formatWithModeratorAndPurchaseNumber(String template, String moderatorName, long purchaseNumber) {
        String text = MessageFormat.format(template, moderatorName, String.valueOf(purchaseNumber));
        return new MessageToBeSent(moderatorChatId, text);
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
