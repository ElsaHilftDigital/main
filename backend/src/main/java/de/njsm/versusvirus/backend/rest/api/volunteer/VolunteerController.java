package de.njsm.versusvirus.backend.rest.api.volunteer;

import de.njsm.versusvirus.backend.service.volunteer.VolunteerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/volunteers")
public class VolunteerController {

    private final VolunteerService service;

    public VolunteerController(VolunteerService service) {
        this.service = service;
    }

    @RequestMapping("/{uuid}")
    public VolunteerDTO getVolunteer(@PathVariable("uuid") UUID uuid) {
        return service.getVolunteer(uuid);
    }

    @PostMapping()
    public VolunteerDTO signup(@RequestBody SignupRequest signupRequest) {
        return service.signup(signupRequest);
    }
}
