package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    Volunteer findByUuid(UUID uuid);
}
