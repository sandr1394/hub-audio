package web.hub.audio.dao.repository.five9;

import org.springframework.data.repository.CrudRepository;
import web.hub.audio.dao.entity.five9.Five9Segment;

import java.util.Optional;

public interface Five9SegmentRepository extends CrudRepository<Five9Segment, Integer> {

    Optional<Five9Segment> getBySegmentId(Integer segmentId);
}
