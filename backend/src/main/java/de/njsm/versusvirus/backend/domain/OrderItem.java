package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String purchaseItem;

    @ManyToOne(fetch = FetchType.LAZY)
    private PurchaseSupermarket purchaseSupermarket;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getPurchaseItem() {
        return purchaseItem;
    }

    public void setPurchaseItem(String purchaseItem) {
        this.purchaseItem = purchaseItem;
    }

    public PurchaseSupermarket getPurchaseSupermarket() {
        return purchaseSupermarket;
    }

    public void setPurchaseSupermarket(PurchaseSupermarket purchaseSupermarket) {
        this.purchaseSupermarket = purchaseSupermarket;
    }
}
