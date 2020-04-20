package de.njsm.versusvirus.backend.mail;

import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.telegram.TelegramMessages;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;

@Component
public class OurMailSender {

    private final JavaMailSender mailSender;

    private final TelegramMessages telegramMessages;

    public OurMailSender(JavaMailSender mailSender,
                          TelegramMessages telegramMessages) {
        this.mailSender = mailSender;
        this.telegramMessages = telegramMessages;
    }

    public void sendRegistrationMail(Volunteer volunteer, String inviteLink) {
        String template = telegramMessages.getRegistrationEmail();
        String text = MessageFormat.format(template, volunteer.getFirstName(),
                inviteLink);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@elsa-hilft.ch");
        message.setTo(volunteer.getEmail());
        message.setSubject("Registrierung bei Elsa hilft");
        message.setText(text);
        mailSender.send(message);
    }
}
