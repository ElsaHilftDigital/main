package de.njsm.versusvirus.backend;

import de.njsm.versusvirus.backend.repository.OrganizationRepository;
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

    private final OrganizationRepository organizationRepository;

    private final String botName;

    private final CallbackDispatcher callbackCommandDispatcher;

    private final AdminMessageSender adminMessageSender;

    public TelegramController(TelegramBotCommandDispatcher botCommandDispatcher,
                              UpdateService updateService,
                              OrganizationRepository organizationRepository,
                              @Value("${telegram.bot.name}") String botName,
                              CallbackDispatcher callbackCommandDispatcher,
                              AdminMessageSender adminMessageSender) {
        this.botCommandDispatcher = botCommandDispatcher;
        this.updateService = updateService;
        this.organizationRepository = organizationRepository;
        this.botName = botName;
        this.callbackCommandDispatcher = callbackCommandDispatcher;
        this.adminMessageSender = adminMessageSender;
    }

    @PostMapping(TELEGRAM_WEBHOOK)
    public void receiveTelegramUpdate(@RequestBody Update update) {
        if (update.getId() <= updateService.getLatestUpdate()) {
            LOG.info("Repost of update " + update.getId());
            return;
        }
        updateService.setLatestUpdate(update.getId());

        dispatchCallbackQuery(update);

        Message message = update.getMessage();
        if (message == null) {
            LOG.info("No message found");
            return;
        }

        checkIfIJoinedAnExistingChat(message);
        checkIfIJoinedANewChat(message.getChat(), message.isGroupChatCreated());
        lookForPhotos(message);

        if (message.getText() == null || message.getText().isEmpty()) {
            LOG.info("No message found");
            return;
        }

        forwardMessageFromPersonalChat(message);

        if (message.getEntities() == null) {
            LOG.info("The message didn't contain commands");
            return;
        }

        dispatchBotCommands(message);
    }

    private void forwardMessageFromPersonalChat(Message message) {
        organizationRepository.findById(1).ifPresent(o -> {
            if (message.getChat().getId() != o.getTelegramModeratorGroupChatId() &&
                message.getChat().getId() != o.getTelegramGroupChatId()) {
                LOG.info("Forwarding message from " + message.getFrom().getUserName());
                adminMessageSender.forwardVolunteerMessage(o.getTelegramModeratorGroupChatId(), message);
            }
        });
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
