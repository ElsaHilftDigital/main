package de.njsm.versusvirus.backend.service.purchase;

public class ReceiptDTO {

    private byte[] receipt;
    private String mimeType;
    private String extension;

    public ReceiptDTO(byte[] receipt, String mimeType, String extension) {
        this.mimeType = mimeType;
        this.receipt = receipt;
        this.extension = extension;
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
}
