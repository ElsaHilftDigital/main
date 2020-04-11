package de.njsm.versusvirus.backend.service.purchase;

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
    public List<PurchaseSupermarketDTO> supermarkets;
    public String status;
    public Purchase.PaymentMethod paymentMethod;
    public String timing;
    public Purchase.PurchaseSize size;
    public String comments;
    public Double cost;
    public boolean expensesPaid;
    public Long assignedVolunteer;
    public long createdByModerator;
    public UUID customer;
    public String createDate;

    public PurchaseWithApplicationsDTO(Purchase p, UUID customer, List<VolunteerDTO> applications) {
        uuid = p.getUuid();
        volunteerApplications = applications;
        supermarkets = p.getPurchaseSupermarketList().stream().map(PurchaseSupermarketDTO::new).collect(Collectors.toList());
        status = p.getStatus().displayName();
        paymentMethod = p.getPaymentMethod();
        timing = p.getTiming();
        size = p.getPurchaseSize();
        comments = p.getComments();
        cost = Optional.ofNullable(p.getCost()).map(BigDecimal::doubleValue).orElse(null);
        expensesPaid = p.isExpensesPaid();
        assignedVolunteer = p.getAssignedVolunteer();
        createdByModerator = p.getCreatedByModerator();
        this.customer = customer;
        createDate = p.getCreateTime().toString();
    }
}
