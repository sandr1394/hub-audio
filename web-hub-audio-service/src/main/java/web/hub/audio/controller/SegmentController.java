package web.hub.audio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.hub.audio.dto.Five9ResultDto;
import web.hub.audio.service.SegmentService;

@RestController()
@RequestMapping("api/v1/segment")
@RequiredArgsConstructor
public class SegmentController {

    private final SegmentService segmentService;

    @GetMapping("{id}")
    public Five9ResultDto getSegment(@PathVariable Integer id) {
        return segmentService.getById(id);
    }
}
