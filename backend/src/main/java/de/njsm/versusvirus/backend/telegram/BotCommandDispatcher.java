package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;

import java.util.UUID;

public interface BotCommandDispatcher {

    void handleNewHelper(Message message, UUID userId);

    void handleLeavingHelper(Message message);

    void handleHelpOffering(Message message, UUID purchaseId);

    void handleConfirmingHelp(Message message, UUID purchaseId);

    void handleRejectingHelp(Message message, UUID purchaseId);

    void handleReceiptWithoutPurchaseContext(Message message, String fileId);

    void handleReceiptSubmission(Message message, UUID purchaseId);

    void handleCompletion(Message message, UUID purchaseId, boolean isSuccess);
}
