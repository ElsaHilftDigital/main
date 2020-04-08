package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;

import java.util.UUID;

public interface CallbackDispatcher {

    void handleHelpOffer(Message message, UUID data);

    void handleConfirmingHelp(Message message, UUID purchaseId);

    void handleWithdrawingHelp(Message message, UUID purchaseId);

    void handleReceiptWithoutPurchaseContext(Message message, String fileId);

    void handleReceiptSubmission(Message message, UUID purchaseId);

    void handleCompletion(Message message, UUID purchaseId);

    void handleMoneyNotFound(Message message, UUID purchaseId);
}
