package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.*;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.repository.CustomerRepository;
import de.njsm.versusvirus.backend.telegram.dto.EditedMessage;
import de.njsm.versusvirus.backend.telegram.dto.InlineKeyboardButton;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.MessageToBeSent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class MessageSender {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramApiWrapper.class);

    private final TelegramApi api;

    private final TelegramMessages telegramMessages;

    private final CustomerRepository customerRepository;

    private final String domain;

    private final String urlGroupChat;

    private final long groupChatId;

    private final String supportUserName;

    @Autowired
    public MessageSender(@Value("${deployment.domain}") String domain,
                         TelegramApi api,
                         TelegramMessages telegramMessages,
                         CustomerRepository customerRepository,
                         @Value("${telegram.groupchat.url}") String urlGroupChat,
                         @Value("${telegram.groupchat.id}") long groupChatId,
                         @Value("${telegram.supportuser.name}") String supportUserName) {
        this.api = api;
        this.telegramMessages = telegramMessages;
        this.customerRepository = customerRepository;
        this.domain = domain;
        this.urlGroupChat = urlGroupChat;
        this.groupChatId = groupChatId;
        this.supportUserName = supportUserName;
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

    public void confirmRegistration(Volunteer volunteer) {
        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Volunteer {} has not yet talked to the bot",
                    volunteer.getUuid());
            return;
        }

        String text;
        String escapedFirstName = AdminMessageSender.escapeMarkdownCharacters(volunteer.getFirstName());
        if (volunteer.isValidated()) {
            String template = telegramMessages.getConfirmRegistration();
            text = MessageFormat.format(template, escapedFirstName, urlGroupChat);
        } else {
            String template = telegramMessages.getPreconfirmRegistration();
            text = MessageFormat.format(template, escapedFirstName);
        }

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(), text);
        api.sendMessage(message);
    }

    public void broadcastPurchase(Customer customer, Purchase purchase) {
        if (purchase.getStatus() != Purchase.Status.NEW) {
            LOG.warn("Tried to re-publish purchase {} in state {}. Rejected",
                    purchase.getUuid(),
                    purchase.getStatus());
            return;
        }

        MessageToBeSent message = composeBroadcastMessage(customer, purchase);
        Message sentMessage = api.sendMessage(message);
        purchase.setStatus(Purchase.Status.PUBLISHED);

        if (sentMessage != null) {
            purchase.setBroadcastMessageId(sentMessage.getId());
        } else {
            LOG.error("I would have expected to receive my sent message");
        }
    }

    public void updateBroadcastMessage(Customer customer, Purchase purchase) {
        if (purchase.getStatus() != Purchase.Status.PUBLISHED && purchase.getStatus() != Purchase.Status.VOLUNTEER_FOUND) {
            LOG.warn("Tried to edit purchase {} in state {}. Rejected",
                    purchase.getUuid(),
                    purchase.getStatus());
            return;
        }

        MessageToBeSent message = composeBroadcastMessage(customer, purchase);
        api.editMessage(new EditedMessage(message, purchase.getBroadcastMessageId()));
    }

    private MessageToBeSent composeBroadcastMessage(Customer customer, Purchase purchase) {
        String purchaseDesc = renderBroadcastPurchaseDescription(customer, purchase);

        String template = telegramMessages.getBroadcastPurchase();
        String callbackQuery = CallbackCommand.HELP_OFFER.render(purchase.getUuid());
        String text = MessageFormat.format(template, purchaseDesc, purchase.getVolunteerApplications().size());

        return new MessageToBeSent(groupChatId,
                text,
                new InlineKeyboardButton(telegramMessages.getOfferHelp(), callbackQuery));
    }

    private String renderBroadcastPurchaseDescription(Customer customer, Purchase purchase) {
        String purchaseDescTemplate = telegramMessages.getBroadcastPurchaseDescription();
        String supermarketList = purchase.getPurchaseSupermarketList().stream().map(PurchaseSupermarket::getName).collect(Collectors.joining(", "));
        String comment = purchase.getPublicComments();
        DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT)
                                            .withLocale(Locale.GERMAN)
                                            .withZone(ZoneId.systemDefault());
        return MessageFormat.format(
                purchaseDescTemplate,
                AdminMessageSender.escapeMarkdownCharacters(Long.toString(purchase.getId())),
                AdminMessageSender.escapeMarkdownCharacters(formatter.format(purchase.getExecutionTime())),
                AdminMessageSender.escapeMarkdownCharacters(customer.getAddress().getCity()),
                AdminMessageSender.escapeMarkdownCharacters(supermarketList),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getTiming()),
                purchase.getPurchaseSize().displayName(),
                AdminMessageSender.escapeMarkdownCharacters(comment)
        );
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

        String text = renderPrivatePurchaseList(purchase, customer);

        String acceptCommand = CallbackCommand.CONFIRM_HELP.render(purchase.getUuid());
        String rejectCommand = CallbackCommand.WITHDRAW_HELP.render(purchase.getUuid());
        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(),
                text,
                new InlineKeyboardButton(telegramMessages.getYes(), acceptCommand),
                new InlineKeyboardButton(telegramMessages.getNo(), rejectCommand));
        api.sendMessage(message);
    }

    private String renderPrivatePurchaseList(Purchase purchase, Customer customer) {
        StringBuilder purchaseList = new StringBuilder();
        for (PurchaseSupermarket m : purchase.getPurchaseSupermarketList()) {
            // This is telegram markdownv2 -> escape dashes
            purchaseList.append("*");
            var market = AdminMessageSender.escapeMarkdownCharacters(m.getName());
            purchaseList.append(market);
            purchaseList.append("*\n");

            for (OrderItem i : m.getPurchaseList()) {
                purchaseList.append("\\- ");
                var item = AdminMessageSender.escapeMarkdownCharacters(i.getPurchaseItem());
                purchaseList.append(item);
                purchaseList.append("\n");
            }
            purchaseList.append("\n");
        }

        String purchaseDescTemplate = telegramMessages.getPersonalPurchaseDescription();
        DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT)
                .withLocale(Locale.GERMAN)
                .withZone(ZoneId.systemDefault());
        String purchaseDesc = MessageFormat.format(
                purchaseDescTemplate,
                AdminMessageSender.escapeMarkdownCharacters(Long.toString(purchase.getId())),
                AdminMessageSender.escapeMarkdownCharacters(formatter.format(purchase.getExecutionTime())),
                AdminMessageSender.escapeMarkdownCharacters(customer.getFirstName()),
                AdminMessageSender.escapeMarkdownCharacters(customer.getLastName()),
                AdminMessageSender.escapeMarkdownCharacters(customer.getAddress().getAddress()),
                AdminMessageSender.escapeMarkdownCharacters(customer.getAddress().getZipCode().orElse("")),
                AdminMessageSender.escapeMarkdownCharacters(customer.getAddress().getCity()),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getTiming()),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getPrivateComments()),
                AdminMessageSender.escapeMarkdownCharacters(purchase.getPaymentMethod().displayName()),
                purchaseList.toString()
        );

        String template = telegramMessages.getOfferPurchase();
        return MessageFormat.format(
                template,
                purchaseDesc);
    }

    public void rejectApplicants(Customer customer, Purchase purchase, List<Volunteer> applicants) {
        applicants.forEach(applicant -> {
            if (purchase.getAssignedVolunteer().isEmpty() ||
                    !purchase.getAssignedVolunteer().get().equals(applicant.getId())) {

                sendRejectionToApplicant(applicant.getTelegramChatId(), customer, purchase);
            }
        });
    }

    public void removePurchaseDetailButtons(long chatId, long messageId, Purchase purchase, Customer customer) {
        String text = renderPrivatePurchaseList(purchase, customer);
        EditedMessage message = new EditedMessage(chatId,
                messageId,
                text);
        api.editMessage(message);
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
            Customer customer = customerRepository.findById(p.getCustomerId()).orElseThrow(() -> new RuntimeException("the purchase must have a customer"));
            result[i] = new InlineKeyboardButton(customer.getFirstName() + " " + customer.getLastName(),
                    CallbackCommand.SUBMIT_RECEIPT.render(p.getUuid()));
            i++;
        }
        return result;
    }

    public void informToDeliverPurchase(Purchase purchase, Volunteer volunteer, Customer customer, String messageToVolunteer) {
        if (volunteer.getTelegramChatId() == null) {
            LOG.warn("Cannot send telegram message as chat id is null");
            return;
        }

        if (purchase.getStatus() != Purchase.Status.CUSTOMER_NOTIFIED) {
            LOG.warn("Tried to instruct volunteer of purchase {} to deliver purchase in state {}. Rejected",
                    purchase.getUuid(),
                    purchase.getStatus());
            return;
        }

        String template = telegramMessages.getInformToDeliverPurchase();
        var escapedMessageToVolunteer = AdminMessageSender.escapeMarkdownCharacters("\nWICHTIG: " + messageToVolunteer);
        var customerString = AdminMessageSender.escapeMarkdownCharacters(customer.getFirstName() + " " + customer.getLastName());
        String text = MessageFormat.format(
                template,
                customerString,
                AdminMessageSender.escapeMarkdownCharacters(supportUserName),
                escapedMessageToVolunteer);

        String finishCommand = CallbackCommand.COMPLETE_PURCHASE.render(purchase.getUuid());
        String moneyMissingCommand = CallbackCommand.MONEY_MISSING.render(purchase.getUuid());

        InlineKeyboardButton[] buttons;
        if (purchase.getPaymentMethod() != Purchase.PaymentMethod.CASH) {
            buttons = new InlineKeyboardButton[] {
                    new InlineKeyboardButton(telegramMessages.getEverythingFound(), finishCommand),
            };
        } else {
            buttons = new InlineKeyboardButton[] {
                    new InlineKeyboardButton(telegramMessages.getEverythingFound(), finishCommand),
                    new InlineKeyboardButton(telegramMessages.getMoneyWasMissing(), moneyMissingCommand),
            };
        }

        MessageToBeSent message = new MessageToBeSent(volunteer.getTelegramChatId(),
                text,
                buttons);
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
        var template = telegramMessages.getThankForDoingPurchaseMessage();
        var text = MessageFormat.format(template, AdminMessageSender.escapeMarkdownCharacters(supportUserName));
        var m = new MessageToBeSent(chatId, text);
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

    public void warnVolunteerFromResignation(long chatId) {
        var m = new MessageToBeSent(chatId, telegramMessages.getVolunteerResignationWarning(),
                new InlineKeyboardButton("Account löschen", CallbackCommand.CONFIRM_DELETION.render(UUID.randomUUID())));
        api.sendMessage(m);
    }

    private void sendRejectionToApplicant(long chatId, Customer customer, Purchase purchase) {
        String template = telegramMessages.getRejectApplication();
        String text = MessageFormat.format(template, renderBroadcastPurchaseDescription(customer, purchase));
        var m = new MessageToBeSent(chatId, text);
        api.sendMessage(m);
    }
}
