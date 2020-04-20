package de.njsm.versusvirus.backend.service.volunteer;

import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;

import java.time.LocalDate;
import java.util.UUID;

public class VolunteerDTO {

    public long id;
    public UUID uuid;
    public String firstName;
    public String lastName;
    public String phone;
    public String email;
    public String address;
    public String city;
    public String zipCode;
    public LocalDate birthDate;
    public String iban;
    public String bankName;
    public boolean wantsCompensation;

    public boolean validated;
    public String telegramJoinBotChatUrl;

    public VolunteerDTO(Volunteer volunteer) {
        if (volunteer.isDeleted()) {
            id = volunteer.getId();
            uuid = volunteer.getUuid();
            firstName = "gelöscht";
            lastName = "gelöscht";
            phone = "gelöscht";
            email = "gelöscht";
            address = "gelöscht";
            city = "gelöscht";
            zipCode = "gelöscht";
            birthDate = volunteer.getBirthDate();
            iban = null;
            bankName = null;
            wantsCompensation = volunteer.wantsCompensation();
            validated = volunteer.isValidated();
        } else {
            id = volunteer.getId();
            uuid = volunteer.getUuid();
            firstName = volunteer.getFirstName();
            lastName = volunteer.getLastName();
            phone = volunteer.getPhone();
            email = volunteer.getEmail();
            address = volunteer.getAddress().getAddress();
            city = volunteer.getAddress().getCity();
            zipCode = volunteer.getAddress().getZipCode();
            birthDate = volunteer.getBirthDate();
            iban = volunteer.getIban();
            bankName = volunteer.getBankName();
            wantsCompensation = volunteer.wantsCompensation();
            validated = volunteer.isValidated();
        }
    }

    public VolunteerDTO(Volunteer volunteer, String telegramJoinBotChatUrl) {
        this(volunteer);
        this.telegramJoinBotChatUrl = telegramJoinBotChatUrl;
    }
}
