package de.njsm.versusvirus.backend.service.purchase;

public class ReceiptDTO {

    private byte[] receipt;

    private String mimeType;

    public ReceiptDTO(byte[] receipt, String mimeType) {
        this.mimeType = mimeType;
        this.receipt = receipt;
    }

    public byte[] getReceipt() {
        return receipt;
    }

    public String getMimeType() {
        return mimeType;
    }
}
