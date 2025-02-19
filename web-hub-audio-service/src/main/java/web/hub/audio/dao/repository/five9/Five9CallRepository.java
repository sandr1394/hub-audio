package web.hub.audio.dao.repository.five9;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import web.hub.audio.dao.entity.five9.Five9Call;

public interface Five9CallRepository extends JpaRepository<Five9Call, Integer>,
        JpaSpecificationExecutor<Five9Call> {

    @Override
    @NotNull
    @EntityGraph(attributePaths = "segments")
    Page<Five9Call> findAll(Specification<Five9Call> spec, @NotNull Pageable pageable);
}
