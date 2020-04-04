package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Optional<Organization> findById(long id);
}
