package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;
import org.springframework.lang.Nullable;

import java.util.regex.Pattern;

/**
 * Commands known to the bot. When changing, update list at bot father!
 */
public enum BotCommand {

    HILFE_ANBIETEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/hilfe_anbieten (?<purchaseId>.*)$");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            String purchaseId = getRegex().matcher(command).group("purchaseId");
            dispatcher.handleHelpOffering(message, purchaseId);
        }
    },

    HILFE_BESTAETIGEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/hilfe_bestaetigen (?<purchaseId>.*)$");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            String purchaseId = getRegex().matcher(command).group("purchaseId");
            dispatcher.handleConfirmingHelp(message, purchaseId);
        }
    },

    HILFE_ZURUECKZIEHEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/hilfe_zurueckziehen (?<purchaseId>.*)$");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            String purchaseId = getRegex().matcher(command).group("purchaseId");
            dispatcher.handleRejectingHelp(message, purchaseId);
        }
    },

    QUITTUNG_EINREICHEN {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/quittung_einreichen (?<fileId>[^ ]*) (?<purchaseId>[^ ]*)$");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            String purchaseId = getRegex().matcher(command).group("purchaseId");
            String fileId = getRegex().matcher(command).group("fileId");
            dispatcher.handleReceiptSubmission(message, purchaseId, fileId);
        }
    },

    START {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/start (?<token>.*)$");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            String token = getRegex().matcher(command).group("token");
            dispatcher.handleNewHelper(message, token);
        }
    },

    QUIT {
        @Override
        Pattern getRegex() {
            return Pattern.compile("^/quit$");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, Message message) {
            dispatcher.handleLeavingHelper(message);
        }
    };

    abstract Pattern getRegex();

    public abstract void dispatch(BotCommandDispatcher dispatcher, String command, Message message);

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
