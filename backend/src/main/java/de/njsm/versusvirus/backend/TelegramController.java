package de.njsm.versusvirus.backend;

import de.njsm.versusvirus.backend.telegram.BotCommand;
import de.njsm.versusvirus.backend.telegram.BotCommandDispatcher;
import de.njsm.versusvirus.backend.telegram.TelegramBotCommandDispatcher;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageEntity;
import de.njsm.versusvirus.backend.telegram.dto.Update;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TelegramController {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramController.class);

    public static final String TELEGRAM_WEBHOOK = "/telegram/the/next/path/is/a/password/Wz4Bg0pZUybWCbyjjRxpol";

    private final BotCommandDispatcher botCommandDispatcher;

    public TelegramController(TelegramBotCommandDispatcher botCommandDispatcher) {
        this.botCommandDispatcher = botCommandDispatcher;
    }

    @GetMapping(TELEGRAM_WEBHOOK)
    public void receiveTelegramUpdate(Update update) {
        if (update.getMessage() == null) {
            LOG.info("I don't feel responsible for this update");
            return;
        }

        // TODO check if update is new via update_offset

        Message message = update.getMessage();

        if (message.getText() == null || message.getText().isEmpty()) {
            LOG.info("No message found");
            return;
        }

        if (message.getEntities() == null) {
            LOG.info("The message didn't contain commands");
            return;
        }

        if (message.getPhoto() != null && message.getPhoto().length > 0) {
            botCommandDispatcher.handleReceiptWithoutPurchaseContext(message, message.getPhoto()[0].getId());
            return;
        }

        for (MessageEntity e : message.getEntities()) {
            String rawCommand = e.extractCommand(message.getText());
            BotCommand command = BotCommand.create(rawCommand);
            if (command == null) {
                LOG.info("Not a command for us: {}", rawCommand);
                continue;
            }
            command.dispatch(botCommandDispatcher, rawCommand, message);
        }
    }
}
