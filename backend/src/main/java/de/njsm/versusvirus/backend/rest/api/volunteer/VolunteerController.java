package de.njsm.versusvirus.backend.rest.api.volunteer;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/volunteers")
public class VolunteerController {

    @RequestMapping("/{uuid}")
    public VolunteerDTO getVolunteer(@PathVariable("uuid") UUID uuid) {
        return new VolunteerDTO();
    }

    @PostMapping()
    public void signup(@RequestBody SignupRequest signupRequest) {
    }
}
