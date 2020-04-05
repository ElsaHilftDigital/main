package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public class PurchaseWithApplicationsDTO {

    public UUID uuid;
    public List<VolunteerDTO> volunteerApplications;
    public List<String> orderItems;
    public Purchase.Status status;
    public Purchase.PaymentMethod paymentMethod;
    public String timing;
    public String supermarket;
    public Purchase.PurchaseSize size;
    public String comments;
    public Double cost;
    public boolean expensesPaid;
    public Long assignedVolunteer;
    public long createdByModerator;
    public long customer;

    public PurchaseWithApplicationsDTO(Purchase p, List<VolunteerDTO> applications) {
        uuid = p.getUuid();
        volunteerApplications = applications;
        orderItems = p.getPurchaseList().stream().map(OrderItem::getPurchaseItem).collect(Collectors.toList());
        status = p.getStatus();
        paymentMethod = p.getPaymentMethod();
        timing = p.getTiming();
        supermarket = p.getSupermarket();
        size = p.getPurchaseSize();
        comments = p.getComments();
        cost = Optional.ofNullable(p.getCost()).map(BigDecimal::doubleValue).orElse(null);
        expensesPaid = p.isExpensesPaid();
        assignedVolunteer = p.getAssignedVolunteer();
        createdByModerator = p.getCreatedByModerator();
        customer = p.getCustomer();
    }
}
