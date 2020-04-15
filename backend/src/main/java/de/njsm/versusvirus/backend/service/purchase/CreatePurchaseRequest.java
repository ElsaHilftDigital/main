package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.Purchase;

import java.util.List;
import java.util.UUID;

public class CreatePurchaseRequest {

    public List<PurchaseSupermarketDTO> supermarkets;
    public Purchase.PaymentMethod paymentMethod;
    public String timing;
    public Purchase.PurchaseSize purchaseSize;
    public String publicComments;
    public String privateComments;
    public UUID customer;
}
