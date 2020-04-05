package de.njsm.versusvirus.backend.service.customer;

import de.njsm.versusvirus.backend.domain.Customer;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.domain.common.Address;
import de.njsm.versusvirus.backend.repository.CustomerRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import de.njsm.versusvirus.backend.service.purchase.PurchaseDTO;
import de.njsm.versusvirus.backend.spring.web.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final PurchaseRepository purchaseRepository;

    public CustomerService(CustomerRepository customerRepository, PurchaseRepository purchaseRepository) {
        this.customerRepository = customerRepository;
        this.purchaseRepository = purchaseRepository;
    }

    public List<CustomerDTO> getCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(CustomerDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<CustomerDTO> getCustomer(UUID uuid) {
        return customerRepository.findByUuid(uuid).map(CustomerDTO::new);
    }

    public CustomerDTO create(CreateCustomerRequest req) {
        var customer = new Customer();
        var address = new Address();
        address.setAddress(req.address);
        address.setCity(req.city);
        address.setZipCode(req.zipCode);

        customer.setFirstName(req.firstName);
        customer.setLastName(req.lastName);
        customer.setPhone(req.phone);
        customer.setMobile(req.mobile);
        customer.setAddress(address);

        customerRepository.save(customer);
        return new CustomerDTO(customer);
    }

    public void deleteCustomer(UUID customerId) {
        var customer = customerRepository.findByUuid(customerId).orElseThrow(NotFoundException::new);
        customer.setDeleted(true);
    }

    public void updateCustomer(UUID customerId, UpdateRequest req) {
        var customer = customerRepository.findByUuid(customerId).orElseThrow(NotFoundException::new);

        customer.setFirstName(req.firstName);
        customer.setLastName(req.lastName);
        customer.getAddress().setAddress(req.address);
        customer.getAddress().setZipCode(req.zipCode);
        customer.getAddress().setCity(req.zipCode);
        customer.setPhone(req.phone);
        customer.setMobile(req.mobile);
    }

    public List<PurchaseDTO> getCompletedPurchaseListOf(UUID customerId) {
        var customer = customerRepository.findByUuid(customerId).orElseThrow(NotFoundException::new);
        return purchaseRepository.findAllByCustomerAndStatus(customer.getId(), Purchase.Status.PURCHASE_COMPLETED)
                .stream()
                .map(PurchaseDTO::new)
                .collect(Collectors.toList());
    }

    public List<PurchaseDTO> getOpenPurchaseListOf(UUID customerId) {
        var customer = customerRepository.findByUuid(customerId).orElseThrow(NotFoundException::new);
        return purchaseRepository.findAllByCustomerAndStatusNot(customer.getId(), Purchase.Status.PURCHASE_COMPLETED)
                .stream()
                .map(PurchaseDTO::new)
                .collect(Collectors.toList());
    }
}
