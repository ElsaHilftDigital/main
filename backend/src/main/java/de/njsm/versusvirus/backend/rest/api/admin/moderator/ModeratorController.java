package de.njsm.versusvirus.backend.rest.api.admin.moderator;

import de.njsm.versusvirus.backend.service.moderator.ModeratorDTO;
import de.njsm.versusvirus.backend.service.moderator.ModeratorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/moderator")
public class ModeratorController {

    private final ModeratorService moderatorService;

    public ModeratorController(ModeratorService moderatorService) {
        this.moderatorService = moderatorService;
    }


    @GetMapping()
    public List<ModeratorDTO> getModerators() {
        return moderatorService.getModerators();
    }
}
