package de.njsm.versusvirus.backend.rest.api.admin.volunteer;

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
@RequestMapping("/api/v1/admin/volunteers")
public class VolunteerController {

    @RequestMapping()
    public List<VolunteerDTO> getVolunteers() {
        return List.of();
    }

    @RequestMapping("/{id}")
    public VolunteerDTO getVolunteer(@PathParam("id") UUID volunteerId) {
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateVolunteer(@PathParam("id") UUID volunteerId) {
        return ResponseEntity.noContent()
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVolunteer(@PathParam("id") UUID volunteerId) {
        return ResponseEntity.noContent()
                .build();
    }

    @RequestMapping("/{id}/completed-purchases")
    public List<Object> getCompletedPurchaseList(@PathParam("id") UUID volunteerId) {
        return List.of();
    }

    @RequestMapping("/{id}/open-purchases")
    public List<Object> getOpenPurchaseList(@PathParam("id") UUID volunteerId) {
        return List.of();
    }
}
