package de.njsm.versusvirus.backend.rest.api.anonymous;

import de.njsm.versusvirus.backend.service.volunteer.SignupRequest;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/anonymous/volunteers")
public class SignupController {

    private final VolunteerService service;

    public SignupController(VolunteerService service) {
        this.service = service;
    }

    @RequestMapping("/{uuid}")
    public ResponseEntity<VolunteerDTO> getVolunteer(@PathVariable("uuid") UUID uuid) {
        return service.getVolunteer(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound()
                        .build());
    }

    @PostMapping()
    public VolunteerDTO signup(@RequestBody SignupRequest signupRequest) {
        return service.signup(signupRequest);
    }
}
