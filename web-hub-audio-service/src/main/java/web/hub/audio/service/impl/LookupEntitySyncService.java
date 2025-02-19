package web.hub.audio.service.impl;

import org.springframework.stereotype.Service;
import web.hub.audio.dao.entity.audit.AuditAction;
import web.hub.audio.dao.entity.audit.Vendor;
import web.hub.audio.dao.repository.audit.AuditActionRepository;
import web.hub.audio.dao.repository.audit.VendorRepository;
import web.hub.audio.enums.AuditActionType;
import web.hub.audio.enums.VendorType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class LookupEntitySyncService {

    private final AuditActionRepository auditActionRepository;
    private final VendorRepository vendorTypeRepository;

    public LookupEntitySyncService(AuditActionRepository auditActionRepository,
                                   VendorRepository vendorRepository) {
        this.auditActionRepository = auditActionRepository;
        this.vendorTypeRepository = vendorRepository;
    }

    public void syncAuditActions() {
        List<AuditActionType> auditActionTypes = AuditActionType.actionTypes();
        List<String> auditActionsFromDb = StreamSupport.stream(auditActionRepository.findAll().spliterator(), false)
                .map(AuditAction::getActionName)
                .collect(Collectors.toList());

        for (AuditActionType auditActionType : auditActionTypes) {
            if (!auditActionsFromDb.contains(auditActionType.name())) {
                AuditAction newAuditAction = new AuditAction();
                newAuditAction.setActionName(auditActionType.name());
                newAuditAction.setCreatedDate(LocalDateTime.now());
                auditActionRepository.save(newAuditAction);
            }
        }
    }

    public void syncVendors() {
        List<VendorType> vendorTypes = VendorType.vendors();
        List<String> vendorsFromDb = StreamSupport.stream(vendorTypeRepository.findAll().spliterator(), false)
                .map(Vendor::getVendorName)
                .collect(Collectors.toList());

        for (VendorType vendorType : vendorTypes) {
            if (!vendorsFromDb.contains(vendorType.name())) {
                Vendor newVendor = new Vendor();
                newVendor.setVendorName(vendorType.name());
                newVendor.setCreatedDate(LocalDateTime.now());
                vendorTypeRepository.save(newVendor);
            }
        }
    }

}
