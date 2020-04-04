package de.njsm.versusvirus.backend.service.customer;

import de.njsm.versusvirus.backend.domain.Customer;
import de.njsm.versusvirus.backend.domain.common.Address;

public class CustomerDTO {

    public String firstName;
    public String lastName;
    public String phone;
    public String mobile;
    public Address address;

    public CustomerDTO(Customer customer) {
        firstName = customer.getFirstName();
        lastName = customer.getLastName();
        phone = customer.getPhone();
        mobile = customer.getPhone();
        address = customer.getAddress();
    }
}
