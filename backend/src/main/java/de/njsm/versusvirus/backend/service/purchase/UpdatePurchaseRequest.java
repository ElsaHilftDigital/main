package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.Purchase;

import java.math.BigDecimal;
import java.util.List;

public class UpdatePurchaseRequest {
    public String timing;
    public String comments;
    public Purchase.PurchaseSize size;
    public Purchase.PaymentMethod paymentMethod;
    public BigDecimal cost;
    public List<PurchaseSupermarketDTO> supermarkets;
}
