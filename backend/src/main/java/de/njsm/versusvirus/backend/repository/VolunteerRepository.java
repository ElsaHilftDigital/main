package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    Optional<Volunteer> findByUuid(UUID uuid);

    Optional<Volunteer> findByTelegramUserIdAndDeleted(Long telegramUserId, boolean deleted);

    @Override
    default List<Volunteer> findAllById(Iterable<Long> ids) {
        if (ids.iterator().hasNext()) {
            return _findAllByIdInternal(ids);
        } else {
            return Collections.emptyList();
        }
    }

    @Query(value = "select * from volunteer where id in :ids", nativeQuery = true)
    List<Volunteer> _findAllByIdInternal(@Param("ids") Iterable<Long> ids);
}
