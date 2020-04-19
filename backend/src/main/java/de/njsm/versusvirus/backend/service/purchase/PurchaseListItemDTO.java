package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.Customer;
import de.njsm.versusvirus.backend.domain.Moderator;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public class PurchaseListItemDTO {
    public UUID uuid;
    public CustomerDTO customer;
    public VolunteerDTO volunteer;
    public StatusIndicator statusIndicator;
    public String status;
    public Double cost;
    public boolean paid;
    public String deadline;
    public String responsible;
    public String createdBy;
    public Instant createdAt;

    public PurchaseListItemDTO(
            Purchase purchase,
            Customer customer,
            Volunteer assignedVolunteer,
            Moderator responsibleModerator,
            Moderator createdBy) {
        this.uuid = purchase.getUuid();
        this.customer = new CustomerDTO();
        this.customer.name = customer.getFirstName() + " " + customer.getLastName();
        this.customer.phone = customer.getPhone();
        if (assignedVolunteer != null) {
            this.volunteer = new VolunteerDTO();
            this.volunteer.name = assignedVolunteer.getFirstName() + " " + assignedVolunteer.getLastName();
            this.volunteer.phone = assignedVolunteer.getPhone();
        }
        this.statusIndicator = StatusIndicator.get(purchase.getStatus());
        this.status = purchase.getStatus().displayName();
        this.cost = purchase.getCost().map(BigDecimal::doubleValue).orElse(null);
        this.paid = purchase.getStatus() == Purchase.Status.PURCHASE_COMPLETED;
        this.deadline = purchase.getTiming();
        this.responsible = responsibleModerator.getName();
        this.createdBy = createdBy.getName();
        this.createdAt = purchase.getCreateTime();
    }
}

class CustomerDTO {
    public String name;
    public String phone;
}

class VolunteerDTO {
    public String name;
    public String phone;
}

enum StatusIndicator {
    RED,
    AMBER,
    GREEN;

    private static final Logger LOG = LoggerFactory.getLogger(StatusIndicator.class);

    static StatusIndicator get(Purchase.Status purchaseStatus) {
        switch (purchaseStatus) {
            case PURCHASE_COMPLETED:
                return GREEN;
            case VOLUNTEER_ACCEPTED:
            case CUSTOMER_NOTIFIED:
            case PURCHASE_IN_DELIVERY:
            case PUBLISHED:
                return AMBER;
            case NEW:
            case VOLUNTEER_FOUND:
            case PURCHASE_DONE:
            case MONEY_NOT_FOUND:
            case PAYMENT_PENDING:
                return RED;
            default:
                LOG.error("Unknown Purchase Status: {}", purchaseStatus.name());
                return null;
        }
    }
}
