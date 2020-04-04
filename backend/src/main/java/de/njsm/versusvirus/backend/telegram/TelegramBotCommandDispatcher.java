package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;

@Service
@Transactional
public class TelegramBotCommandDispatcher implements BotCommandDispatcher {

    private final OrganizationRepository organizationRepository;

    private final VolunteerRepository volunteerRepository;

    private final PurchaseRepository purchaseRepository;

    private final MessageFacade messageFacade;

    private final TelegramApiWrapper telegramApi;

    public TelegramBotCommandDispatcher(OrganizationRepository organizationRepository,
                                        VolunteerRepository volunteerRepository,
                                        PurchaseRepository purchaseRepository,
                                        MessageFacade messageFacade,
                                        TelegramApiWrapper telegramApi) {
        this.organizationRepository = organizationRepository;
        this.volunteerRepository = volunteerRepository;
        this.purchaseRepository = purchaseRepository;
        this.messageFacade = messageFacade;
        this.telegramApi = telegramApi;
    }

    @Override
    public void handleNewHelper(Message message, UUID userId) {
        var volunteer = volunteerRepository.findByUuid(userId).orElseThrow(() -> {
                    messageFacade.directUserToRegistrationForm(message.getChat().getId());
                    throw new TelegramShouldBeFineException("new helper not found. uuid: " + userId);
                }
        );
        var organization = organizationRepository.findById(1).orElseThrow(() -> new TelegramShouldBeFineException("Organization not found"));

        volunteer.setTelegramUserId(message.getFrom().getId());
        volunteer.setTelegramChatId(message.getChat().getId());
        volunteerRepository.save(volunteer);
        messageFacade.confirmRegistration(organization, volunteer);
    }

    @Override
    public void handleLeavingHelper(Message message) {
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
                    messageFacade.resignUnknownVolunteer(message.getChat().getId());
                    throw new TelegramShouldBeFineException("helper not found. telegram id: " + message.getFrom().getId());
                }
        );
        messageFacade.resignVolunteer(message.getChat().getId());
    }

    @Override
    public void handleHelpOffering(Message message, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> new TelegramShouldBeFineException("purchase not found"));
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> new TelegramShouldBeFineException("volunteer not found"));

        if (purchase.getStatus() != Purchase.Status.NEW) {  // TODO check assigned helper
            messageFacade.informPurchaseHasBeenAssigned(message.getChat().getId());
            return;
        }
        // TODO assign helpers
        purchase.setStatus(Purchase.Status.VOLUNTEER_FOUND);
        purchaseRepository.save(purchase);
    }

    @Override
    public void handleConfirmingHelp(Message message, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> new TelegramShouldBeFineException("purchase not found"));
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> new TelegramShouldBeFineException("volunteer not found"));
        var organization = organizationRepository.findById(1).orElseThrow(() -> new TelegramShouldBeFineException("Organization not found"));

        if (purchase.getAssignedVolunteer() != volunteer.getId()) {
            messageFacade.blameHackingUser(message.getChat().getId());
            return;
        }

        if (purchase.getStatus() == Purchase.Status.VOLUNTEER_FOUND) {
            purchase.setStatus(Purchase.Status.VOLUNTEER_ACCEPTED);
            purchaseRepository.save(purchase);
            telegramApi.deleteMessage(organization.getTelegramGroupChatId(), purchase.getBroadcastMessageId());
        }
    }

    @Override
    public void handleRejectingHelp(Message message, UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> new TelegramShouldBeFineException("purchase not found"));
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> new TelegramShouldBeFineException("volunteer not found"));

        if (purchase.getAssignedVolunteer() != volunteer.getId()) {
            messageFacade.blameHackingUser(message.getChat().getId());
            return;
        }

        if (purchase.getStatus() == Purchase.Status.VOLUNTEER_FOUND) {
            purchase.setStatus(Purchase.Status.NEW);
            purchaseRepository.save(purchase);
            // TODO write to new helper
        }
    }

    @Override
    public void handleReceiptWithoutPurchaseContext(Message message, String fileId) {
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> new TelegramShouldBeFineException("volunteer not found"));


    }

    @Override
    public void handleReceiptSubmission(Message message, UUID purchaseId, String fileId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(() -> new TelegramShouldBeFineException("purchase not found"));
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> new TelegramShouldBeFineException("volunteer not found"));

        if (purchase.getAssignedVolunteer() != volunteer.getId()) {
            messageFacade.blameHackingUser(message.getChat().getId());
            return;
        }

        byte[] image = telegramApi.getFile(fileId);
        purchase.setReceipt(image);
        purchaseRepository.save(purchase);
    }
}
