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

    private final String mailUser;

    private final String mailHost;

    public OurMailSender(JavaMailSender mailSender,
                         TelegramMessages telegramMessages,
                         @Value("${spring.mail.username}") String mailUser,
                         @Value("${spring.mail.host}") String mailHost) {
        this.mailSender = mailSender;
        this.telegramMessages = telegramMessages;
        this.mailUser = mailUser;
        this.mailHost = mailHost;
    }

    public void sendRegistrationMail(Volunteer volunteer, String inviteLink) {
        String template = telegramMessages.getRegistrationEmail();
        String text = MessageFormat.format(template, volunteer.getFirstName(),
                inviteLink);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailUser + "@" + mailHost);
        message.setTo(volunteer.getEmail());
        message.setSubject("Registrierung bei Elsa Hilft");
        message.setText(text);
        mailSender.send(message);
    }
}
