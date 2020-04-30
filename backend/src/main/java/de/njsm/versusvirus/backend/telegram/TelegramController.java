package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.dto.*;
import io.prometheus.client.Counter;
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

    private static final Counter CALLBACK_QUERIES = Counter.build()
            .name("telegram_callback_queries")
            .help("Number of received callback queries")
            .labelNames("type")
            .register();

    private static final Counter BOT_COMMANDS = Counter.build()
            .name("telegram_bot_commands")
            .help("Number received bot commands")
            .labelNames("type")
            .register();

    private static final Counter FORWARDED_MESSAGES = Counter.build()
            .name("telegram_forwarded_messages")
            .help("Number of forwarded messages from volunteers")
            .register();

    private final BotCommandDispatcher botCommandDispatcher;

    private final UpdateService updateService;

    private final OrganizationRepository organizationRepository;

    private final VolunteerRepository volunteerRepository;

    private final String botName;

    private final CallbackDispatcher callbackCommandDispatcher;

    private final AdminMessageSender adminMessageSender;

    private final CallbackQueryReplyer callbackQueryReplyer;

    private final long groupChatId;

    private final long moderatorChatId;

    public TelegramController(TelegramBotCommandDispatcher botCommandDispatcher,
                              UpdateService updateService,
                              OrganizationRepository organizationRepository,
                              VolunteerRepository volunteerRepository,
                              @Value("${telegram.bot.name}") String botName,
                              CallbackDispatcher callbackCommandDispatcher,
                              AdminMessageSender adminMessageSender,
                              CallbackQueryReplyer callbackQueryReplyer,
                              @Value("${telegram.groupchat.id}") long groupChatId,
                              @Value("${telegram.groupchat.id}") long moderatorChatId) {
        this.botCommandDispatcher = botCommandDispatcher;
        this.updateService = updateService;
        this.organizationRepository = organizationRepository;
        this.volunteerRepository = volunteerRepository;
        this.botName = botName;
        this.callbackCommandDispatcher = callbackCommandDispatcher;
        this.adminMessageSender = adminMessageSender;
        this.callbackQueryReplyer = callbackQueryReplyer;
        this.groupChatId = groupChatId;
        this.moderatorChatId = moderatorChatId;
    }

    @PostMapping(TELEGRAM_WEBHOOK)
    public void receiveTelegramUpdate(@RequestBody Update update) {
        try {
            receiveTelegramUpdateInternal(update);
        } catch (TelegramShouldBeFineException e) {
            LOG.info("Something went wrong", e);
            throw e;
        }
    }

    private void receiveTelegramUpdateInternal(@RequestBody Update update) {
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
        LOG.info("Received message from user {} {} {} {}",
                message.getFrom().getFirstName(),
                message.getFrom().getLastName(),
                message.getFrom().getUserName(),
                message.getFrom().getId());


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
        volunteerRepository.findByTelegramUserIdAndDeleted(message.getFrom().getId(), false).ifPresent(v -> {
            if (message.getChat().getId() != moderatorChatId &&
                    message.getChat().getId() != groupChatId) {
                LOG.info("Forwarding message from " + message.getFrom().getUserName());
                adminMessageSender.forwardVolunteerMessage(message);
                FORWARDED_MESSAGES.inc();
            }
        });
    }

    private void dispatchCallbackQuery(Update update) {
        CallbackQuery query = update.getCallbackQuery();
        if (query != null) {
            CallbackCommand c = CallbackCommand.create(query.getData());
            if (c != null) {
                CALLBACK_QUERIES.labels(c.name()).inc();
                c.dispatch(callbackCommandDispatcher,
                        query.getMessage(),
                        query.getFrom(),
                        query.getData());
                callbackQueryReplyer.answerCallbackQuery(new CallbackQueryAnswer(query));
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

            BOT_COMMANDS.labels(command.name()).inc();
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
            callbackCommandDispatcher.handleReceiptWithoutPurchaseContext(message, message.getFrom(), photos[photos.length - 1].getId());
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
