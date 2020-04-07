package de.njsm.versusvirus.backend.service.customer;

import de.njsm.versusvirus.backend.domain.Customer;

import java.util.UUID;

public class CustomerDTO {

    public String id;
    public UUID uuid;
    public String firstName;
    public String lastName;
    public String phone;
    public String mobile;
    public String address;
    public String zipCode;
    public String city;

    public CustomerDTO(Customer customer) {
        id = Long.toString(customer.getId());
        uuid = customer.getUuid();
        firstName = customer.getFirstName();
        lastName = customer.getLastName();
        phone = customer.getPhone();
        mobile = customer.getMobile();
        address = customer.getAddress().getAddress();
        zipCode = customer.getAddress().getZipCode();
        city = customer.getAddress().getCity();
    }
}
