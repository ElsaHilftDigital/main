package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.Purchase;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public class PurchaseDTO {

    public long id;
    public UUID uuid;
    public List<Long> volunteerApplications;
    public List<PurchaseSupermarketDTO> supermarkets;
    public String status;
    public Purchase.PaymentMethod paymentMethod;
    public String timing;
    public Purchase.PurchaseSize size;
    public String publicComments;
    public String privateComments;
    public String internalComments;
    public Double cost;
    public boolean expensesPaid;
    public Long assignedVolunteer;
    public long createdByModerator;
    public long customer;
    public String createDate;
    public String executionDate;
    public String purchaseNumber;

    public PurchaseDTO(Purchase p) {
        id = p.getId();
        uuid = p.getUuid();
        volunteerApplications = p.getVolunteerApplications();
        supermarkets = p.getPurchaseSupermarketList().stream().map(PurchaseSupermarketDTO::new).collect(Collectors.toList());
        status = p.getStatus().displayName();
        paymentMethod = p.getPaymentMethod();
        timing = p.getTiming();
        size = p.getPurchaseSize();
        publicComments = p.getPublicComments();
        privateComments = p.getPrivateComments();
        internalComments = p.getInternalComments();
        cost = p.getCost().map(BigDecimal::doubleValue).orElse(null);
        expensesPaid = p.isExpensesPaid();
        assignedVolunteer = p.getAssignedVolunteer().orElse(null);
        createdByModerator = p.getCreatedByModerator();
        customer = p.getCustomerId();
        createDate = p.getCreateTime().toString();
        executionDate = p.getExecutionTime().toString();
        purchaseNumber = Long.toString(p.getId());
    }
}
