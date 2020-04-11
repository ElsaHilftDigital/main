package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public enum CallbackCommand {

    HELP_OFFER {
        @Override
        public String getCommandIdentifier() {
            return "aaaa";
        }

        @Override
        public void dispatchInternally(CallbackDispatcher dispatcher, Message message, User user, UUID data) {
            dispatcher.handleHelpOffer(message, user, data);
        }
    },

    CONFIRM_HELP {
        @Override
        public String getCommandIdentifier() {
            return "aaab";
        }

        @Override
        public void dispatchInternally(CallbackDispatcher dispatcher, Message message, User user, UUID data) {
            dispatcher.handleConfirmingHelp(message, user, data);
        }
    },
    WITHDRAW_HELP {
        @Override
        public String getCommandIdentifier() {
            return "aaac";
        }

        @Override
        public void dispatchInternally(CallbackDispatcher dispatcher, Message message, User user, UUID data) {
            dispatcher.handleWithdrawingHelp(message, user, data);
        }
    },
    COMPLETE_PURCHASE {
        @Override
        public String getCommandIdentifier() {
            return "aaad";
        }

        @Override
        public void dispatchInternally(CallbackDispatcher dispatcher, Message message, User user, UUID data) {
            dispatcher.handleCompletion(message, user, data);
        }
    },
    MONEY_MISSING {
        @Override
        public String getCommandIdentifier() {
            return "aaae";
        }

        @Override
        public void dispatchInternally(CallbackDispatcher dispatcher, Message message, User user, UUID data) {
            dispatcher.handleMoneyNotFound(message, user, data);
        }
    },
    SUBMIT_RECEIPT {
        @Override
        public String getCommandIdentifier() {
            return "aaaf";
        }

        @Override
        public void dispatchInternally(CallbackDispatcher dispatcher, Message message, User user, UUID data) {
            dispatcher.handleReceiptSubmission(message, user, data);
        }
    },
    CONFIRM_DELETION {
        @Override
        public String getCommandIdentifier() {
            return "aaag";
        }

        @Override
        public void dispatchInternally(CallbackDispatcher dispatcher, Message message, User user, UUID data) {
            dispatcher.handleVolunteerDeletion(message, user, data);
        }
    },
    ;

    private static final Logger LOG = LoggerFactory.getLogger(CallbackCommand.class);

    public String render(UUID data) {
        String result = getCommandIdentifier() + "_" + data;
        if (result.length() > 64) {
            throw new IllegalStateException("callback_query '" + result + "' is longer than telegram allows");
        }
        return result;
    }

    public Pattern getRegex() {
        return Pattern.compile("^(?<commandIdentifier>" + getCommandIdentifier() + ")_(?<data>[-a-f0-9]*)$");
    }

    public void dispatch(CallbackDispatcher dispatcher, Message message, User user, String rawData) {
        LOG.info("Handling " + name());
        Matcher m = getRegex().matcher(rawData);
        boolean found = m.find();
        assert found; // verified before
        assert m.group("commandIdentifier").equals(getCommandIdentifier());
        String data = m.group("data");
        dispatchInternally(dispatcher, message, user, UUID.fromString(data));
    }

    public abstract String getCommandIdentifier();

    public abstract void dispatchInternally(CallbackDispatcher dispatcher, Message message, User user, UUID data);

    @Nullable
    public static CallbackCommand create(String command) {
        for (CallbackCommand c : CallbackCommand.values()) {
            if (c.getRegex().asPredicate().test(command)) {
                return c;
            }
        }
        return null;
    }
}
