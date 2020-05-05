package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.PurchaseSupermarket;

public class ReceiptDTO {

    private final String supermarket;
    private final byte[] receipt;
    private final String mimeType;
    private final String extension;

    public ReceiptDTO(PurchaseSupermarket supermarket) {
        this.receipt = supermarket.getReceipt();
        this.mimeType = supermarket.getReceiptMimeType();
        this.extension = supermarket.getReceiptFileExtension();
        this.supermarket = supermarket.getName();
    }

    public byte[] getReceipt() {
        return receipt;
    }

    public String getMimeType() {
        return mimeType;
    }

    public String getExtension() {
        return extension;
    }

    public String getSupermarket() {
        return supermarket;
    }
}
