package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.PurchaseSupermarket;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class PurchaseSupermarketDTO {

    public UUID uuid;
    public String name;
    public List<String> orderItems;

    public PurchaseSupermarketDTO() {

    }

    public PurchaseSupermarketDTO(PurchaseSupermarket market) {
        this.uuid = market.getUuid();
        this.name = market.getName();
        this.orderItems = market.getPurchaseList().stream().map(OrderItem::getPurchaseItem).collect(Collectors.toList());
    }
}
