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

    public Integer assignedPurchaseCount;

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
            wantsCompensation = false;
            validated = volunteer.isValidated();
            assignedPurchaseCount = 0;
        } else {
            id = volunteer.getId();
            uuid = volunteer.getUuid();
            firstName = volunteer.getFirstName();
            lastName = volunteer.getLastName();
            phone = volunteer.getPhone();
            email = volunteer.getEmail();
            address = volunteer.getAddress().getAddress();
            city = volunteer.getAddress().getCity();
            zipCode = volunteer.getAddress().getZipCode().orElse("");
            birthDate = volunteer.getBirthDate();
            iban = volunteer.getIban();
            bankName = volunteer.getBankName();
            wantsCompensation = volunteer.wantsCompensation();
            validated = volunteer.isValidated();
            if (volunteer.getAssignedPurchases() == null || volunteer.getAssignedPurchases().isEmpty()) {
                assignedPurchaseCount = 0;
            } else {
                assignedPurchaseCount = volunteer.getAssignedPurchases().size();
            }
        }
    }

    public VolunteerDTO(Volunteer volunteer, String telegramJoinBotChatUrl) {
        this(volunteer);
        this.telegramJoinBotChatUrl = telegramJoinBotChatUrl;
    }
}
