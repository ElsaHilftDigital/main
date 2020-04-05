package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TelegramBotCommandDispatcher implements BotCommandDispatcher {

    private static final Logger LOG = LoggerFactory.getLogger(TelegramBotCommandDispatcher.class);

    private final OrganizationRepository organizationRepository;

    private final VolunteerRepository volunteerRepository;

    private final PurchaseRepository purchaseRepository;

    private final MessageSender messageSender;

    private final AdminMessageSender adminMessageSender;

    private final TelegramApiWrapper telegramApi;

    public TelegramBotCommandDispatcher(OrganizationRepository organizationRepository,
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
    public void handleNewHelper(Message message, UUID userId) {
        var volunteer = volunteerRepository.findByUuid(userId).orElseThrow(() -> {
                    messageSender.directUserToRegistrationForm(message.getChat().getId());
                    throw new TelegramShouldBeFineException("new helper not found. uuid: " + userId);
                }
        );
        var organization = organizationRepository.findById(1).orElseThrow(() -> new TelegramShouldBeFineException("Organization not found"));

        volunteer.setTelegramUserId(message.getFrom().getId());
        volunteer.setTelegramChatId(message.getChat().getId());
        messageSender.confirmRegistration(organization, volunteer);
    }

    @Override
    public void handleLeavingHelper(Message message) {
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
                    messageSender.resignUnknownVolunteer(message.getChat().getId());
                    throw new TelegramShouldBeFineException("helper not found. telegram id: " + message.getFrom().getId());
                }
        );
        volunteer.setDeleted(true);
        messageSender.resignVolunteer(message.getChat().getId());
    }

    @Override
    public void handleHelpOffering(Message message, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
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
        messageSender.confirmHelpOfferingReceived(message.getChat().getId());
    }

    @Override
    public void handleConfirmingHelp(Message message, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
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
    public void handleRejectingHelp(Message message, UUID purchaseId) {
        long chatId = message.getChat().getId();
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
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
    public void handleReceiptWithoutPurchaseContext(Message message, String fileId) {
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        List<Purchase> activePurchases = purchaseRepository.findAllByAssignedVolunteer(volunteer.getId());
        volunteer.setTelegramFileId(fileId);
        messageSender.confirmReceiptPurchaseMapping(volunteer, activePurchases);
    }

    @Override
    public void handleReceiptSubmission(Message message, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
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
            byte[] image = telegramApi.getFile(volunteer.getTelegramFileId());
            purchase.setReceipt(image);
            purchase.setReceiptFileId(volunteer.getTelegramFileId());
            purchase.setStatus(Purchase.Status.PURCHASE_DONE);
            volunteer.setTelegramFileId(null);
            messageSender.confirmReceiptUpload(message.getChat().getId());
            adminMessageSender.receiptHasBeenSubmitted(organization.getTelegramModeratorGroupChatId());
        } else {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
        }
    }

    @Override
    public void handleCompletion(Message message, UUID purchaseId, boolean isSuccess) {
        long chatId = message.getChat().getId();
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("purchase not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
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
            return;
        }

        if (isSuccess) {
            if (volunteer.wantsCompensation() && purchase.getPaymentMethod() != Purchase.PaymentMethod.CASH) {
                purchase.setStatus(Purchase.Status.PAYMENT_PENDING);
            } else {
                purchase.setStatus(Purchase.Status.PURCHASE_COMPLETED);
            }
            messageSender.confirmCompletion(chatId);
        } else {
            purchase.setStatus(Purchase.Status.MONEY_NOT_FOUND);
            messageSender.confirmInvestigation(chatId);
        }
    }
}
