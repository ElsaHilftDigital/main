package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.User;

import java.util.UUID;

public interface CallbackDispatcher {

    void handleHelpOffer(Message message, User user, UUID data);

    void handleConfirmingHelp(Message message, User user, UUID purchaseId);

    void handleWithdrawingHelp(Message message, User user, UUID purchaseId);

    void handleReceiptWithoutPurchaseContext(Message message, User user, String fileId);

    void handleReceiptSubmission(Message message, User user, UUID purchaseId);

    void handleCompletion(Message message, User user, UUID purchaseId);

    void handleMoneyNotFound(Message message, User user, UUID purchaseId);
}
