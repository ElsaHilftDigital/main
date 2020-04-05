package de.njsm.versusvirus.backend.rest.api.admin.customer;

import de.njsm.versusvirus.backend.service.customer.CreateCustomerRequest;
import de.njsm.versusvirus.backend.service.customer.CustomerDTO;
import de.njsm.versusvirus.backend.service.customer.CustomerService;
import de.njsm.versusvirus.backend.service.customer.UpdateRequest;
import de.njsm.versusvirus.backend.service.purchase.PurchaseDTO;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable("id") UUID customerId) {
        return customerService.getCustomer(customerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping()
    public CustomerDTO createNewCustomer(@RequestBody CreateCustomerRequest req) {
        return customerService.create(req);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateCustomer(@PathVariable("id") UUID customerId,
                                               @RequestBody UpdateRequest req) {
        customerService.updateCustomer(customerId, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable("id") UUID customerId) {
        customerService.deleteCustomer(customerId);
    }

    @RequestMapping("/{id}/completed-purchases")
    public List<PurchaseDTO> getCompletedPurchaseList(@PathVariable("id") UUID customerId) {
        return customerService.getCompletedPurchaseListOf(customerId);
    }

    @RequestMapping("/{id}/open-purchases")
    public List<PurchaseDTO> getOpenPurchaseList(@PathVariable("id") UUID customerId) {
        return customerService.getOpenPurchaseListOf(customerId);
    }
}
