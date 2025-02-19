package web.hub.audio.service.impl;

import org.springframework.stereotype.Service;
import web.hub.audio.dao.entity.audit.AuditAction;
import web.hub.audio.dao.entity.audit.AuditRecord;
import web.hub.audio.dao.entity.audit.Vendor;
import web.hub.audio.dao.repository.audit.AuditActionRepository;
import web.hub.audio.dao.repository.audit.AuditRepository;
import web.hub.audio.dao.repository.audit.VendorRepository;
import web.hub.audio.enums.AuditActionType;
import web.hub.audio.enums.VendorType;
import web.hub.audio.exception.AuditActionNotFoundException;
import web.hub.audio.exception.AuditActionTypeException;
import web.hub.audio.exception.VendorNotFoundException;
import web.hub.audio.service.AuditService;

import java.time.LocalDateTime;

import static web.hub.audio.util.Util.getAuthenticationContext;

@Service
public class AuditServiceImpl implements AuditService {

    private final AuditRepository auditRepository;
    private final AuditActionRepository auditActionRepository;
    private final VendorRepository vendorTypeRepository;

    public AuditServiceImpl(AuditRepository auditRepository,
                            AuditActionRepository auditActionRepository,
                            VendorRepository vendorTypeRepository) {
        this.auditRepository = auditRepository;
        this.auditActionRepository = auditActionRepository;
        this.vendorTypeRepository = vendorTypeRepository;
    }

    @Override
    public void addAuditRecord(AuditActionType action, VendorType vendorType, String details) {
        AuditRecord auditRecord = getAuditRecord(action, vendorType, details);
        auditRepository.save(auditRecord);
    }

    @Override
    public void addAuditRecord(AuditActionType action,
                               VendorType vendorType,
                               String details,
                               String callId,
                               String segmentId) {
        AuditRecord auditRecord = getAuditRecord(action, vendorType, details);
        auditRecord.setCallId(callId);
        auditRecord.setSegmentId(segmentId);
        auditRepository.save(auditRecord);
    }

    private AuditRecord getAuditRecord(AuditActionType action, VendorType vendorType, String details) {
        AuditRecord record = new AuditRecord();
        String userName = getAuthenticationContext().getName();
        record.setUser(userName);

        AuditAction auditAction = auditActionRepository.getAuditActionByActionName(action.name()).orElseThrow(() ->
                new AuditActionNotFoundException("Cannot find audit action with name: " + action.name()));
        record.setAuditAction(auditAction);

        Vendor vendor = vendorTypeRepository.getVendorByVendorName(vendorType.name()).orElseThrow(() ->
                new VendorNotFoundException("Cannot find vendor with name: " + vendorType.name()));
        record.setVendor(vendor);

        record.setCreatedDate(LocalDateTime.now());
        String detailsMessage = createDetailsMessage(userName, action, vendorType, details);
        record.setDetails(detailsMessage);

        return record;
    }

    private String createDetailsMessage(String user, AuditActionType action, VendorType vendor, String details) {
        String detailsMessage;
        switch (action) {
            case AUDIO_REPLAYING -> detailsMessage = String.format("User %s replayed %s audio file.", user, vendor);
            case AUDIO_DOWNLOADING -> detailsMessage = String.format("User %s downloaded %s audio file.", user, vendor);
            case METADATA_LOOKUP -> detailsMessage = String.format("User %s lookup %s metadata with filter: %s.", user, vendor, details);
            default -> throw new AuditActionTypeException(String.format("Unknown action type provided: %s.", action));
        }
        return detailsMessage;
    }
}
