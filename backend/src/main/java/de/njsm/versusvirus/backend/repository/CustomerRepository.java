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

    @Override
    @Query("SELECT c FROM Customer c WHERE c.deleted = FALSE")
    List<Customer> findAll();
}
