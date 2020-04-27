package de.njsm.versusvirus.backend.service.moderator;

import de.njsm.versusvirus.backend.repository.ModeratorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ModeratorService {

    private final ModeratorRepository moderatorRepository;
    private final PasswordEncoder passwordEncoder;

    public ModeratorService(ModeratorRepository moderatorRepository,
                            PasswordEncoder passwordEncoder) {
        this.moderatorRepository = moderatorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<ModeratorDTO> getModerators() {
        return moderatorRepository.findAll().stream()
                .map(ModeratorDTO::new)
                .collect(Collectors.toList());
    }

    public void changePassword(String login, String newPassword) {
        var moderator = moderatorRepository.findByLogin(login).orElseThrow(IllegalStateException::new);
        moderator.setPassword(passwordEncoder.encode(newPassword));
    }
}
