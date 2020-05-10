package de.njsm.versusvirus.backend.service.receipt;

import de.njsm.versusvirus.backend.spring.storage.StorageClient;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.UUID;

@Service
public class ReceiptService {

    private final StorageClient storageClient;

    public ReceiptService(StorageClient storageClient) {
        this.storageClient = storageClient;
    }

    public void uploadReceipt(UUID purchaseSupermarketUuid, byte[] content) {
        storageClient.upload(purchaseSupermarketUuid.toString(), content);
    }

    public URL getUrl(UUID purchaseSupermarketUuid) {
        return storageClient.url(purchaseSupermarketUuid.toString());
    }

    public byte[] getContent(UUID purchaseSupermarketUuid) {
        return storageClient.get(purchaseSupermarketUuid.toString());
    }
}
