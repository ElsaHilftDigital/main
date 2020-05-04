package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.dto.Message;
import io.prometheus.client.Counter;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;

@Service
@Transactional
public class TelegramBotCommandDispatcher implements BotCommandDispatcher {

    private final OrganizationRepository organizationRepository;

    private final VolunteerRepository volunteerRepository;

    private final MessageSender messageSender;

    private static final Counter NEW_VOLUNTEERS = Counter.build()
            .name("elsa_hilft_telegram_new_volunteers")
            .help("Number of new volunteers")
            .register();

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
                    throw new TelegramShouldBeFineException("new volunteer not found. uuid: " + userId);
                }
        );

        volunteer.setTelegramUserId(message.getFrom().getId());
        volunteer.setTelegramChatId(message.getChat().getId());
        messageSender.confirmRegistration(volunteer);
        NEW_VOLUNTEERS.inc();
    }

    @Override
    public void handleLeavingHelper(Message message) {
        messageSender.warnVolunteerFromResignation(message.getChat().getId());
    }
}
