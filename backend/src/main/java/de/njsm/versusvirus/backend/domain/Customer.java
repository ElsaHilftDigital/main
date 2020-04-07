package de.njsm.versusvirus.backend.domain;

import de.njsm.versusvirus.backend.domain.common.Address;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UUID uuid;

    private String firstName;
    private String lastName;
    private String phone;
    private String mobile;
    private Address address;
    private boolean deleted;

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
        this.phone = phone.replaceAll("\\s", "");
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile.replaceAll("\\s", "");
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
