package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Organization;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class MessageFacade {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiWrapper.class);

    private TelegramApiWrapper api;

    @Autowired
    public MessageFacade(TelegramApiWrapper api) {
        this.api = api;
    }

    public void confirmRegistration(Organization organization, Volunteer volunteer) {

        if (volunteer.getTelegramChatId() == null) {
            LOG.info("Helper has not yet talked to the bot");
            return;
        }

        String text;
        if (volunteer.isValidated()) {
            String template = MessageTemplates.CONFIRM_REGISTRATION.getTemplate();
            text = String.format(template, volunteer.getFirstName(), "");
        } else {
            String template = MessageTemplates.CONFIRM_PRELIMINARY_REGISTRATION.getTemplate();
            text = String.format(template, volunteer.getFirstName());
        }

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
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
