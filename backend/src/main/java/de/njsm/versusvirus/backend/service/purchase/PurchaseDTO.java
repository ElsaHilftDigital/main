package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Purchase;

import java.util.List;
import java.util.UUID;

public class PurchaseDTO {

    public UUID uuid;
    public List<Long> volunteerApplications;
    public List<OrderItem> orderItems;
    public Purchase.Status status;
    public Purchase.PaymentMethod paymentMethod;
    public String timing;
    public String supermarket;
    public Purchase.PurchaseSize size;
    public String comments;
    public double cost;
    public boolean expensesPaid;
    public long assignedVolunteer;
    public long createdByModerator;
    public long customer;

}