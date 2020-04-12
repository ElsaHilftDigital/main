package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    Optional<Volunteer> findByUuid(UUID uuid);

    Optional<Volunteer> findByTelegramUserIdAndDeleted(Long telegramUserId, boolean deleted);

    @Override
    @Query("SELECT v FROM Volunteer v WHERE v.deleted = FALSE")
    List<Volunteer> findAll();
}
