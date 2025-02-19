package web.hub.audio.dao.repository.audit;

import org.springframework.data.repository.CrudRepository;
import web.hub.audio.dao.entity.audit.AuditRecord;

public interface AuditRepository extends CrudRepository<AuditRecord, Integer> {
}
