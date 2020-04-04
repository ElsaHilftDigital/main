package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    Optional<Volunteer> findById(long id);

    Optional<Volunteer> findByUuid(UUID uuid);

    Optional<Volunteer> findByTelegramUserId(Integer id);
}
