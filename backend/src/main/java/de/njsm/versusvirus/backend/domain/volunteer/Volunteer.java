package de.njsm.versusvirus.backend.domain.volunteer;

import de.njsm.versusvirus.backend.domain.common.Address;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull private UUID uuid;

    @NotNull private String firstName;
    @NotNull private String lastName;
    @NotNull private String phone;
    @NotNull private String email;
    @NotNull private Address address;
    @NotNull private LocalDate birthDate;
    private String iban;
    private String bankName;

    private boolean wantsCompensation;
    private boolean validated;

    private boolean deleted;

    private Long telegramChatId;
    private Long telegramUserId;
    private String telegramFileId;

    @ElementCollection
    @CollectionTable(name = "purchase_applications")
    @Column(name = "purchase_id")
    private List<Long> assignedPurchases;

    public long getId() {
        return id;
    }
    public UUID getUuid() {
        return uuid;
    }

    @PrePersist
    private void setUuid() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
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

    public boolean getWantsCompensation() {
        return wantsCompensation;
    }

    public Long getTelegramChatId() {
        return telegramChatId;
    }

    public void setTelegramChatId(Long chatId) {
        this.telegramChatId = chatId;
    }

    public Long getTelegramUserId() {
        return telegramUserId;
    }

    public void setTelegramUserId(long userId) {
        this.telegramUserId = userId;
    }

    public String getTelegramFileId() {
        return telegramFileId;
    }

    public void setTelegramFileId(String telegramFileId) {
        this.telegramFileId = telegramFileId;
    }

    public List<Long> getAssignedPurchases() {
        return assignedPurchases;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void delete() {
        this.firstName = "<deleted>";
        this.lastName = "<deleted>";
        this.address.setAddress("<deleted>");
        this.address.setCity("<deleted>");
        this.address.setZipCode("<deleted>");
        this.phone = "<deleted>";
        this.email = "<deleted>";
        this.birthDate = LocalDate.EPOCH;

        this.wantsCompensation = false;
        this.iban = null;
        this.bankName = null;

        this.telegramChatId = null;
        this.telegramFileId = null;
        this.telegramUserId = null;

        this.validated = false;
        this.deleted = true;
    }
}

