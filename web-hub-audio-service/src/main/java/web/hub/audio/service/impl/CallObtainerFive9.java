package web.hub.audio.service.impl;

import com.prosper.platform.springboot.gcp.client.GoogleCloudStorageClient;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import web.hub.audio.dao.entity.five9.Five9Segment;
import web.hub.audio.dao.repository.five9.Five9SegmentRepository;
import web.hub.audio.enums.AuditActionType;
import web.hub.audio.exception.CallNotFoundException;
import web.hub.audio.service.AuditService;
import web.hub.audio.service.CallObtainer;

import java.io.InputStream;

import static web.hub.audio.enums.VendorType.FIVE9;

@Service
public class CallObtainerFive9 implements CallObtainer {

    private final Five9SegmentRepository segmentRepository;
    private final GoogleCloudStorageClient gcpClient;
    private final AuditService auditService;

    @Value("${hub-audio-service.google-cloud-storage.five9-bucket-name}")
    private String gcpFive9BucketName;

    public CallObtainerFive9(Five9SegmentRepository segmentRepository,
                             GoogleCloudStorageClient gcpClient,
                             AuditService auditService) {
        this.segmentRepository = segmentRepository;
        this.gcpClient = gcpClient;
        this.auditService = auditService;
    }


    @Override
    public ImmutablePair<String, InputStream> getStream(Integer id, AuditActionType actionType) {
        Five9Segment five9Segment = segmentRepository.findById(id).orElseThrow(() ->
        {
            throw new CallNotFoundException("Cannot find Five9 Segment with id: " + id);
        });

        InputStream audioStream = gcpClient.download(five9Segment.getGcpFileKey(), gcpFive9BucketName);
        auditService.addAuditRecord(actionType,
                FIVE9,
                StringUtils.EMPTY,
                five9Segment.getCall().getCallId().toString(),
                five9Segment.getSegmentId().toString());

        String[] split = five9Segment.getGcpFileKey().split("/");
        return new ImmutablePair<>(split[split.length - 1], audioStream);
    }
}
