package de.njsm.versusvirus.backend.service.customer;

import de.njsm.versusvirus.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerDTO> getCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(CustomerDTO::new)
                .collect(Collectors.toList());
    }

}
