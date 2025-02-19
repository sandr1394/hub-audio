package web.hub.audio.dao.repository.interactions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import web.hub.audio.dao.entity.interactions.InteractionsCall;

public interface InteractionsCallRepository extends JpaRepository<InteractionsCall, Integer>,
        JpaSpecificationExecutor<InteractionsCall> {

}
