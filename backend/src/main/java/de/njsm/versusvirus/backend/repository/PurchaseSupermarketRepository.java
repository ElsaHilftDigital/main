package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.PurchaseSupermarket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PurchaseSupermarketRepository extends JpaRepository<PurchaseSupermarket, Long> {
    Optional<PurchaseSupermarket> findByUuid(UUID uuid);
}
