package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@Profile("dev")
public class TelegramApiMock implements TelegramApi, CallbackQueryReplyer {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiMock.class);

    @Override
    public Message sendMessage(MessageToBeSent message) {

        String buttons;
        if (message.getButtons() != null) {
            buttons = renderButtons(message.getButtons());
        } else {
            buttons = "";
        }

        LOG.info("Sending message to chat {}\n{}\n{}",
                message.getChatId(),
                message.getText(),
                buttons);

        User mockSelf = new User(1409, true, "Mock", "Bot", "mockbot");
        return new Message(1409, mockSelf, (int) Instant.now().getEpochSecond(), message.getText());
    }

    @Override
    public Message editMessage(EditedMessage message) {
        String buttons;
        if (message.getButtons() != null) {
            buttons = renderButtons(message.getButtons());
        } else {
            buttons = "";
        }

        LOG.info("Editing message in chat {}\n{}\n{}",
                message.getChatId(),
                message.getText(),
                buttons);

        User mockSelf = new User(1409, true, "Mock", "Bot", "mockbot");
        return new Message(1409, mockSelf, (int) Instant.now().getEpochSecond(), message.getText());
    }

    private String renderButtons(InlineKeyboardMarkup buttons) {
        StringBuilder buttonRenderer = new StringBuilder();
        for (InlineKeyboardButton[] row : buttons.getButtons()) {
            for (InlineKeyboardButton button : row) {
                buttonRenderer.append("[ ");
                buttonRenderer.append(button.getText());
                buttonRenderer.append(" (data: ");
                buttonRenderer.append(button.getCallbackData());
                buttonRenderer.append(") ]\n");
            }
        }
        return buttonRenderer.toString();
    }

    @Override
    public void deleteMessage(long chatId, long messageId) {
        LOG.info("Mock sincerely deleted message {} in chat {}",
                messageId,
                chatId);
    }

    @Override
    public byte[] getFile(String fileId) {
        LOG.info("Sorry, the mock has no image to serve");
        return new byte[0];
    }

    @Override
    public void answerCallbackQuery(CallbackQueryAnswer query) {
    }
}
