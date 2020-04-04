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
    private TelegramMessages telegramMessages;

    @Autowired
    public MessageFacade(TelegramApiWrapper api, TelegramMessages telegramMessages) {
        this.api = api;
        this.telegramMessages = telegramMessages;
    }

    public void directUserToRegistrationForm(long chatId) {
        String template = telegramMessages.getUnknownVolunteer();
        String text = MessageFormat.format(template, "https://versusvirus.njsm.de/#/register");

        MessageToBeSent message = new MessageToBeSent(chatId, text);
        api.sendMessage(message);
    }

    public void resignVolunteer(long chatId) {
        String text = telegramMessages.getVolunteerResignation();
        MessageToBeSent message = new MessageToBeSent(chatId, text);
        api.sendMessage(message);
    }

    public void resignUnknownVolunteer(long chatId) {
        String text = telegramMessages.getUnknownVolunteerResignation();
        MessageToBeSent message = new MessageToBeSent(chatId, text);
        api.sendMessage(message);
    }

    public void informPurchaseHasBeenAssigned(long chatId) {
        MessageToBeSent message = new MessageToBeSent(chatId, telegramMessages.getPurchaseAlreadyTaken());
        api.sendMessage(message);
    }

    public void confirmRegistration(Organization organization, Volunteer volunteer) {

        if (volunteer.getTelegramChatId() == null) {
            LOG.info("Helper has not yet talked to the bot");
            return;
        }

        String text;
        if (volunteer.isValidated()) {
            String template = telegramMessages.getConfirmRegistration();
            String groupChatJoinUrl = organization.getUrlGroupChat();
            text = MessageFormat.format(template, volunteer.getFirstName(), groupChatJoinUrl);
        } else {
            String template = telegramMessages.getPreconfirmRegistration();
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

        String template = telegramMessages.getBroadcastPurchase();
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

        String template = telegramMessages.getOfferPurchase();
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

        String template = telegramMessages.getConfirmPurchaseMapping();
        String renderedPurchaseList = renderPurchaseList(fileId, purchases);
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

        String template = telegramMessages.getInformToDeliverPurchase();
        String text = MessageFormat.format(
                template,
                purchase.getUuid());

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
    }

    public static String renderPurchaseList(String fileId, List<Purchase> purchases) {
        StringBuilder builder = new StringBuilder();
        for (Purchase p : purchases) {
            builder.append("* ");
            builder.append("[");
            builder.append(p.getSupermarket());
            builder.append("](");
            builder.append(BotCommand.QUITTUNG_EINREICHEN.render(fileId, p.getUuid().toString()));
            builder.append(")\n");
        }
        return builder.toString();
    }

    public void blameHackingUser(long chatId) {
        MessageToBeSent message = new MessageToBeSent(chatId, telegramMessages.getBlameHackingUser());
        api.sendMessage(message);
    }
}
