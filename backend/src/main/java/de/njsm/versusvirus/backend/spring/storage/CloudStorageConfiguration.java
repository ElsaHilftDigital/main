package de.njsm.versusvirus.backend.spring.storage;

import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudStorageConfiguration {

    @Value("${storage.bucket.name}")
    private String bucketName;

    @Bean
    public StorageClient storageClient() {
        var storage = StorageOptions.getDefaultInstance().getService();
        return new StorageClient(storage, bucketName);
    }
}
