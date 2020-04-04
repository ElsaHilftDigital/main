package de.njsm.versusvirus.backend.rest.api.admin.customer;

import de.njsm.versusvirus.backend.service.customer.CustomerDTO;
import de.njsm.versusvirus.backend.service.customer.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @RequestMapping()
    public List<CustomerDTO> getCustomers() {
        return customerService.getCustomers();
    }

    @RequestMapping("/{id}")
    public Object getCustomer(@PathVariable("id") UUID customerId) {
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCustomer(@PathVariable("id") UUID customerId) {
        return ResponseEntity.noContent()
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("id") UUID customerId) {
        return ResponseEntity.noContent()
                .build();
    }

    @RequestMapping("/{id}/completed-purchases")
    public List<Object> getCompletedPurchaseList(@PathVariable("id") UUID customerId) {
        return List.of();
    }

    @RequestMapping("/{id}/open-purchases")
    public List<Object> getOpenPurchaseList(@PathVariable("id") UUID customerId) {
        return List.of();
    }
}
