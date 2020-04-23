package de.njsm.versusvirus.backend;

import de.njsm.versusvirus.backend.domain.Purchase;

public class PurchaseSummary {

    private Purchase.Status status;

    private double numberOfPurchases;

    public PurchaseSummary(Purchase.Status status, double numberOfPurchases) {
        this.status = status;
        this.numberOfPurchases = numberOfPurchases;
    }

    public Purchase.Status getStatus() {
        return status;
    }

    public double getNumberOfPurchases() {
        return numberOfPurchases;
    }

    public void setStatus(Purchase.Status status) {
        this.status = status;
    }

    public void setNumberOfPurchases(double numberOfPurchases) {
        this.numberOfPurchases = numberOfPurchases;
    }
}
