package de.njsm.versusvirus.backend.domain;

import de.njsm.versusvirus.backend.domain.common.Address;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import org.apache.commons.csv.CSVPrinter;

import javax.persistence.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Entity
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UUID uuid;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String timing;                    // timing to deliver purchase "after" or "before" certain time

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseSupermarket> purchaseSupermarketList = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PurchaseSize purchaseSize;        // depending on number of purchase items

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String publicComments;

    private String privateComments;

    private Instant createTime;

    private byte[] receipt;                   // picture of receipt

    private String receiptMimeType;

    private BigDecimal cost;                  // cost of purchase in "Rappen"

    private boolean expensesPaid;             // 10.- per purchase by foundation (if Volunteer wantsCompensation)

    private Long assignedVolunteer;

    private Long createdByModerator;

    private Long responsibleModeratorId;

    private Long customer;

    @ElementCollection
    @CollectionTable(name = "purchase_applications")
    @Column(name = "volunteer_id")
    private List<Long> volunteerApplications;

    // telegram parameters
    private String receiptFileId;
    private Long broadcastMessageId;

    public String getReceiptMimeType() {
        return receiptMimeType;
    }

    public void setReceiptMimeType(String receiptMimeType) {
        this.receiptMimeType = receiptMimeType;
    }

    public void writeToCsv(CSVPrinter csvPrinter, Optional<Customer> customer,
                           Optional<Volunteer> volunteer) throws IOException {
        DateTimeFormatter format = DateTimeFormatter.ISO_LOCAL_DATE
                .withLocale(Locale.GERMANY)
                .withZone(ZoneId.systemDefault());

        csvPrinter.printRecord(
                getId(),
                getStatus().displayName(),
                format.format(getCreateTime()),
                getPaymentMethod().displayName(),
                getCost().toString(),

                volunteer.map(Volunteer::getLastName).orElse(""),
                volunteer.map(Volunteer::getFirstName).orElse(""),
                volunteer.map(Volunteer::getAddress).map(Address::getAddress).orElse(""),
                volunteer.map(Volunteer::getAddress).map(Address::getZipCode).orElse(""),
                volunteer.map(Volunteer::getAddress).map(Address::getCity).orElse(""),
                volunteer.map(Volunteer::getBirthDate).map(LocalDate::toString).orElse(""),
                volunteer.flatMap(v -> Optional.ofNullable(v.getIban())).orElse(""),
                volunteer.flatMap(v -> Optional.ofNullable(v.getBankName())).orElse(""),
                volunteer.map(v -> v.getWantsCompensation() ? "10" : "0").orElse(""),

                customer.map(Customer::getLastName).orElse(""),
                customer.map(Customer::getFirstName).orElse(""),
                customer.map(Customer::getAddress).map(Address::getAddress).orElse(""),
                customer.map(Customer::getAddress).map(Address::getZipCode).orElse(""),
                customer.map(Customer::getAddress).map(Address::getCity).orElse("")
        );
    }

    public enum Status {
        NEW {
            @Override
            public String displayName() {
                return "Neu";
            }
        },
        PUBLISHED {
            @Override
            public String displayName() {
                return "Veröffentlicht";
            }
        },
        VOLUNTEER_FOUND {
            @Override
            public String displayName() {
                return "Helfer gefunden";
            }
        },
        VOLUNTEER_ACCEPTED {
            @Override
            public String displayName() {
                return "Helfer bestätigt";
            }
        },
        PURCHASE_DONE {
            @Override
            public String displayName() {
                return "Einkauf abgeschlossen";
            }
        },
        CUSTOMER_NOTIFIED {
            @Override
            public String displayName() {
                return "Kunde benachrichtigt";
            }
        },
        PURCHASE_IN_DELIVERY {
            @Override
            public String displayName() {
                return "Wird ausgeliefert";
            }
        },
        MONEY_NOT_FOUND {
            @Override
            public String displayName() {
                return "Kein Geld deponiert";
            }
        },
        PAYMENT_PENDING {
            @Override
            public String displayName() {
                return "Ausgeliefert - Zahlung ausstehend";
            }
        },
        PURCHASE_COMPLETED {
            @Override
            public String displayName() {
                return "Abgeschlossen";
            }
        };

        public abstract String displayName();
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
        TWINT {
            @Override
            public String displayName() {
                return "TWINT";
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

    public String getPublicComments() {
        return publicComments;
    }

    public void setPublicComments(String publicComments) {
        this.publicComments = publicComments;
    }

    public String getPrivateComments() {
        return privateComments;
    }

    public void setPrivateComments(String privateComments) {
        this.privateComments = privateComments;
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

    public Long getCustomerId() {
        return customer;
    }

    public void setCustomerId(Long customer) {
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

    public List<PurchaseSupermarket> getPurchaseSupermarketList() {
        return purchaseSupermarketList;
    }

    public void addSupermarket(PurchaseSupermarket supermarket) {
        purchaseSupermarketList.add(supermarket);
        supermarket.setPurchase(this);
    }

    public void setPurchaseList(List<PurchaseSupermarket> purchaseList) {
        this.purchaseSupermarketList = purchaseList;
    }

    public Long getResponsibleModeratorId() {
        return responsibleModeratorId;
    }

    public void setResponsibleModeratorId(Long responsibleModeratorId) {
        this.responsibleModeratorId = responsibleModeratorId;
    }

    @PrePersist
    private void setUuid() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }
}
