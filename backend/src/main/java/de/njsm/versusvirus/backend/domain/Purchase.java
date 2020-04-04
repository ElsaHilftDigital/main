package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;
import java.math.BigDecimal;
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
        SMALL,
        MEDIUM,
        LARGE
    }

    public enum PaymentMethod {
        CASH,
        BILL,
        OTHER
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

    private byte[] receipt;                   // picture of receipt
    private double cost;                      // cost of purchase in "Rappen"
    private boolean expensesPaid;             // 10.- per purchase by foundation (if Volunteer wantsCompensation)

    // telegram parameters
    private String receiptFileId;
    private int broadcastMessageId;

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

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
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

    public int getBroadcastMessageId() {
        return broadcastMessageId;
    }

    public void setBroadcastMessageId(int broadcastMessageId) {
        this.broadcastMessageId = broadcastMessageId;
    }
}
