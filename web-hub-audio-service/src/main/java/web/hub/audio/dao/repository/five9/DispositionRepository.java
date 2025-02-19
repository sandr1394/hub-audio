package web.hub.audio.dao.repository.five9;

import org.springframework.data.repository.Repository;
import web.hub.audio.dao.entity.five9.Disposition;

import java.util.Optional;

public interface DispositionRepository extends Repository<Disposition, Integer> {

    Optional<Disposition> getDispositionByDispositionName(String name);
}
