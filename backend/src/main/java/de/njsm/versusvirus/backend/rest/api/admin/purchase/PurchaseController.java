package de.njsm.versusvirus.backend.rest.api.admin.purchase;

import de.njsm.versusvirus.backend.service.purchase.*;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping()
    public List<PurchaseListItemDTO> getPurchases() {
        return purchaseService.getPurchases();
    }

    @GetMapping("/{id}")
    public FetchedPurchaseDTO getPurchase(@PathVariable("id") UUID purchaseId) {
        return purchaseService.getFetchedPurchase(purchaseId);
    }

    @PostMapping()
    public PurchaseDTO createNewPurchase(Principal principal, @RequestBody CreatePurchaseRequest req) {
        return purchaseService.create(principal, req);
    }

    @PostMapping("/{id}/publish")
    public void publishPurchase(@PathVariable("id") UUID purchase) {
        purchaseService.publishPurchase(purchase);
    }

    @RequestMapping("/{id}/availablevolunteers")
    public List<VolunteerDTO> getAvailableVolunteers(@PathVariable("id") UUID purchaseId) {
        return purchaseService.getAvailableVolunteers(purchaseId);
    }

    @PostMapping("/{id}/assign/{volunteerId}")
    public void assignVolunteer(@PathVariable("id") UUID purchaseId,
                                @PathVariable("volunteerId") UUID volunteerId) {
        purchaseService.assignVolunteer(purchaseId, volunteerId);
    }

    @PostMapping("/{id}/customernotified")
    public void customerNotified(@PathVariable("id") UUID purchaseId) {
        purchaseService.customerNotified(purchaseId);
    }

    @PostMapping("/{id}/markcompleted")
    public void markCompleted(@PathVariable("id") UUID purchaseId) {
        purchaseService.markCompleted(purchaseId);
    }

    @RequestMapping("/{id}/receipt")
    public ResponseEntity<byte[]> getReceipt(@PathVariable("id") UUID purchaseId) {
        var image = purchaseService.getReceipt(purchaseId);
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(image.getMimeType()))
                .body(image.getReceipt());
    }

    @GetMapping("/{id}/export")
    public String export(@PathVariable("id") UUID purchaseId,
                         HttpServletResponse response) {
        var result = purchaseService.export(purchaseId);
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"purchase-" + purchaseId + ".csv\"");
        return result;
    }
}
