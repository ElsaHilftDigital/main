package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static javax.transaction.Transactional.TxType.MANDATORY;

@Transactional(MANDATORY)
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUuid(UUID uuid);

    default List<Customer> findAllById(Iterable<Long> ids) {
        if (ids.iterator().hasNext()) {
            return _findAllByIdInternal(ids);
        } else {
            return Collections.emptyList();
        }
    }

    @Query(value = "select * from customer where id in :ids", nativeQuery = true)
    List<Customer> _findAllByIdInternal(@Param("ids") Iterable<Long> ids);
}
