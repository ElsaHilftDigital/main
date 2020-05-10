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

    public boolean isReceiptUploaded() {
        return receiptUploaded;
    }

    public void setReceiptUploaded(boolean receiptUploaded) {
        this.receiptUploaded = receiptUploaded;
    }
}
