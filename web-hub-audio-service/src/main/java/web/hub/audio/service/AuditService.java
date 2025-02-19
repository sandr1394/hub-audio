package web.hub.audio.service;

import web.hub.audio.enums.AuditActionType;
import web.hub.audio.enums.VendorType;

public interface AuditService {

   void addAuditRecord(AuditActionType action, VendorType vendor, String details);
   void addAuditRecord(AuditActionType action, VendorType vendor, String details, String callId, String segmentId);

}
