package de.njsm.versusvirus.backend;

import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.*;
import de.njsm.versusvirus.backend.telegram.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TelegramController {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramController.class);

    public static final String TELEGRAM_WEBHOOK = "/telegram/the/next/path/is/a/password/Wz4Bg0pZUybWCbyjjRxpol";

    private final BotCommandDispatcher botCommandDispatcher;

    private final UpdateService updateService;

    private final String botName;

    private final CallbackDispatcher callbackCommandDispatcher;

    public TelegramController(TelegramBotCommandDispatcher botCommandDispatcher,
                              UpdateService updateService,
                              @Value("${telegram.bot.name") String botName,
                              CallbackDispatcher callbackCommandDispatcher) {
        this.botCommandDispatcher = botCommandDispatcher;
        this.updateService = updateService;
        this.botName = botName;
        this.callbackCommandDispatcher = callbackCommandDispatcher;
    }

    @PostMapping(TELEGRAM_WEBHOOK)
    public void receiveTelegramUpdate(@RequestBody Update update) {
        if (update.getId() <= updateService.getLatestUpdate()) {
            LOG.info("Repost of update " + update.getId());
            return;
        }
        updateService.setLatestUpdate(update.getId());

        dispatchCallbackQuery(update);

        if (update.getMessage() == null) {
            LOG.info("No message found");
            return;
        }

        Message message = update.getMessage();

        checkIfIJoinedAnExistingChat(message);
        checkIfIJoinedANewChat(message.getChat(), message.isGroupChatCreated());

        lookForPhotos(message);

        if (message.getText() == null || message.getText().isEmpty()) {
            LOG.info("No message found");
            return;
        }

        if (message.getEntities() == null) {
            LOG.info("The message didn't contain commands");
            return;
        }

        dispatchBotCommands(message);
    }

    private void dispatchCallbackQuery(Update update) {
        CallbackQuery query = update.getCallbackQuery();
        if (query != null) {
            CallbackCommand c = CallbackCommand.create(query.getData());
            if (c != null) {
                c.dispatch(callbackCommandDispatcher,
                        query.getMessage(),
                        query.getFrom(),
                        query.getData());
            } else {
                LOG.warn("No command found for callback query '{}'", query.getData());
            }
        }
    }

    private void dispatchBotCommands(Message message) {
        for (MessageEntity e : message.getEntities()) {
            String rawCommand = e.extractCommand(message.getText());
            BotCommand command = BotCommand.create(botName, rawCommand);
            if (command == null) {
                LOG.info("Not a command for us: {}", rawCommand);
                continue;
            }

            try {
                command.dispatch(botCommandDispatcher, rawCommand, botName, message);
            } catch (TelegramShouldBeFineException ex) {
                LOG.warn("", ex);
            }
        }
    }

    private void lookForPhotos(Message message) {
        PhotoSize[] photos = message.getPhoto();
        if (photos != null && photos.length > 0) {
            callbackCommandDispatcher.handleReceiptWithoutPurchaseContext(message, message.getFrom(), photos[photos.length-1].getId());
        }
    }

    private void checkIfIJoinedAnExistingChat(Message message) {
        User[] newUsers = message.getNewChatMembers();
        if (newUsers != null) {
            for (User u : newUsers) {
                String username = u.getUserName();
                if (username != null) {
                    checkIfIJoinedANewChat(message.getChat(), u.getUserName().equals(botName));
                }
            }
        }
    }

    private void checkIfIJoinedANewChat(Chat chat, boolean groupChatCreated) {
        if (groupChatCreated) {
            LOG.info("I joined a new chat named '{}' with id {}",
                    chat.getTitle(),
                    chat.getId());
        }
    }
}
