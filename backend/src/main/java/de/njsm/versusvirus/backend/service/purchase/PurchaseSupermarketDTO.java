package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.PurchaseSupermarket;

import java.util.List;
import java.util.stream.Collectors;

public class PurchaseSupermarketDTO {

    public String name;
    public List<String> orderItems;

    public PurchaseSupermarketDTO(PurchaseSupermarket market) {
        this.name = market.getName();
        this.orderItems = market.getPurchaseSupermarketList().stream().map(OrderItem::getPurchaseItem).collect(Collectors.toList());
    }
}
