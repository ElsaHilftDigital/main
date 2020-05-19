package de.njsm.versusvirus.backend.events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface DbEventRepository extends JpaRepository<DbEvent, Long> {

    @Query("select max(n.id) from DbEvent n")
    Optional<Long> lastEventId();

    @Query("select n from DbEvent n where n.id > :id order by n.id")
    List<DbEvent> findNewEvents(@Param("id") long lastEventId);
}
