package web.hub.audio.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import web.hub.audio.dao.entity.five9.Five9Segment;
import web.hub.audio.dao.repository.five9.Five9SegmentRepository;
import web.hub.audio.dto.Five9ResultDto;
import web.hub.audio.exception.SegmentNotFoundException;
import web.hub.audio.service.SegmentService;
import web.hub.audio.util.Converter;

@Service
@RequiredArgsConstructor
public class SegmentServiceImpl implements SegmentService {

    private final Five9SegmentRepository five9SegmentRepository;

    @Override
    public Five9ResultDto getById(Integer segmentId) {
        Five9Segment five9Segment = five9SegmentRepository.findById(segmentId)
                .orElseThrow(() -> new SegmentNotFoundException("Cannot find Five9 segment with ID: " + segmentId));
        return Converter.convertToFive9Dto(five9Segment.getCall(), five9Segment);
    }
}
