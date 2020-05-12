package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.Purchase;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    Optional<Purchase> findByUuid(UUID uuid);

    List<Purchase> findByDeletedFalse();

    List<Purchase> findByDeletedFalse(Sort sort);

    List<Purchase> findAllByCustomerAndStatusAndDeletedFalse(Long customer, Purchase.Status status);

    List<Purchase> findAllByCustomerAndStatusNotAndDeletedFalse(Long customer, Purchase.Status status);

    List<Purchase> findAllByAssignedVolunteerAndStatusAndDeletedFalse(Long volunteer, Purchase.Status status);

    List<Purchase> findAllByAssignedVolunteerAndStatusNotAndDeletedFalse(Long volunteer, Purchase.Status status);

    @Query("SELECT p FROM Purchase p WHERE p.executionTime >= :from AND p.executionTime < :to AND p.deleted = false")
    List<Purchase> findAllInRange(@Param("from") Instant from, @Param("to") Instant to);

    @Query("select status as status, count(status) as numberOfPurchases from Purchase where deleted = false group by status")
    List<PurchaseSummary> summarizeByState();

    interface PurchaseSummary {
        Purchase.Status getStatus();

        double getNumberOfPurchases();
    }

    @Query(value = "select coalesce((select max(purchase_number) + 1 from purchase where date_trunc('day', execution_time at time zone 'Europe/Zurich') = date_trunc('day', :date at time zone 'Europe/Zurich')), 1)", nativeQuery = true)
    Integer generatePurchaseNumber(@Param("date") Instant date);
}
