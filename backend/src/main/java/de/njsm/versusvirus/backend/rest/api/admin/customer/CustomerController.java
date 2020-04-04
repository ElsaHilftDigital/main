package de.njsm.versusvirus.backend.rest.api.admin.customer;

import de.njsm.versusvirus.backend.rest.api.anonymous.VolunteerDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/customers")
public class CustomerController {

    @RequestMapping()
    public List<Object> getCustomers() {
        return List.of();
    }

    @RequestMapping("/{id}")
    public Object getCustomer(@PathParam("id") UUID customerId) {
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCustomer(@PathParam("id") UUID customerId) {
        return ResponseEntity.noContent()
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathParam("id") UUID customerId) {
        return ResponseEntity.noContent()
                .build();
    }

    @RequestMapping("/{id}/completed-purchases")
    public List<Object> getCompletedPurchaseList(@PathParam("id") UUID customerId) {
        return List.of();
    }

    @RequestMapping("/{id}/open-purchases")
    public List<Object> getOpenPurchaseList(@PathParam("id") UUID customerId) {
        return List.of();
    }
}
