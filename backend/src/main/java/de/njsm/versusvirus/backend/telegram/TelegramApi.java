package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;

public interface TelegramApi {
    Message sendMessage(MessageToBeSent message);

    void deleteMessage(long chatId, long messageId);

    byte[] getFile(String fileId);
}
