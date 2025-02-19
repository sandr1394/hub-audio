package web.hub.audio.config;

import com.prosper.platform.springboot.gcp.client.GoogleCloudStorageClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GcpClientConfig {

    @Value("${platform.spring-boot.google-cloud-storage.client-id}")
    private String clientId;
    @Value("${platform.spring-boot.google-cloud-storage.client-email}")
    private String clientEmail;
    @Value("${platform.spring-boot.google-cloud-storage.private-key-pkcs8}")
    private String privateKeyPkcs8;
    @Value("${platform.spring-boot.google-cloud-storage.private-key-id}")
    private String privateKeyId;

    @Bean
    public GoogleCloudStorageClient getGcpClient() {
        return new GoogleCloudStorageClient(clientId,
                clientEmail,
                privateKeyPkcs8,
                privateKeyId);
    }
}
