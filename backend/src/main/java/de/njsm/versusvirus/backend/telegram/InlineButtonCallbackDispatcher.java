package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Purchase;
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

    private final TelegramApiWrapper telegramApi;

    public InlineButtonCallbackDispatcher(OrganizationRepository organizationRepository,
                                        VolunteerRepository volunteerRepository,
                                        PurchaseRepository purchaseRepository,
                                        MessageSender messageSender,
                                        AdminMessageSender adminMessageSender, TelegramApiWrapper telegramApi) {
        this.organizationRepository = organizationRepository;
        this.volunteerRepository = volunteerRepository;
        this.purchaseRepository = purchaseRepository;
        this.messageSender = messageSender;
        this.adminMessageSender = adminMessageSender;
        this.telegramApi = telegramApi;
    }


    @Override
    public void handleHelpOffer(Message message, User user, UUID data) {
        var purchase = purchaseRepository.findByUuid(data).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserId(user.getId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Organization not found");
        });

        if (purchase.getStatus() != Purchase.Status.NEW && purchase.getStatus() != Purchase.Status.VOLUNTEER_FOUND) {
            messageSender.informPurchaseHasBeenAssigned(message.getChat().getId());
            return;
        }
        if (!purchase.getVolunteerApplications().contains(volunteer.getId())) {
            purchase.getVolunteerApplications().add(volunteer.getId());
            purchase.setStatus(Purchase.Status.VOLUNTEER_FOUND);
            adminMessageSender.helpersHaveApplied(organization.getTelegramModeratorGroupChatId());
        }
        messageSender.confirmHelpOfferingReceived(volunteer.getTelegramChatId());
    }

    @Override
    public void handleConfirmingHelp(Message message, User user, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserId(user.getId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Organization not found");
        });

        if (purchase.getAssignedVolunteer() != volunteer.getId()) {
            messageSender.blameHackingUser(message.getChat().getId());
            return;
        }

        if (purchase.getStatus() == Purchase.Status.VOLUNTEER_FOUND) {
            purchase.setStatus(Purchase.Status.VOLUNTEER_ACCEPTED);
            purchase.getVolunteerApplications().clear();
            telegramApi.deleteMessage(organization.getTelegramGroupChatId(), purchase.getBroadcastMessageId());
            messageSender.confirmConfirmation(message.getChat().getId());
        } else {
            LOG.warn("Purchase in state " + purchase.getStatus().name() + " was confirmed again");
            messageSender.sendUnexpectedMessage(message.getChat().getId());
        }
    }

    @Override
    public void handleWithdrawingHelp(Message message, User user, UUID purchaseId) {
        long chatId = message.getChat().getId();
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserId(user.getId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Organization not found");
        });

        if (purchase.getAssignedVolunteer() != volunteer.getId()) {
            messageSender.blameHackingUser(chatId);
            return;
        }

        if (purchase.getStatus() == Purchase.Status.VOLUNTEER_FOUND) {
            purchase.getVolunteerApplications().remove(volunteer.getId());
            if (purchase.getVolunteerApplications().isEmpty()) {
                purchase.setStatus(Purchase.Status.NEW);
            }
            purchase.setAssignedVolunteer(null);
            messageSender.confirmRejection(chatId);
            adminMessageSender.helperHasRejected(organization.getTelegramModeratorGroupChatId());
        } else {
            LOG.warn("Purchase in state " + purchase.getStatus().name() + " was confirmed again");
            messageSender.sendUnexpectedMessage(chatId);
        }
    }

    @Override
    public void handleReceiptWithoutPurchaseContext(Message message, User user, String fileId) {
        var volunteer = volunteerRepository.findByTelegramUserId(user.getId()).orElseThrow(() -> {
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
        var volunteer = volunteerRepository.findByTelegramUserId(user.getId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("Organization not found");
        });

        if (purchase.getAssignedVolunteer() != volunteer.getId()) {
            messageSender.blameHackingUser(message.getChat().getId());
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
                messageSender.sendUnexpectedImage(message.getChat().getId());
            }
        } else {
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
        var volunteer = volunteerRepository.findByTelegramUserId(user.getId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("Organization not found");
        });

        if (purchase.getAssignedVolunteer() != volunteer.getId()) {
            messageSender.blameHackingUser(chatId);
            return;
        }

        if (purchase.getStatus() != Purchase.Status.PURCHASE_IN_DELIVERY) {
            messageSender.sendUnexpectedMessage(chatId);
            LOG.warn("volunteer informed about missing money in purchase in state " + purchase.getStatus());
            return;
        }

        if (volunteer.wantsCompensation() && purchase.getPaymentMethod() != Purchase.PaymentMethod.CASH) {
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
        var volunteer = volunteerRepository.findByTelegramUserId(user.getId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("Organization not found");
        });

        if (purchase.getAssignedVolunteer() != volunteer.getId()) {
            messageSender.blameHackingUser(chatId);
            return;
        }

        if (purchase.getStatus() != Purchase.Status.PURCHASE_IN_DELIVERY) {
            messageSender.sendUnexpectedMessage(chatId);
            LOG.warn("volunteer informed about missing money in purchase in state " + purchase.getStatus());
            return;
        }

        purchase.setStatus(Purchase.Status.MONEY_NOT_FOUND);
        messageSender.confirmInvestigation(chatId);
        adminMessageSender.notifyAboutMissingMoney(organization.getTelegramModeratorGroupChatId());
    }
}
