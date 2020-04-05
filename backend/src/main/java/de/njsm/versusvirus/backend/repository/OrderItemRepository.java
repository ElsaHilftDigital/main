package de.njsm.versusvirus.backend.repository;

import de.njsm.versusvirus.backend.domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
