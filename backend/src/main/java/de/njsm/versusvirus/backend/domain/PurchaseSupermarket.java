package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class PurchaseSupermarket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UUID uuid;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    private Purchase purchase;

    @OneToMany(mappedBy = "purchaseSupermarket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> purchaseList = new ArrayList<>();

    private boolean receiptUploaded;

    private byte[] receipt;

    private String receiptFileExtension;

    private String receiptMimeType;

    private String receiptFileId;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public UUID getUuid() {
        return uuid;
    }

    @PrePersist
    private void setUuid() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Purchase getPurchase() {
        return purchase;
    }

    public void setPurchase(Purchase purchaseSupermarket) {
        this.purchase = purchaseSupermarket;
    }

    public List<OrderItem> getPurchaseList() {
        return purchaseList;
    }

    public void addOrderItem(OrderItem purchaseItem) {
        purchaseList.add(purchaseItem);
        purchaseItem.setPurchaseSupermarket(this);
    }

    public byte[] getReceipt() {
        return receipt;
    }

    public void setReceipt(byte[] receipt) {
        this.receipt = receipt;
    }

    public String getReceiptFileExtension() {
        return receiptFileExtension;
    }

    public void setReceiptFileExtension(String receiptFileExtension) {
        this.receiptFileExtension = receiptFileExtension;
    }

    public String getReceiptMimeType() {
        return receiptMimeType;
    }

    public void setReceiptMimeType(String receiptMimeType) {
        this.receiptMimeType = receiptMimeType;
    }

    public String getReceiptFileId() {
        return receiptFileId;
    }

    public void setReceiptFileId(String receiptFileId) {
        this.receiptFileId = receiptFileId;
    }

    public boolean isReceiptUploaded() {
        return receiptUploaded;
    }

    public void setReceiptUploaded(boolean receiptUploaded) {
        this.receiptUploaded = receiptUploaded;
    }
}
