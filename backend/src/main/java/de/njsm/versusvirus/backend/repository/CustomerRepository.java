package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUuid(UUID uuid);

}
