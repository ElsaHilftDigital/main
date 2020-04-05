package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;

public class OrderItemDTO {

    public long id;
    public String purchaseItem;

    public OrderItemDTO(OrderItem i) {
        id = i.getId();
        purchaseItem = i.getPurchaseItem();
    }
}
