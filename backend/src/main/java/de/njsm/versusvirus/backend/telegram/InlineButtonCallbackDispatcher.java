package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.repository.CustomerRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import de.njsm.versusvirus.backend.repository.PurchaseSupermarketRepository;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.repository.ModeratorRepository;
import de.njsm.versusvirus.backend.service.receipt.ReceiptService;
import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import de.njsm.versusvirus.backend.telegram.dto.User;
import io.prometheus.client.Counter;
import io.prometheus.client.Histogram;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@Component
@Transactional
public class InlineButtonCallbackDispatcher implements CallbackDispatcher {

    private static final Logger LOG = LoggerFactory.getLogger(InlineButtonCallbackDispatcher.class);

    private final VolunteerRepository volunteerRepository;

    private final PurchaseRepository purchaseRepository;

    private final PurchaseSupermarketRepository purchaseSupermarketRepository;

    private final MessageSender messageSender;

    private final AdminMessageSender adminMessageSender;

    private final TelegramApi telegramApi;

    private final CustomerRepository customerRepository;

    private final ModeratorRepository moderatorRepository;

    private final ReceiptService receiptService;

    private final long groupChatId;

    private static final Counter LEAVING_VOLUNTEERS = Counter.build()
            .name("elsa_hilft_telegram_leaving_volunteers")
            .help("Number of leaving volunteers")
            .register();

    private static final Histogram VOLUNTEERS_PER_PURCHASE = Histogram.build()
            .linearBuckets(1, 1, 20)
            .name("elsa_hilft_volunteers_per_purchase")
            .help("Number of volunteers per purchase")
            .register();

    public InlineButtonCallbackDispatcher(VolunteerRepository volunteerRepository,
                                          PurchaseRepository purchaseRepository,
                                          PurchaseSupermarketRepository purchaseSupermarketRepository,
                                          MessageSender messageSender,
                                          AdminMessageSender adminMessageSender,
                                          TelegramApi telegramApi,
                                          CustomerRepository customerRepository,
                                          ModeratorRepository moderatorRepository,
                                          ReceiptService receiptService,
                                          @Value("${telegram.groupchat.id}") long groupChatId) {
        this.volunteerRepository = volunteerRepository;
        this.purchaseRepository = purchaseRepository;
        this.purchaseSupermarketRepository = purchaseSupermarketRepository;
        this.messageSender = messageSender;
        this.adminMessageSender = adminMessageSender;
        this.telegramApi = telegramApi;
        this.customerRepository = customerRepository;
        this.moderatorRepository = moderatorRepository;
        this.groupChatId = groupChatId;
        this.receiptService = receiptService;
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
            var moderator = moderatorRepository.findById(purchase.getResponsibleModeratorId()).orElseThrow(() -> {
                messageSender.sendUnexpectedMessage(message.getChat().getId());
                return new TelegramShouldBeFineException("responsible moderator not found");
            });
            adminMessageSender.helpersHaveApplied(moderator);
        }
        messageSender.updateBroadcastMessage(customer, purchase);
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
            VOLUNTEERS_PER_PURCHASE.observe(purchase.getVolunteerApplications().size());
            messageSender.rejectApplicants(customer, purchase, volunteerRepository.findAllById(purchase.getVolunteerApplications()));
            purchase.getVolunteerApplications().clear();
            telegramApi.deleteMessage(groupChatId, purchase.getBroadcastMessageId());
            messageSender.removePurchaseDetailButtons(message.getChat().getId(), message.getId(), purchase, customer);
            messageSender.confirmConfirmation(message.getChat().getId());
        } else {
            LOG.warn("Purchase in state " + purchase.getStatus().name() + " was confirmed unexpectedly");
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
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(chatId);
            return new TelegramShouldBeFineException("volunteer not found");
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
            messageSender.updateBroadcastMessage(customer, purchase);
            var moderator = moderatorRepository.findById(purchase.getResponsibleModeratorId()).orElseThrow(() -> {
                messageSender.sendUnexpectedMessage(message.getChat().getId());
                return new TelegramShouldBeFineException("responsible moderator not found");
            });
            adminMessageSender.helperHasRejected(moderator);
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
        List<Purchase> activePurchases = purchaseRepository.findAllByAssignedVolunteerAndStatusAndDeletedFalse(volunteer.getId(), Purchase.Status.VOLUNTEER_ACCEPTED);
        volunteer.setTelegramFileId(fileId);
        messageSender.confirmReceiptPurchaseMapping(volunteer, activePurchases);
    }

    @Override
    public void handleReceiptSubmission(Message message, User user, UUID supermarketId) {
        var supermarket = purchaseSupermarketRepository.findByUuid(supermarketId).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("supermarket not found");
        });
        var volunteer = volunteerRepository.findByTelegramUserIdAndDeleted(user.getId(), false).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("volunteer not found");
        });
        var purchase = supermarket.getPurchase();
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
            try {
                receiptService.uploadReceipt(supermarket.getUuid(), image.getData());
            } catch (Exception e) {
                LOG.error("Upload to GCS failed", e);
            }
            supermarket.setReceipt(image.getData());
            supermarket.setReceiptMimeType(image.getMimeType());
            supermarket.setReceiptUploaded(true);
            supermarket.setReceiptFileExtension(image.getFileExtension());
            supermarket.setReceiptFileId(volunteer.getTelegramFileId());
            volunteer.setTelegramFileId(null);
            if (purchase.getPurchaseSupermarketList().size() == purchase.numberOfReceipts()) {
                purchase.setStatus(Purchase.Status.PURCHASE_DONE);
                messageSender.confirmReceiptUpload(message.getChat().getId());
                var moderator = moderatorRepository.findById(purchase.getResponsibleModeratorId()).orElseThrow(() -> {
                    messageSender.sendUnexpectedMessage(message.getChat().getId());
                    return new TelegramShouldBeFineException("responsible moderator not found");
                });
                adminMessageSender.receiptHasBeenSubmitted(moderator);
            } else {
                messageSender.confirmReceiptWaitingForNext(message.getChat().getId());
            }
        } else {
            LOG.warn("volunteer {} wants to map a receipt to purchase {} and supermarket {} without having submitted a receipt",
                    volunteer.getUuid(),
                    purchase.getUuid(),
                    supermarket.getUuid());
            messageSender.sendUnexpectedMessage(message.getChat().getId());
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
        var moderator = moderatorRepository.findById(purchase.getResponsibleModeratorId()).orElseThrow(() -> {
            messageSender.sendUnexpectedMessage(message.getChat().getId());
            return new TelegramShouldBeFineException("responsible moderator not found");
        });
        adminMessageSender.notifyAboutMissingMoney(moderator);
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
        LEAVING_VOLUNTEERS.inc();
    }
}
