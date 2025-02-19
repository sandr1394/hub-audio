package web.hub.audio.service;

import web.hub.audio.dto.Five9ResultDto;

public interface SegmentService {

    Five9ResultDto getById(Integer segmentId);
}
