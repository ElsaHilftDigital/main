package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.repository.OrganizationRepository;
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

    private final MessageSender messageSender;

    public TelegramBotCommandDispatcher(OrganizationRepository organizationRepository,
                                        VolunteerRepository volunteerRepository,
                                        MessageSender messageSender) {
        this.organizationRepository = organizationRepository;
        this.volunteerRepository = volunteerRepository;
        this.messageSender = messageSender;
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
        messageSender.warnVolunteerFromResignation(message.getChat().getId());
    }
}
