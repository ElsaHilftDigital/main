package de.njsm.versusvirus.backend.service.volunteer;

import java.time.LocalDate;

public class UpdateRequest {

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
}
