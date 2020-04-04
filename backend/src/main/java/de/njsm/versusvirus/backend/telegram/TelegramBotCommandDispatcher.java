package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;

@Service
@Transactional
public class TelegramBotCommandDispatcher implements BotCommandDispatcher {

    private final VolunteerRepository volunteerRepository;

    private final MessageFacade messageFacade;

    public TelegramBotCommandDispatcher(VolunteerRepository volunteerRepository, MessageFacade messageFacade) {
        this.volunteerRepository = volunteerRepository;
        this.messageFacade = messageFacade;
    }

    @Override
    public void handleNewHelper(Message message, UUID userId) {
        var volunteer = volunteerRepository.findByUuid(userId).orElseThrow(() -> {
                    messageFacade.directUserToRegistrationForm(message.getChat().getId());
                    throw new RuntimeException("new helper not found. uuid: " + userId);
                }
        );
        volunteer.setTelegramUserId(message.getFrom().getId());
        volunteer.setTelegramChatId(message.getChat().getId());
        volunteerRepository.save(volunteer);
    }

    @Override
    public void handleLeavingHelper(Message message) {
        var volunteer = volunteerRepository.findByTelegramUserId(message.getFrom().getId()).orElseThrow(() -> {
                    messageFacade.resignUnknownVolunteer(message.getChat().getId());
                    throw new RuntimeException("helper not found. telegram id: " + message.getFrom().getId());
                }
        );
        messageFacade.resignVolunteer(message.getChat().getId());
    }

    @Override
    public void handleHelpOffering(Message message, String purchaseId) {
        /*

            if purchase is assigned -> reply

            if not -> assign / schedule....

         */
    }

    @Override
    public void handleConfirmingHelp(Message message, String purchaseId) {
        /*

            if different volunteer than assigned by us -> tell them not to hack

            if not -> mark as assigned, remove offer from group chat

         */
    }

    @Override
    public void handleRejectingHelp(Message message, String purchaseId) {
        /*

            if different volunteer than assigned by us -> tell them not to hack

            if not -> reschedule

         */
    }

    @Override
    public void handleReceiptWithoutPurchaseContext(Message message, String fileId) {

    }

    @Override
    public void handleReceiptSubmission(Message message, String purchaseId, String fileId) {
        /*

            if different volunteer than assigned by us -> tell them not to hack

            download picture and assign to purchase

         */
    }
}
