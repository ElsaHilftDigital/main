package de.njsm.versusvirus.backend;

import de.njsm.versusvirus.backend.telegram.dto.PhotoSize;
import de.njsm.versusvirus.backend.telegram.dto.Update;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TelegramController {

    @GetMapping("/telegram/the/next/path/is/a/password/Wz4Bg0pZUybWCbyjjRxpol")
    public void receiveTelegramUpdate(Update update) {
        /*

            - check if this is new (update_offset)

            Telegram messages:

            - New helper registers

            - Existing helper quits

            - Offer help (id of purchase)

            - confirm help (id of purchase)

            - withdraw help (id of purchase)

            - submit receipt (picture)
         */
    }

    private void handleNewHelper() {
        /*

            if helper is not known to us -> send to registration form

         */
    }

    private void handleLeavingHelper() {
        /*
            if helper not known -> no problem :)

            Thank them for their help!
         */
    }

    private void handleHelpOffering(String purchaseId) {
        /*

            if purchase is assigned -> reply

            if not -> assign / schedule....

         */
    }

    private void handleConfirmingHelp(String purchaseId) {
        /*

            if different volunteer than assigned by us -> tell them not to hack

            if not -> mark as assigned, remove offer from group chat

         */
    }

    private void handleRejectingHelp(String purchaseId) {
        /*

            if different volunteer than assigned by us -> tell them not to hack

            if not -> reschedule

         */
    }

    private void handleReceiptSubmission(String purchaseId, PhotoSize[] photos) {
        /*

            if different volunteer than assigned by us -> tell them not to hack

            download picture and

         */
    }
}
