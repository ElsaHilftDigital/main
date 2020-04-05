package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;

public class OrderItemDTO {

    public String purchaseItem;

    public OrderItemDTO(OrderItem i) {
        purchaseItem = i.getPurchaseItem();
    }
}
