package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Commands known to the bot. When changing, update list at bot father!
 */
public enum BotCommand {

    START {
        @Override
        Pattern getRegex(String botName) {
            return Pattern.compile("^/start(?<botname>@" + botName + ")? (?<userId>.*)$");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, String botName, Message message) {
            Matcher m = getRegex(botName).matcher(command);
            boolean found = m.find();
            assert found; // verified before
            String userId = m.group("userId");
            dispatcher.handleNewHelper(message, UUID.fromString(userId));
        }
    },

    QUIT {
        @Override
        Pattern getRegex(String botName) {
            return Pattern.compile("^/quit(?<botname>@" + botName + ")?$");
        }

        @Override
        public void dispatch(BotCommandDispatcher dispatcher, String command, String botName, Message message) {
            LOG.info("Handling " + name());
            Matcher m = getRegex(botName).matcher(command);
            boolean found = m.find();
            assert found; // verified before
            dispatcher.handleLeavingHelper(message);
        }
    };

    private static final Logger LOG = LoggerFactory.getLogger(BotCommand.class);

    public abstract void dispatch(BotCommandDispatcher dispatcher, String command, String botName, Message message);

    abstract Pattern getRegex(String botName);

    @Nullable
    public static BotCommand create(String botName, String command) {
        for (BotCommand c : BotCommand.values()) {
            if (c.getRegex(botName).asPredicate().test(command)) {
                return c;
            }
        }
        return null;
    }
}
