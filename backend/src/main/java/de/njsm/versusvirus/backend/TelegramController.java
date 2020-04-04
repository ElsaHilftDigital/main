package de.njsm.versusvirus.backend;

import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.BotCommand;
import de.njsm.versusvirus.backend.telegram.BotCommandDispatcher;
import de.njsm.versusvirus.backend.telegram.TelegramBotCommandDispatcher;
import de.njsm.versusvirus.backend.telegram.UpdateService;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageEntity;
import de.njsm.versusvirus.backend.telegram.dto.PhotoSize;
import de.njsm.versusvirus.backend.telegram.dto.Update;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    public TelegramController(TelegramBotCommandDispatcher botCommandDispatcher, UpdateService updateService) {
        this.botCommandDispatcher = botCommandDispatcher;
        this.updateService = updateService;
    }

    @PostMapping(TELEGRAM_WEBHOOK)
    public void receiveTelegramUpdate(@RequestBody Update update) {
        if (update.getMessage() == null) {
            LOG.info("I don't feel responsible for this update");
            return;
        }

        if (update.getId() <= updateService.getLatestUpdate()) {
            LOG.info("Repost of update " + update.getId());
            return;
        }
        updateService.setLatestUpdate(update.getId());

        Message message = update.getMessage();

        PhotoSize[] photos = message.getPhoto();
        if (photos != null && photos.length > 0) {
            botCommandDispatcher.handleReceiptWithoutPurchaseContext(message, photos[photos.length-1].getId());
        }

        if (message.getText() == null || message.getText().isEmpty()) {
            LOG.info("No message found");
            return;
        }

        if (message.getEntities() == null) {
            LOG.info("The message didn't contain commands");
            return;
        }

        for (MessageEntity e : message.getEntities()) {
            String rawCommand = e.extractCommand(message.getText());
            BotCommand command = BotCommand.create(rawCommand);
            if (command == null) {
                LOG.info("Not a command for us: {}", rawCommand);
                continue;
            }

            try {
                command.dispatch(botCommandDispatcher, rawCommand, message);
            } catch (TelegramShouldBeFineException ex) {
                LOG.warn("", ex);
            }
        }
    }
}
