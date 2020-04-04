package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Organization;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.util.List;

@Component
public class MessageFacade {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiWrapper.class);

    private TelegramApiWrapper api;

    @Autowired
    public MessageFacade(TelegramApiWrapper api) {
        this.api = api;
    }

    public void directUserToRegistrationForm(int chatId) {
        String template = MessageTemplates.UNKNOWN_HELPER.getTemplate();
        String text = MessageFormat.format(template, "https://versusvirus.njsm.de/#/register");

        MessageToBeSent message = new MessageToBeSent(chatId, text);
        api.sendMessage(message);
    }
    
    public void resignVolunteer(int chatId) {
        String text = MessageTemplates.HELPER_RESIGNATION.getTemplate();
        MessageToBeSent message = new MessageToBeSent(chatId, text);
        api.sendMessage(message);
    }

    public void resignUnknownVolunteer(int chatId) {
        String text = MessageTemplates.UNKNOWN_HELPER_RESIGNATION.getTemplate();
        MessageToBeSent message = new MessageToBeSent(chatId, text);
        api.sendMessage(message);
    }

    public void confirmRegistration(Organization organization, Volunteer volunteer) {

        if (volunteer.getTelegramChatId() == null) {
            LOG.info("Helper has not yet talked to the bot");
            return;
        }

        String text;
        if (volunteer.isValidated()) {
            String template = MessageTemplates.CONFIRM_REGISTRATION.getTemplate();
            String groupChatJoinUrl = BotCommand.START.render(organization.getUrlGroupChat());
            text = MessageFormat.format(template, volunteer.getFirstName(), groupChatJoinUrl);
        } else {
            String template = MessageTemplates.CONFIRM_PRELIMINARY_REGISTRATION.getTemplate();
            text = MessageFormat.format(template, volunteer.getFirstName());
        }

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
    }

    public void broadcastPurchase(Organization organization, Purchase purchase) {

        if (organization.getTelegramGroupChatId() == null) {
            LOG.warn("Cannot broadcast as group chat id is null");
            return;
        }

        String template = MessageTemplates.BROADCAST_PURCHASE.getTemplate();
        String botCommand = BotCommand.HILFE_ANBIETEN.render(purchase.getUuid().toString());
        String text = MessageFormat.format(template, purchase.getDescriptionForGroupChat(), botCommand);

        MessageToBeSent message = new MessageToBeSent(organization.getTelegramGroupChatId(), text);
        api.sendMessage(message);
    }

    public void offerPurchase(Purchase purchase, Volunteer volunteer) {

        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Cannot send telegram message as chat id is null");
            return;
        }

        String template = MessageTemplates.OFFER_PURCHASE.getTemplate();
        String acceptCommand = BotCommand.HILFE_BESTAETIGEN.render(purchase.getUuid().toString());
        String rejectCommand = BotCommand.HILFE_ZURUECKZIEHEN.render(purchase.getUuid().toString());
        String text = MessageFormat.format(
                template,
                purchase.getDescriptionForPersonalChat(),
                acceptCommand,
                rejectCommand);

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
    }

    public void confirmReceiptPurchaseMapping(Volunteer volunteer, String fileId, List<Purchase> purchases) {
        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Cannot send telegram message as chat id is null");
            return;
        }

        String template = MessageTemplates.CONFIRM_PURCHASE_MAPPING.getTemplate();
        String renderedPurchaseList = MessageTemplates.renderPurchaseList(fileId, purchases);
        String text = MessageFormat.format(
                template,
                renderedPurchaseList);

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
    }

    public void informToDeliverPurchase(Purchase purchase, Volunteer volunteer) {
        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Cannot send telegram message as chat id is null");
            return;
        }

        String template = MessageTemplates.INFORM_TO_DELIVER_PURCHASE.getTemplate();
        String text = MessageFormat.format(
                template,
                purchase.getUuid());

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
    }
}
