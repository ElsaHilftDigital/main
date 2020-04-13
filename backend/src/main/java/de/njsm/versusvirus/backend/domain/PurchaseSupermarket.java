package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class PurchaseSupermarket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    private Purchase purchase;

    @OneToMany(mappedBy = "purchaseSupermarket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> purchaseList = new ArrayList<>();

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
}
