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
            return Pattern.compile("^/start(?<botname>@elsahilftbot)? hilfeanbieten_(?<purchaseId>.*)$");
        }

        @Override
        public String render(String purchaseId) {
            return MessageFormat.format("{0}start=hilfeanbieten_{1}", BASE_URL, purchaseId);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            boolean found = m.find();
            assert found; // verified before
            String purchaseId = m.group("purchaseId");
            dispatcher.handleHelpOffering(message, UUID.fromString(purchaseId));
        }
    },

    HILFE_BESTAETIGEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/start(?<botname>@elsahilftbot)? hilfebestaetigen_(?<purchaseId>.*)$");
        }

        @Override
        public String render(String purchaseId) {
            return MessageFormat.format("{0}start=hilfebestaetigen_{1}", BASE_URL, purchaseId);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            boolean found = m.find();
            assert found; // verified before
            String purchaseId = m.group("purchaseId");
            dispatcher.handleConfirmingHelp(message, UUID.fromString(purchaseId));
        }
    },

    HILFE_ZURUECKZIEHEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/start(?<botname>@elsahilftbot)? hilfezurueckziehen_(?<purchaseId>.*)$");
        }

        @Override
        public String render(String purchaseId) {
            return MessageFormat.format("{0}start=hilfezurueckziehen_={1}", BASE_URL, purchaseId);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            boolean found = m.find();
            assert found; // verified before
            String purchaseId = m.group("purchaseId");
            dispatcher.handleRejectingHelp(message, UUID.fromString(purchaseId));
        }
    },

    QUITTUNG_EINREICHEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/start(?<botname>@elsahilftbot)? rcpt_(?<purchaseId>[^_]*)$");
        }

        @Override
        public String render(String purchaseId) {
            return MessageFormat.format("{0}start=rcpt_{2}", BASE_URL, purchaseId);
        }

        @Override
        public String render(String dummy2, String dummy) {
            throw new UnsupportedOperationException("I need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            boolean found = m.find();
            assert found; // verified before
            String purchaseId = m.group("purchaseId");
            dispatcher.handleReceiptSubmission(message, UUID.fromString(purchaseId));
        }
    },

    ABSCHLIESSEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/start(?<botname>@elsahilftbot)? abschliessen_(?<purchaseId>[^_]*)_(?<isSuccess>(true)|(false))$");
        }

        @Override
        public String render(String isSuccessfulFlag) {
            throw new UnsupportedOperationException("I need two values");
        }

        @Override
        public String render(String isSuccessfulFlag, String purchaseId) {
            return MessageFormat.format("{0}start=abschliessen_{1}_{2}", BASE_URL, purchaseId, isSuccessfulFlag);
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            boolean found = m.find();
            assert found; // verified before
            String purchaseId = m.group("purchaseId");
            boolean isSuccess = Boolean.parseBoolean(m.group("isSuccess"));
            dispatcher.handleCompletion(message, UUID.fromString(purchaseId), isSuccess);
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
            boolean found = m.find();
            assert found; // verified before
            String userId = m.group("userId");
            dispatcher.handleNewHelper(message, UUID.fromString(userId));
        }
    },

    QUIT {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/start(?<botname>@elsahilftbot)? quit$");
        }

        @Override
        public String render(String unused) {
            return MessageFormat.format("{0}start=quit", BASE_URL);
        }

        @Override
        public String render(String contextDependentValue1, String contextDependentValue2) {
            throw new UnsupportedOperationException("I only need one value");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            Matcher m = getRegex().matcher(command);
            boolean found = m.find();
            assert found; // verified before
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
