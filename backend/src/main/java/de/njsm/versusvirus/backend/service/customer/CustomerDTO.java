package de.njsm.versusvirus.backend.service.customer;

import de.njsm.versusvirus.backend.domain.Customer;

import java.util.UUID;

public class CustomerDTO {

    public UUID uuid;
    public String firstName;
    public String lastName;
    public String phone;
    public String mobile;
    public String address;
    public String zipCode;
    public String city;

    public CustomerDTO(Customer customer) {
        if (customer.isDeleted()) {
            uuid = customer.getUuid();
            firstName = "gelöscht";
            lastName = "gelöscht";
            phone = "gelöscht";
            mobile = "gelöscht";
            address = "gelöscht";
            zipCode = "gelöscht";
            city = "gelöscht";
        } else {
            uuid = customer.getUuid();
            firstName = customer.getFirstName();
            lastName = customer.getLastName();
            phone = customer.getPhone();
            mobile = customer.getMobile();
            address = customer.getAddress().getAddress();
            zipCode = customer.getAddress().getZipCode().orElse("");
            city = customer.getAddress().getCity();
        }
    }
}
