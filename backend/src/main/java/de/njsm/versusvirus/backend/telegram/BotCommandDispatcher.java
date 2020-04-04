package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;

import java.util.UUID;

public interface BotCommandDispatcher {

    void handleNewHelper(Message message, UUID userId);

    void handleLeavingHelper(Message message);

    void handleHelpOffering(Message message, String purchaseId);

    void handleConfirmingHelp(Message message, String purchaseId);

    void handleRejectingHelp(Message message, String purchaseId);

    void handleReceiptSubmission(Message message, String purchaseId, String fileId);
}
