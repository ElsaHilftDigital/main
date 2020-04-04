package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {}
