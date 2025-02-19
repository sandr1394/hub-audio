package web.hub.audio.service.impl;

import com.prosper.platform.springboot.gcp.client.GoogleCloudStorageClient;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import web.hub.audio.dao.entity.interactions.InteractionsCall;
import web.hub.audio.dao.repository.interactions.InteractionsCallRepository;
import web.hub.audio.enums.AuditActionType;
import web.hub.audio.exception.CallNotFoundException;
import web.hub.audio.service.AuditService;
import web.hub.audio.service.CallObtainer;

import java.io.InputStream;

import static web.hub.audio.enums.VendorType.INTERACTIONS;

@Service
public class CallObtainerInteractions implements CallObtainer {

    private final InteractionsCallRepository callRepository;
    private final GoogleCloudStorageClient gcpClient;
    private final AuditService auditService;

    @Value("${hub-audio-service.google-cloud-storage.interactions-bucket-name}")
    private String gcpInteractionsBucketName;

    public CallObtainerInteractions(InteractionsCallRepository callRepository,
                                    GoogleCloudStorageClient gcpClient,
                                    AuditService auditService) {
        this.callRepository = callRepository;
        this.gcpClient = gcpClient;
        this.auditService = auditService;
    }

    @Override
    public ImmutablePair<String, InputStream> getStream(Integer id, AuditActionType auditActionType) {
        InteractionsCall call = callRepository.findById(id).orElseThrow(() ->
        {
            throw new CallNotFoundException("Cannot find Interactions Call with id: " + id);
        });

        InputStream audioStream = gcpClient.download(call.getGcpFileKey(), gcpInteractionsBucketName);
        auditService.addAuditRecord(auditActionType,
                INTERACTIONS,
                StringUtils.EMPTY,
                call.getCallId().toString(),
                call.getSegmentId());
        return new ImmutablePair<>(call.getGcpFileKey(), audioStream);
    }
}
