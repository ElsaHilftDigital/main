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

    public TelegramBotCommandDispatcher(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    @Override
    public void handleNewHelper(Message message, UUID userId) {
        var volunteer = volunteerRepository.findByUuid(userId).orElseThrow(() -> new RuntimeException("Volunteer not found"));
        volunteer.setTelegramUserId(message.getFrom().getId());
        volunteer.setTelegramChatId(message.getChat().getId());
        volunteerRepository.save(volunteer);
        /*

            if helper is not known to us -> send to registration form

         */
    }

    @Override
    public void handleLeavingHelper(Message message) {
        /*
            if helper not known -> no problem :)

            Thank them for their help!
         */
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
    public void handleReceiptSubmission(Message message, String purchaseId, String fileId) {
        /*

            if different volunteer than assigned by us -> tell them not to hack

            download picture and assign to purchase

         */
    }
}
