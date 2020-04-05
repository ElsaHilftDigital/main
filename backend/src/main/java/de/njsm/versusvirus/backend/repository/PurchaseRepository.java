package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    Optional<Purchase> findById(long id);

    Optional<Purchase> findByUuid(UUID uuid);

    List<Purchase> findAllByAssignedVolunteer(long volunteerId);

    List<Purchase> findAllByCustomerAndStatus(Long customer, Purchase.Status status);

    List<Purchase> findAllByCustomerAndStatusNot(Long customer, Purchase.Status status);

    List<Purchase> findAllByAssignedVolunteerAndStatus(Long volunteer, Purchase.Status status);

    List<Purchase> findAllByAssignedVolunteerAndStatusNot(Long volunteer, Purchase.Status status);
}
