package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    Optional<Purchase> findByUuid(UUID uuid);

    List<Purchase> findAllByCustomerAndStatus(Long customer, Purchase.Status status);

    List<Purchase> findAllByCustomerAndStatusNot(Long customer, Purchase.Status status);

    List<Purchase> findAllByAssignedVolunteerAndStatus(Long volunteer, Purchase.Status status);

    List<Purchase> findAllByAssignedVolunteerAndStatusNot(Long volunteer, Purchase.Status status);

    @Query("SELECT p FROM Purchase p WHERE p.createTime >= :from AND p.createTime < :to")
    List<Purchase> findAllInRange(@Param("from") Instant from, @Param("to") Instant to);
}
