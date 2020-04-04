package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;
import org.springframework.lang.Nullable;

import java.text.MessageFormat;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Commands known to the bot. When changing, update list at bot father!
 */
public enum BotCommand {


    HILFE_ANBIETEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/hilfe_anbieten(?<botname>@elsahilftbot)? (?<purchaseId>.*)$");
        }

        @Override
        public String render(String purchaseId) {
            return MessageFormat.format("{0}hilfe_anbieten={1}", BASE_URL, purchaseId);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            m.find();
            String purchaseId = m.group("purchaseId");
            dispatcher.handleHelpOffering(message, UUID.fromString(purchaseId));
        }
    },

    HILFE_BESTAETIGEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/hilfe_bestaetigen(?<botname>@elsahilftbot)? (?<purchaseId>.*)$");
        }

        @Override
        public String render(String purchaseId) {
            return MessageFormat.format("{0}hilfe_bestaetigen={1}", BASE_URL, purchaseId);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            m.find();
            String purchaseId = m.group("purchaseId");
            dispatcher.handleConfirmingHelp(message, UUID.fromString(purchaseId));
        }
    },

    HILFE_ZURUECKZIEHEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/hilfe_zurueckziehen(?<botname>@elsahilftbot)? (?<purchaseId>.*)$");
        }

        @Override
        public String render(String purchaseId) {
            return MessageFormat.format("{0}hilfe_zurueckziehen={1}", BASE_URL, purchaseId);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            m.find();
            String purchaseId = m.group("purchaseId");
            dispatcher.handleRejectingHelp(message, UUID.fromString(purchaseId));
        }
    },

    QUITTUNG_EINREICHEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/quittung_einreichen(?<botname>@elsahilftbot)? (?<fileId>[^ ]*) (?<purchaseId>[^ ]*)$");
        }

        @Override
        public String render(String contextDependentValue) {
            throw new UnsupportedOperationException("I need two values");
        }

        @Override
        public String render(String fileId, String purchaseId) {
            return MessageFormat.format("{0}quittung_einreichen={1}%20{2}", BASE_URL, fileId, purchaseId);
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            m.find();
            String purchaseId = m.group("purchaseId");
            String fileId = m.group("fileId");
            dispatcher.handleReceiptSubmission(message, UUID.fromString(purchaseId), fileId);
        }
    },

    START {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/start(?<botname>@elsahilftbot)? (?<userId>.*)$");
        }

        @Override
        public String render(String userId) {
            return MessageFormat.format("{0}start={1}", BASE_URL, userId);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            m.find();
            String userId = m.group("userId");
            dispatcher.handleNewHelper(message, UUID.fromString(userId));
        }
    },

    QUIT {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/quit(?<botname>@elsahilftbot)?$");
        }

        @Override
        public String render(String unused) {
            return MessageFormat.format("{0}quit={1}", BASE_URL);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            m.find();
            dispatcher.handleLeavingHelper(message);
        }
    };

    private static final String BASE_URL = "https://t.me/elsahilftbot?";

    public abstract String render(String contextDependentValue);

    public abstract String render(String contextDependentValue1, String contextDependentValue2);

    public abstract void dispatch(BotCommandDispatcher dispatcher, String command, Message message);

    abstract Pattern getRegex();

    @Nullable
    public static BotCommand create(String command) {
        for (BotCommand c : BotCommand.values()) {
            if (c.getRegex().asPredicate().test(command)) {
                return c;
            }
        }
        return null;
    }
}
