package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Customer;
import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Organization;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.repository.CustomerRepository;
import de.njsm.versusvirus.backend.telegram.dto.InlineKeyboardButton;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.util.List;

@Component
public class MessageSender {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiWrapper.class);

    private TelegramApi api;
    private TelegramMessages telegramMessages;
    private final CustomerRepository customerRepository;

    private String domain;

    @Autowired
    public MessageSender(@Value("${deployment.domain}") String domain, TelegramApi api, TelegramMessages telegramMessages, CustomerRepository customerRepository) {
        this.api = api;
        this.telegramMessages = telegramMessages;
        this.customerRepository = customerRepository;
        this.domain = domain;
    }

    public void directUserToRegistrationForm(long chatId) {
        String template = telegramMessages.getUnknownVolunteer();
        String text = MessageFormat.format(template, "https://" + domain + "/#/register");

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
            LOG.warn("Volunteer {} has not yet talked to the bot",
                    volunteer.getUuid());
            return;
        }

        String text;
        String escapedFirstName = AdminMessageSender.escapeMarkdownCharacters(volunteer.getFirstName());
        if (volunteer.isValidated()) {
            String template = telegramMessages.getConfirmRegistration();
            String groupChatJoinUrl = organization.getUrlGroupChat();
            text = MessageFormat.format(template, escapedFirstName, groupChatJoinUrl);
        } else {
            String template = telegramMessages.getPreconfirmRegistration();
            text = MessageFormat.format(template, escapedFirstName);
        }

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
    }

    /**
     * Save the purchase to the repo after calling!
     */
    public void broadcastPurchase(Organization organization, Customer customer, Purchase purchase) {
        if (organization.getTelegramGroupChatId() == null) {
            LOG.warn("Cannot broadcast as group chat id is null");
            return;
        }

        if (purchase.getStatus() != Purchase.Status.NEW) {
            LOG.warn("Tried to re-publish purchase {} in state {}. Rejected",
                    purchase.getUuid(),
                    purchase.getStatus());
            return;
        }

        String purchaseDescTemplate = telegramMessages.getBroadcastPurchaseDescription();
        String purchaseDesc = MessageFormat.format(
                purchaseDescTemplate,
                AdminMessageSender.escapeMarkdownCharacters(customer.getAddress().getCity()),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getSupermarket()),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getTiming()),
                purchase.getPurchaseSize().displayName()
        );

        String template = telegramMessages.getBroadcastPurchase();
        String callbackQuery = CallbackCommand.HELP_OFFER.render(purchase.getUuid());
        String text = MessageFormat.format(template, purchaseDesc);

        MessageToBeSent message = new MessageToBeSent(organization.getTelegramGroupChatId(),
                text,
                new InlineKeyboardButton(telegramMessages.getOfferHelp(), callbackQuery));
        Message sentMessage = api.sendMessage(message);

        if (sentMessage != null) {
            purchase.setBroadcastMessageId(sentMessage.getId());
        } else {
            LOG.error("I would have expected to receive my sent message");
        }
    }

    public void offerPurchase(Purchase purchase, Customer customer, Volunteer volunteer) {
        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Cannot send telegram message as chat id is null");
            return;
        }

        if (purchase.getStatus() != Purchase.Status.VOLUNTEER_FOUND) {
            LOG.warn("Tried to re-publish purchase {} in state {}. Rejected",
                    purchase.getUuid(),
                    purchase.getStatus());
            return;
        }

        StringBuilder purchaseList = new StringBuilder();
        for (OrderItem i : purchase.getPurchaseList()) {
            // This is telegram markdownv2 -> escape dashes
            purchaseList.append("\\- ");
            var item = AdminMessageSender.escapeMarkdownCharacters(i.getPurchaseItem());
            purchaseList.append(item);
            purchaseList.append("\n");
        }

        String purchaseDescTemplate = telegramMessages.getPersonalPurchaseDescription();
        String purchaseDesc = MessageFormat.format(
                purchaseDescTemplate,
                AdminMessageSender.escapeMarkdownCharacters(customer.getFirstName()),
                AdminMessageSender.escapeMarkdownCharacters(customer.getLastName()),
                AdminMessageSender.escapeMarkdownCharacters(customer.getAddress().getAddress()),
                AdminMessageSender.escapeMarkdownCharacters(customer.getAddress().getZipCode()),
                AdminMessageSender.escapeMarkdownCharacters(customer.getAddress().getCity()),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getComments()),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getSupermarket()),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getPaymentMethod().displayName()),
                purchaseList.toString()
        );

        String template = telegramMessages.getOfferPurchase();
        String acceptCommand = CallbackCommand.CONFIRM_HELP.render(purchase.getUuid());
        String rejectCommand = CallbackCommand.WITHDRAW_HELP.render(purchase.getUuid());
        String text = MessageFormat.format(
                template,
                purchaseDesc);

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(),
                text,
                new InlineKeyboardButton(telegramMessages.getYes(), acceptCommand),
                new InlineKeyboardButton(telegramMessages.getNo(), rejectCommand));
        api.sendMessage(message);
    }

    public void confirmReceiptPurchaseMapping(Volunteer volunteer, List<Purchase> purchases) {
        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Cannot send telegram message as chat id is null");
            return;
        }

        String text;
        if (purchases.size() > 0) {
            text = telegramMessages.getConfirmPurchaseMapping();
        } else {
            text = telegramMessages.getNoActivePurchases();
        }
        InlineKeyboardButton[] purchaseButtons = renderPurchaseList(purchases);

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text, purchaseButtons);
        api.sendMessage(message);
    }

    private InlineKeyboardButton[] renderPurchaseList(List<Purchase> purchases) {
        InlineKeyboardButton[] result = new InlineKeyboardButton[purchases.size()];
        int i = 0;
        for (Purchase p : purchases) {
            Customer customer = customerRepository.findById(p.getCustomer()).orElseThrow(() -> new RuntimeException("the purchase must have a customer"));
            result[i] = new InlineKeyboardButton(customer.getFirstName() + " " + customer.getLastName(),
                    CallbackCommand.SUBMIT_RECEIPT.render(p.getUuid()));
            i++;
        }
        return result;
    }

    /**
     * Save the purchase to the repo after calling!
     */
    public void informToDeliverPurchase(Purchase purchase, Volunteer volunteer, Customer customer) {
        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Cannot send telegram message as chat id is null");
            return;
        }

        if (purchase.getStatus() != Purchase.Status.CUSTOMER_NOTIFIED) {
            LOG.warn("Tried to instruct volunteer of purchase {} to deliver purchase in illegal state {}. Rejected",
                    purchase.getUuid(),
                    purchase.getStatus());
            return;
        }

        String template = telegramMessages.getInformToDeliverPurchase();
        var customerString = AdminMessageSender.escapeMarkdownCharacters(customer.getFirstName() + " " + customer.getLastName());
        String text = MessageFormat.format(
                template,
                customerString);

        String finishCommand = CallbackCommand.COMPLETE_PURCHASE.render(purchase.getUuid());
        String moneyMissingCommand = CallbackCommand.MONEY_MISSING.render(purchase.getUuid());

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(),
                text,
                new InlineKeyboardButton(telegramMessages.getEverythingFound(), finishCommand),
                new InlineKeyboardButton(telegramMessages.getMoneyWasMissing(), moneyMissingCommand));
        api.sendMessage(message);

        purchase.setStatus(Purchase.Status.PURCHASE_IN_DELIVERY);
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

    public void confirmCompletion(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getConfirmCompletion());
        api.sendMessage(m);
    }

    public void confirmInvestigation(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getConfirmInvestigation());
        api.sendMessage(m);
    }

    public void sendUnexpectedImage(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getUnexpectedImage());
        api.sendMessage(m);
    }
}
