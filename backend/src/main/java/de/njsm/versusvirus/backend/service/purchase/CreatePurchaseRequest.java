package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.Purchase;

import java.util.List;
import java.util.UUID;

public class CreatePurchaseRequest {

    public List<String> orderItems;
    public Purchase.PaymentMethod paymentMethod;
    public String timing;
    public String supermarket;
    public Purchase.PurchaseSize size;
    public String comments;
    public long createdByModerator;
    public UUID customer;
}
