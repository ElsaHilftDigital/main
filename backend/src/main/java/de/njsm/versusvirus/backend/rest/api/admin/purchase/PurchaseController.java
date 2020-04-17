package de.njsm.versusvirus.backend.rest.api.admin.purchase;

import de.njsm.versusvirus.backend.service.purchase.*;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
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

    @PostMapping("/{id}")
    public void updatePurchase(@PathVariable("id") UUID purchaseId,
                               @RequestBody UpdatePurchaseRequest updateRequest) {
        purchaseService.updatePurchase(purchaseId, updateRequest);
    }

    @PostMapping("/{id}/publish")
    public void publishPurchase(@PathVariable("id") UUID purchase) {
        purchaseService.publishPurchase(purchase);
    }

    @RequestMapping("/{id}/availablevolunteers")
    public List<VolunteerDTO> getAvailableVolunteers(@PathVariable("id") UUID purchaseId) {
        return purchaseService.getAvailableVolunteers(purchaseId);
    }

    @PostMapping("/{id}/assign-volunteer/{volunteerId}")
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

    @GetMapping("/{id}/receipt")
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

    @GetMapping("/{startDate}/{endDate}/export")
    public String exportAll(@PathVariable("startDate") String startDateInput,
                         @PathVariable("endDate") String endDateInput,
                         HttpServletResponse response) {
        DateTimeFormatter europeanDateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")
                                                    .withLocale(Locale.GERMANY)
                                                    .withZone(ZoneId.systemDefault());
        LocalDate startDate = LocalDate.parse(startDateInput, europeanDateFormatter);
        LocalDate endDate = LocalDate.parse(endDateInput, europeanDateFormatter);
        var result = purchaseService.exportAll(startDate, endDate);
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"Einkaeufe_von_" + startDate.toString() + "_bis_" + endDate.toString() + ".csv\"");
        return result;
    }
}
