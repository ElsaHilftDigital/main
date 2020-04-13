package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.Moderator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ModeratorRepository extends JpaRepository<Moderator, Long> {
    Optional<Moderator> findByLogin(String login);
    Optional<Moderator> findByUuid(UUID uuid);
}
