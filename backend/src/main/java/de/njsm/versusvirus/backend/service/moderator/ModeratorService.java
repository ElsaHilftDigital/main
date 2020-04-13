package de.njsm.versusvirus.backend.service.moderator;

import de.njsm.versusvirus.backend.domain.Moderator;
import de.njsm.versusvirus.backend.repository.ModeratorRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ModeratorService {

    private final ModeratorRepository moderatorRepository;

    public ModeratorService(ModeratorRepository moderatorRepository) {
        this.moderatorRepository = moderatorRepository;
    }

    public List<ModeratorDTO> getModerators() {
        return moderatorRepository.findAll().stream()
                .map(ModeratorDTO::new)
                .collect(Collectors.toList());
    }
}
