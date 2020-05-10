package de.njsm.versusvirus.backend.spring.storage;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

import java.net.URL;
import java.util.concurrent.TimeUnit;

public class StorageClient {

    private final Storage storage;
    private final String bucketName;

    StorageClient(Storage storage, String bucketName) {
        this.storage = storage;
        this.bucketName = bucketName;
    }

    public void upload(String filename, byte[] content) {
        storage.create(blobInfo(filename), content);
    }

    public URL url(String filename) {
        return storage.signUrl(blobInfo(filename), 10, TimeUnit.SECONDS);
    }

    public byte[] get(String filename) {
        return storage.get(blobInfo(filename).getBlobId()).getContent();
    }

    private BlobInfo blobInfo(String filename) {
        return BlobInfo.newBuilder(bucketName, filename).build();
    }
}
