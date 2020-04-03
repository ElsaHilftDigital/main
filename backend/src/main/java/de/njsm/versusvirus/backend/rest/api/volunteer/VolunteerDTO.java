package de.njsm.versusvirus.backend.rest.api.volunteer;

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
}
