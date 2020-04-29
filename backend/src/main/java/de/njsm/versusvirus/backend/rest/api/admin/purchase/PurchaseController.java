package de.njsm.versusvirus.backend.rest.api.admin.purchase;

import de.njsm.versusvirus.backend.service.purchase.*;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    @PostMapping("/{id}")
    public void updatePurchase(@PathVariable("id") UUID purchaseId,
                               @RequestBody UpdatePurchaseRequest updateRequest) {
        purchaseService.updatePurchase(purchaseId, updateRequest);
    }

    @PostMapping("/{id}/publish")
    public void publishPurchase(@PathVariable("id") UUID purchase) {
        purchaseService.publishPurchase(purchase);
    }

    @GetMapping("/{id}/availablevolunteers")
    public List<VolunteerDTO> getAvailableVolunteers(@PathVariable("id") UUID purchaseId) {
        return purchaseService.getAvailableVolunteers(purchaseId);
    }

    @PostMapping("/{id}/assign-volunteer/{volunteerId}")
    public void assignVolunteer(@PathVariable("id") UUID purchaseId,
                                @PathVariable("volunteerId") UUID volunteerId) {
        purchaseService.assignVolunteer(purchaseId, volunteerId);
    }

    @PostMapping("/{id}/customernotified")
    public void customerNotified(@PathVariable("id") UUID purchaseId,
                                 @RequestBody String messageToVolunteer) {
        purchaseService.customerNotified(purchaseId, messageToVolunteer);
    }

    @PostMapping("/{id}/markcompleted")
    public void markCompleted(@PathVariable("id") UUID purchaseId) {
        purchaseService.markCompleted(purchaseId);
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<byte[]> getReceipt(@PathVariable("id") UUID purchaseId) {
        var image = purchaseService.getReceipt(purchaseId);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"receipt." + image.getExtension() + "\"")
                .contentType(org.springframework.http.MediaType.parseMediaType(image.getMimeType()))
                .body(image.getReceipt());
    }

    @GetMapping("/{id}/export")
    public void export(@PathVariable("id") UUID purchaseId,
                         HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"purchase-" + purchaseId + ".csv\"");
        purchaseService.export(response.getWriter(), purchaseId);
    }

    @GetMapping("/exports/{startDate}/{endDate}")
    public void exportAll(@PathVariable("startDate") String inputStartDate,
                            @PathVariable("endDate") String inputEndDate,
                            HttpServletResponse response) throws IOException {
        DateTimeFormatter europeanDateFormatter = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate startDate = LocalDate.parse(inputStartDate, europeanDateFormatter);
        LocalDate endDate = LocalDate.parse(inputEndDate, europeanDateFormatter);
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"Einkaeufe_von_" + startDate.toString() + "_bis_" + endDate.toString() + ".csv\"");
        purchaseService.exportAll(response.getWriter(), startDate, endDate);
    }
}
