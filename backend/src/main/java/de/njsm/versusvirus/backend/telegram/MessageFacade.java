package de.njsm.versusvirus.backend.telegram;

import org.springframework.beans.factory.annotation.Autowired;

public class MessageFacade {

    private TelegramApiWrapper api;

    @Autowired
    public MessageFacade(TelegramApiWrapper api) {
        this.api = api;
    }

    public void confirmPreliminaryRegistration(/*User*/) {
        /*

        if confirmed:
        confirmRegistration()

        else:

        "you have been registered and we check your data"
        -> tell them to wait

         */
    }

    public void confirmRegistration(/*User*/) {
        /*
        You have been successfully registered. Join the group chat here (URL)
         */
    }

    public void broadcastPurchase(/*Purchase*/) {

    }

    public void offerPurchase(/*Purchase, User*/) {

    }

    public void confirmReceiptPurchaseMapping(/* User, fileId, List<Purchase>*/) {

    }

    public void informToDeliverPurchase(/* User, Purchase */) {

    }
}
