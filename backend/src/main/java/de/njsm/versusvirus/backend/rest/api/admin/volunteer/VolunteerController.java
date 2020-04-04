package de.njsm.versusvirus.backend.rest.api.admin.volunteer;

import de.njsm.versusvirus.backend.service.volunteer.UpdateRequest;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/volunteers")
public class VolunteerController {

    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    @GetMapping()
    public List<VolunteerDTO> getVolunteers() {
        return volunteerService.getVolunteers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VolunteerDTO> getVolunteer(@PathVariable("id") UUID volunteerId) {
        return volunteerService.getVolunteer(volunteerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateVolunteer(@PathVariable("id") UUID volunteerId,
                                                @RequestBody UpdateRequest updateRequest) {
        volunteerService.updateVolunteer(volunteerId, updateRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVolunteer(@PathVariable("id") UUID volunteerId) {
        volunteerService.deleteVolunteer(volunteerId);
    }

    @GetMapping("/{id}/completed-purchases")
    public List<Object> getCompletedPurchaseList(@PathVariable("id") UUID volunteerId) {
        return List.of();
    }

    @GetMapping("/{id}/open-purchases")
    public List<Object> getOpenPurchaseList(@PathVariable("id") UUID volunteerId) {
        return List.of();
    }
}
