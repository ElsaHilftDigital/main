package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UUID uuid;

    public enum Status {
        NEW,
        VOLUNTEER_FOUND,
        VOLUNTEER_ACCEPTED,
        PURCHASE_DONE,
        CUSTOMER_NOTIFIED,
        PURCHASE_IN_DELIVERY,                 // volunteer is on his / her way
        MONEY_NOT_FOUND,                      // money is not in letter box
        PAYMENT_PENDING,                      // purchase delivered but not paid yet (other payment method than cash)
        PURCHASE_COMPLETED                    // purchase and payment completed
    }

    public enum PurchaseSize {
        SMALL {
            @Override
            public String displayName() {
                return "kleiner Einkauf";
            }
        },
        MEDIUM {
            @Override
            public String displayName() {
                return "mittlerer Einkauf";
            }
        },
        LARGE {
            @Override
            public String displayName() {
                return "grosser Einkauf";
            }
        };
        public abstract String displayName();
    }

    public enum PaymentMethod {
        CASH {
            @Override
            public String displayName() {
                return "Bargeld";
            }
        },
        BILL {
            @Override
            public String displayName() {
                return "Überweisung";
            }
        },
        OTHER {
            @Override
            public String displayName() {
                return "Andere";
            }
        };
        public abstract String displayName();
    }

    @Enumerated(EnumType.STRING)
    private Status status;
    private String timing;                    // timing to deliver purchase "after" or "before" certain time
    private String supermarket;               // preferred supermarket
    @Enumerated(EnumType.STRING)
    private PurchaseSize purchaseSize;        // depending on number of purchase items
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    private String comments;
    private Instant createTime;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> purchaseList = new ArrayList<>();

    private byte[] receipt;                   // picture of receipt
    private BigDecimal cost;                      // cost of purchase in "Rappen"
    private boolean expensesPaid;             // 10.- per purchase by foundation (if Volunteer wantsCompensation)

    private Long assignedVolunteer;
    private Long createdByModerator;
    private Long customer;

    @ElementCollection
    @CollectionTable(name = "purchase_applications")
    @Column(name = "volunteer_id")
    private List<Long> volunteerApplications;

    // telegram parameters
    private String receiptFileId;
    private Long broadcastMessageId;

    public long getId() {
        return id;
    }

    public UUID getUuid() {
        return uuid;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getTiming() {
        return timing;
    }

    public void setTiming(String timing) {
        this.timing = timing;
    }

    public String getSupermarket() {
        return supermarket;
    }

    public void setSupermarket(String supermarket) {
        this.supermarket = supermarket;
    }

    public PurchaseSize getPurchaseSize() {
        return purchaseSize;
    }

    public void setPurchaseSize(PurchaseSize purchaseSize) {
        this.purchaseSize = purchaseSize;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public byte[] getReceipt() {
        return receipt;
    }

    public void setReceipt(byte[] receipt) {
        this.receipt = receipt;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public boolean isExpensesPaid() {
        return expensesPaid;
    }

    public void setExpensesPaid(boolean expensesPaid) {
        this.expensesPaid = expensesPaid;
    }

    public String getReceiptFileId() {
        return receiptFileId;
    }

    public void setReceiptFileId(String receiptFileId) {
        this.receiptFileId = receiptFileId;
    }

    public long getBroadcastMessageId() {
        return broadcastMessageId;
    }

    public void setBroadcastMessageId(long broadcastMessageId) {
        this.broadcastMessageId = broadcastMessageId;
    }

    public Long getAssignedVolunteer() {
        return assignedVolunteer;
    }

    public void setAssignedVolunteer(Long assignedVolunteer) {
        this.assignedVolunteer = assignedVolunteer;
    }

    public Long getCreatedByModerator() {
        return createdByModerator;
    }

    public void setCreatedByModerator(Long createdByModerator) {
        this.createdByModerator = createdByModerator;
    }

    public Long getCustomer() {
        return customer;
    }

    public void setCustomer(Long customer) {
        this.customer = customer;
    }

    public Instant getCreateTime() {
        return createTime;
    }

    public void setCreateTime() {
        this.createTime = Instant.now();
    }

    public List<Long> getVolunteerApplications() {
        return volunteerApplications;
    }

    public void setVolunteerApplications(List<Long> volunteerApplications) {
        this.volunteerApplications = volunteerApplications;
    }

    public List<OrderItem> getPurchaseList() {
        return purchaseList;
    }

    public void addOrderItem(OrderItem orderItem) {
        purchaseList.add(orderItem);
        orderItem.setPurchase(this);
    }

    public void setPurchaseList(List<OrderItem> purchaseList) {
        this.purchaseList = purchaseList;
    }

    @PrePersist
    private void setUuid() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }
}
