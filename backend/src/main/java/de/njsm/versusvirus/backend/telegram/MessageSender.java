package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Customer;
import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Organization;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.repository.CustomerRepository;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.util.List;

@Component
public class MessageSender {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiWrapper.class);

    private TelegramApiWrapper api;
    private TelegramMessages telegramMessages;
    private final CustomerRepository customerRepository;

    @Autowired
    public MessageSender(TelegramApiWrapper api, TelegramMessages telegramMessages, CustomerRepository customerRepository) {
        this.api = api;
        this.telegramMessages = telegramMessages;
        this.customerRepository = customerRepository;
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

    /**
     * Save the purchase to the repo after calling!
     * TODO link
     */
    public void broadcastPurchase(Organization organization, Customer customer, Purchase purchase) {

        if (organization.getTelegramGroupChatId() == null) {
            LOG.warn("Cannot broadcast as group chat id is null");
            return;
        }

        String purchaseDescTemplate = telegramMessages.getBroadcastPurchaseDescription();
        String purchaseDesc = MessageFormat.format(
                purchaseDescTemplate,
                customer.getAddress().getCity(),
                purchase.getSupermarket(),
                purchase.getTiming(),
                purchase.getPurchaseSize().displayName()
        );


        String template = telegramMessages.getBroadcastPurchase();
        String botCommand = BotCommand.HILFE_ANBIETEN.render(purchase.getUuid().toString());
        String text = MessageFormat.format(template, purchaseDesc, botCommand);

        MessageToBeSent message = new MessageToBeSent(organization.getTelegramGroupChatId(), text);
        Message sentMessage = api.sendMessage(message);

        purchase.setBroadcastMessageId(sentMessage.getId());
    }

    // TODO link
    public void offerPurchase(Purchase purchase, Customer customer, Volunteer volunteer) {

        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Cannot send telegram message as chat id is null");
            return;
        }

        StringBuilder builder = new StringBuilder();
        for (OrderItem i : purchase.getPurchaseList()) {
            builder.append("* ");
            builder.append(i.getPurchaseItem());
            builder.append("\n");
        }

        String purchaseDescTemplate = telegramMessages.getPersonalPurchaseDescription();
        String purchaseDesc = MessageFormat.format(
                purchaseDescTemplate,
                customer.getFirstName(),
                customer.getLastName(),
                customer.getAddress().getAddress(),
                customer.getAddress().getZipCode(),
                customer.getAddress().getCity(),
                purchase.getComments(),
                builder.toString()
        );

        String template = telegramMessages.getOfferPurchase();
        String acceptCommand = BotCommand.HILFE_BESTAETIGEN.render(purchase.getUuid().toString());
        String rejectCommand = BotCommand.HILFE_ZURUECKZIEHEN.render(purchase.getUuid().toString());
        String text = MessageFormat.format(
                template,
                purchaseDesc,
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

        String text;
        if (purchases.size() > 0) {
            String template = telegramMessages.getConfirmPurchaseMapping();
            String renderedPurchaseList = renderPurchaseList(fileId, purchases);
            text = MessageFormat.format(
                    template,
                    renderedPurchaseList);
        } else {
            text = telegramMessages.getNoActivePurchases();
        }

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
    }

    // TODO link
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

    public String renderPurchaseList(String fileId, List<Purchase> purchases) {
        StringBuilder builder = new StringBuilder();
        for (Purchase p : purchases) {
            Customer customer = customerRepository.findById(p.getCustomer()).orElseThrow(() -> new RuntimeException("the purchase must have a customer"));
            builder.append("* ");
            builder.append("[");
            builder.append(customer.getFirstName());
            builder.append(" ");
            builder.append(customer.getLastName());
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

    public void confirmHelpOfferingReceived(long chatId) {
        MessageToBeSent m = new MessageToBeSent(chatId, telegramMessages.getThankForOfferingHelp());
        api.sendMessage(m);
    }

    public void confirmConfirmation(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getThankForDoingPurchaseMessage());
        api.sendMessage(m);
    }

    public void sendUnexpectedMessage(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getUnexpectedMessage());
        api.sendMessage(m);
    }

    public void confirmReceiptUpload(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getConfirmReceiptUpload());
        api.sendMessage(m);
    }

    public void confirmRejection(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getConfirmRejection());
        api.sendMessage(m);
    }
}
