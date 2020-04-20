package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Customer;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.repository.CustomerRepository;
import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.User;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.mime.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@Transactional
public class InlineButtonCallbackDispatcher implements CallbackDispatcher {

    private static final Logger LOG = LoggerFactory.getLogger(InlineButtonCallbackDispatcher.class);

    private final OrganizationRepository organizationRepository;

    private final VolunteerRepository volunteerRepository;

    private final PurchaseRepository purchaseRepository;

    private final MessageSender messageSender;

    private final AdminMessageSender adminMessageSender;

    private final TelegramApi telegramApi;

    private final CustomerRepository customerRepository;

    public InlineButtonCallbackDispatcher(OrganizationRepository organizationRepository,
                                          VolunteerRepository volunteerRepository,
                                          PurchaseRepository purchaseRepository,
                                          MessageSender messageSender,
                                          AdminMessageSender adminMessageSender, TelegramApi telegramApi, CustomerRepository customerRepository) {
        this.organizationRepository = organizationRepository;
        this.volunteerRepository = volunteerRepository;
        this.purchaseRepository = purchaseRepository;
        this.messageSender = messageSender;
        this.adminMessageSender = adminMessageSender;
        this.telegramApi = telegramApi;
        this.customerRepository = customerRepository;
    }


    @Override
    public void handleHelpOffer(Message message, User user, UUID data) {
        var purchase = purchaseRepository.findByUuid(data).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Organization not found");
        });
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Purchase has no customer");
        });

        if (purchase.getStatus() != Purchase.Status.PUBLISHED && purchase.getStatus() != Purchase.Status.VOLUNTEER_FOUND) {
            messageSender.informPurchaseHasBeenAssigned(message.getChat().getId());
            return;
        }
        if (!purchase.getVolunteerApplications().contains(volunteer.getId())) {
            purchase.getVolunteerApplications().add(volunteer.getId());
            purchase.setStatus(Purchase.Status.VOLUNTEER_FOUND);
            adminMessageSender.helpersHaveApplied(organization.getTelegramModeratorGroupChatId());
        }
        messageSender.updateBroadcastMessage(organization, customer, purchase);
        messageSender.confirmHelpOfferingReceived(volunteer.getTelegramChatId());
    }

    @Override
    public void handleConfirmingHelp(Message message, User user, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Organization not found");
        });
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Purchase has no customer");
        });

        if (purchase.getAssignedVolunteer().isPresent() &&
                purchase.getAssignedVolunteer().get() != volunteer.getId()) {
            messageSender.blameHackingUser(message.getChat().getId());
            return;
        }

        if (purchase.getStatus() == Purchase.Status.VOLUNTEER_FOUND) {
            purchase.setStatus(Purchase.Status.VOLUNTEER_ACCEPTED);
            rejectApplicants(customer, purchase);
            purchase.getVolunteerApplications().clear();
            telegramApi.deleteMessage(organization.getTelegramGroupChatId(), purchase.getBroadcastMessageId());
            messageSender.removePurchaseDetailButtons(message.getChat().getId(), message.getId(), purchase, customer);
            messageSender.confirmConfirmation(message.getChat().getId(), organization.getTelegramSupportChat());
        } else {
            LOG.warn("Purchase in state " + purchase.getStatus().name() + " was confirmed unexpectedly");
            messageSender.sendUnexpectedMessage(message.getChat().getId());
        }
    }

    private void rejectApplicants(Customer customer, Purchase purchase) {
        purchase.getVolunteerApplications().forEach(id -> {
            if (!purchase.getAssignedVolunteer().equals(id)) {
                volunteerRepository.findById(id).ifPresent(v -> {
                    messageSender.sendRejectionToApplicant(v.getTelegramChatId(), customer, purchase);
                });
            }
        });
    }

    @Override
    public void handleWithdrawingHelp(Message message, User user, UUID purchaseId) {
        long chatId = message.getChat().getId();
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Organization not found");
        });
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Purchase has no customer");
        });

        if (purchase.getAssignedVolunteer().isPresent() &&
                purchase.getAssignedVolunteer().get() != volunteer.getId()) {
            messageSender.blameHackingUser(chatId);
            return;
        }

        if (purchase.getStatus() == Purchase.Status.VOLUNTEER_FOUND) {
            purchase.getVolunteerApplications().remove(volunteer.getId());
            if (purchase.getVolunteerApplications().isEmpty()) {
                purchase.setStatus(Purchase.Status.PUBLISHED);
            }
            purchase.setAssignedVolunteer(null);
            telegramApi.deleteMessage(message.getChat().getId(), message.getId());
            messageSender.confirmRejection(chatId);
            messageSender.updateBroadcastMessage(organization, customer, purchase);
            adminMessageSender.helperHasRejected(organization.getTelegramModeratorGroupChatId());
        } else {
            LOG.warn("Purchase in state " + purchase.getStatus().name() + " was rejected unexpectedly");
            messageSender.sendUnexpectedMessage(chatId);
        }
    }

    @Override
    public void handleReceiptWithoutPurchaseContext(Message message, User user, String fileId) {
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        List<Purchase> activePurchases = purchaseRepository.findAllByAssignedVolunteerAndStatus(volunteer.getId(), Purchase.Status.VOLUNTEER_ACCEPTED);
        volunteer.setTelegramFileId(fileId);
        messageSender.confirmReceiptPurchaseMapping(volunteer, activePurchases);
    }

    @Override
    public void handleReceiptSubmission(Message message, User user, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Organization not found");
        });

        if (purchase.getAssignedVolunteer().isPresent() &&
                purchase.getAssignedVolunteer().get() != volunteer.getId()) {
            messageSender.blameHackingUser(message.getChat().getId());
            return;
        }

        if (purchase.getStatus() != Purchase.Status.VOLUNTEER_ACCEPTED) {
            LOG.warn("volunteer {} wants to confirm purchase in illegal state {}",
                    volunteer.getUuid(),
                    purchase.getStatus());
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return;
        }

        if (volunteer.getTelegramFileId() != null) {
            var image = telegramApi.getFile(volunteer.getTelegramFileId());
            MediaType mimetype = detectMimeType(image);
            if (mimetype != MediaType.OCTET_STREAM) {
                purchase.setReceipt(image);
                purchase.setReceiptMimeType(mimetype.toString());
                purchase.setReceiptFileId(volunteer.getTelegramFileId());
                purchase.setStatus(Purchase.Status.PURCHASE_DONE);
                volunteer.setTelegramFileId(null);
                messageSender.confirmReceiptUpload(message.getChat().getId());
                adminMessageSender.receiptHasBeenSubmitted(organization.getTelegramModeratorGroupChatId());
            } else {
                LOG.warn("Unable to detect MIME type of file {}", volunteer.getTelegramChatId());
                messageSender.sendUnexpectedImage(message.getChat().getId());
            }
        } else {
            LOG.warn("volunteer {} wants to map a receipt to purchase {} without having submitted a receipt",
                    volunteer.getUuid(),
                    purchaseId);
            messageSender.sendUnexpectedMessage(message.getChat().getId());
        }
    }

    private MediaType detectMimeType(byte[] image) {
        try {
            return new TikaConfig().getDetector().detect(new ByteArrayInputStream(image), new Metadata());
        } catch (IOException | TikaException e) {
            return MediaType.OCTET_STREAM;
        }
    }

    @Override
    public void handleCompletion(Message message, User user, UUID purchaseId) {
        long chatId = message.getChat().getId();
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("volunteer not found");
        });

        if (purchase.getAssignedVolunteer().isPresent() &&
                purchase.getAssignedVolunteer().get() != volunteer.getId()) {
            messageSender.blameHackingUser(chatId);
            return;
        }

        if (purchase.getStatus() != Purchase.Status.PURCHASE_IN_DELIVERY) {
            messageSender.sendUnexpectedMessage(chatId);
            LOG.warn("volunteer {} informed about missing money in illegal purchase in state {}",
                    volunteer.getUuid(),
                    purchase.getStatus());
            return;
        }

        if (purchase.getPaymentMethod() != Purchase.PaymentMethod.CASH) {
            purchase.setStatus(Purchase.Status.PAYMENT_PENDING);
        } else {
            purchase.setStatus(Purchase.Status.PURCHASE_COMPLETED);
        }
        messageSender.confirmCompletion(chatId);
    }

    @Override
    public void handleMoneyNotFound(Message message, User user, UUID purchaseId) {
        long chatId = message.getChat().getId();
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("Organization not found");
        });

        if (purchase.getAssignedVolunteer().isPresent() &&
                purchase.getAssignedVolunteer().get() != volunteer.getId()) {
            messageSender.blameHackingUser(chatId);
            return;
        }

        if (purchase.getStatus() != Purchase.Status.PURCHASE_IN_DELIVERY) {
            messageSender.sendUnexpectedMessage(chatId);
            LOG.warn("volunteer {} informed about missing money in illegal purchase in state {}",
                    volunteer.getUuid(),
                    purchase.getStatus());
            return;
        }

        purchase.setStatus(Purchase.Status.MONEY_NOT_FOUND);
        messageSender.confirmInvestigation(chatId);
        adminMessageSender.notifyAboutMissingMoney(organization.getTelegramModeratorGroupChatId());
    }

    @Override
    public void handleVolunteerDeletion(Message message, User user, UUID data) {
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(message.getFrom().getId(), false).orElseThrow(() -> {
                    messageSender.resignUnknownVolunteer(message.getChat().getId());
                    throw new TelegramShouldBeFineException("helper not found. telegram id: " + message.getFrom().getId());
                }
        );
        volunteer.delete();
        messageSender.resignVolunteer(message.getChat().getId());
    }
}
