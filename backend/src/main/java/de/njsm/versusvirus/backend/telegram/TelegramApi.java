package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.EditedMessage;
import de.njsm.versusvirus.backend.telegram.dto.Image;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;

public interface TelegramApi {
    Message sendMessage(MessageToBeSent message);

    Message editMessage(EditedMessage message);

    void deleteMessage(long chatId, long messageId);

    Image getFile(String fileId);
}
