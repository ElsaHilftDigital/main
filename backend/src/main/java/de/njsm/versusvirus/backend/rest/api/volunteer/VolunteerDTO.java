package de.njsm.versusvirus.backend.rest.api.volunteer;

import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;

import java.time.LocalDate;
import java.util.UUID;

public class VolunteerDTO {

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

    public VolunteerDTO(Volunteer volunteer) {
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
    }
}
