package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.Purchase;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class UpdatePurchaseRequest {
    public String timing;
    public String publicComments;
    public String privateComments;
    public Purchase.PurchaseSize size;
    public Purchase.PaymentMethod paymentMethod;
    public BigDecimal cost;
    public List<PurchaseSupermarketDTO> supermarkets;
    public UUID responsibleModerator;
}
