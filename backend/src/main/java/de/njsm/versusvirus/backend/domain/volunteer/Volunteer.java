package de.njsm.versusvirus.backend.domain.volunteer;

import de.njsm.versusvirus.backend.domain.common.Address;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UUID uuid;

    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private Address address;
    private LocalDate birthDate;
    private String iban;
    private String bankName;
    // Means of Transportation
    // Employment Status

    private boolean wantsCompensation;
    private boolean validated;

    public long getId() {
        return id;
    }
    public UUID getUuid() {
        return uuid;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public boolean wantsCompensation() {
        return wantsCompensation;
    }

    public void setWantsCompensation(boolean wantsCompensation) {
        this.wantsCompensation = wantsCompensation;
    }

    public boolean isValidated() {
        return validated;
    }

    public void setValidated(boolean validated) {
        this.validated = validated;
    }
}

