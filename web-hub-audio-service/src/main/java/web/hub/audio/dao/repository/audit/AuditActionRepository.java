package web.hub.audio.dao.repository.audit;

import org.springframework.data.repository.CrudRepository;
import web.hub.audio.dao.entity.audit.AuditAction;

import java.util.Optional;

public interface AuditActionRepository extends CrudRepository<AuditAction, Integer> {

    Optional<AuditAction> getAuditActionByActionName(String actionName);
}
