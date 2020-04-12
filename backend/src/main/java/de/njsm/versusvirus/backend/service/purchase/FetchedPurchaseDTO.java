package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.Customer;
import de.njsm.versusvirus.backend.domain.Moderator;
import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.service.customer.CustomerDTO;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public class FetchedPurchaseDTO {
    public UUID uuid;
    public VolunteerDTO assignedVolunteer;
    public List<VolunteerDTO> volunteerApplications;
    public List<String> orderItems;
    public String status;
    public Purchase.PaymentMethod paymentMethod;
    public String timing;
    public String supermarket;
    public Purchase.PurchaseSize size;
    public String comments;
    public Double cost;
    public boolean expensesPaid;
    public Void createdBy; // TODO
    public Void responsible; // TODO
    public CustomerDTO customer;
    public Instant createdAt;

    public FetchedPurchaseDTO(Purchase purchase,
                              Volunteer assignedVolunteer,
                              List<Volunteer> volunteerApplications,
                              Customer customer,
                              Moderator createdBy,
                              Moderator responsible) {
        this.uuid = purchase.getUuid();
        this.assignedVolunteer = Optional.ofNullable(assignedVolunteer).map(VolunteerDTO::new).orElse(null);
        this.volunteerApplications = volunteerApplications.stream().map(VolunteerDTO::new).collect(Collectors.toList());
        this.orderItems = purchase.getPurchaseList().stream().map(OrderItem::getPurchaseItem).collect(Collectors.toList());
        this.status = purchase.getStatus().displayName();
        this.paymentMethod = purchase.getPaymentMethod();
        this.timing = purchase.getTiming();
        this.supermarket = purchase.getSupermarket();
        this.size = purchase.getPurchaseSize();
        this.comments = purchase.getComments();
        this.cost = Optional.ofNullable(purchase.getCost()).map(BigDecimal::doubleValue).orElse(null);
        this.customer = new CustomerDTO(customer);
        this.expensesPaid = purchase.isExpensesPaid();
        this.createdAt = purchase.getCreateTime();
    }
}
