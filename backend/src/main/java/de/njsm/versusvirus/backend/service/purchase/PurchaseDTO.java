package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Purchase;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class PurchaseDTO {

    public UUID uuid;
    public List<Long> volunteerApplications;
    public List<String> orderItems;
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

    public PurchaseDTO(Purchase p) {
        uuid = p.getUuid();
        volunteerApplications = p.getVolunteerApplications();
        orderItems = p.getPurchaseList().stream().map(OrderItem::getPurchaseItem).collect(Collectors.toList());
        status = p.getStatus();
        paymentMethod = p.getPaymentMethod();
        timing = p.getTiming();
        supermarket = p.getSupermarket();
        size = p.getPurchaseSize();
        comments = p.getComments();
        cost = p.getCost();
        expensesPaid = p.isExpensesPaid();
        assignedVolunteer = p.getAssignedVolunteer();
        createdByModerator = p.getCreatedByModerator();
        customer = p.getCustomer();
    }
}
