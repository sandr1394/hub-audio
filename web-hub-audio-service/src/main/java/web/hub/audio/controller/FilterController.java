package web.hub.audio.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import web.hub.audio.dao.specification.filter.Filter;
import web.hub.audio.dao.specification.filter.FilterAttribute;
import web.hub.audio.dao.specification.filter.SearchCriteria;
import web.hub.audio.dto.FilterResultDto;
import web.hub.audio.dto.Five9ResultDto;
import web.hub.audio.dto.InteractionsResultDto;
import web.hub.audio.service.impl.Five9FilterService;
import web.hub.audio.service.impl.InteractionsFilterService;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("api/v1/filter/")
public class FilterController {

    private final Five9FilterService five9FilterService;
    private final InteractionsFilterService interactionsFilterService;

    public FilterController(Five9FilterService five9FilterService,
                            InteractionsFilterService interactionsFilterService) {
        this.five9FilterService = five9FilterService;
        this.interactionsFilterService = interactionsFilterService;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_AUDIO_USER', 'ROLE_AUDIO_DOWNLOAD_USER')")
    @GetMapping("interactions")
    public FilterResultDto<InteractionsResultDto> getInteractionsAudioMetadata(
            @RequestParam(value = "callId", required = false) String callId,
            @RequestParam(value = "segmentId", required = false) String segmentId,
            @RequestParam(value = "ani", required = false) String ani,
            @RequestParam(value = "dnis", required = false) String dnis,
            @RequestParam(value = "dateFrom", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(value = "dateTo", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(value = "page") Integer page,
            @RequestParam(value = "size") Integer size,
            @RequestParam(value = "sortField") String sortField,
            @RequestParam(value = "sortDirection") FilterAttribute sortDirection) {
        List<SearchCriteria> filters = new Filter.FilterBuilder()
                .withCallId(callId)
                .withSegmentId(segmentId)
                .withAni(ani)
                .withDnis(dnis)
                .withDateFrom(dateFrom)
                .withDateTo(dateTo)
                .withIsMigratedIsTrue()
                .withGcpFileKeyIsNotNull()
                .build()
                .getFilters();

        return interactionsFilterService.getAudioMetadata(filters,
                page,
                size,
                sortField,
                sortDirection);
    }

    //@PreAuthorize("hasAnyAuthority('ROLE_AUDIO_USER', 'ROLE_AUDIO_DOWNLOAD_USER')")
    @GetMapping("five9")
    public FilterResultDto<Five9ResultDto> getFive9AudioMetadata(
            @RequestParam(value = "callId", required = false) String callId,
            @RequestParam(value = "sessionId", required = false) String sessionId,
            @RequestParam(value = "ani", required = false) String ani,
            @RequestParam(value = "dnis", required = false) String dnis,
            @RequestParam(value = "agentId", required = false) Integer agentId,
            @RequestParam(value = "campaignId", required = false) Integer campaignId,
            @RequestParam(value = "dateFrom", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(value = "dateTo", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(value = "page") Integer page,
            @RequestParam(value = "size") Integer size,
            @RequestParam(value = "sortField") String sortField,
            @RequestParam(value = "sortDirection") FilterAttribute sortDirection
    ) {
        List<SearchCriteria> filters = new Filter.FilterBuilder()
                .withCallId(callId)
                .withSessionId(sessionId)
                .withAni(ani)
                .withDnis(dnis)
                .withAgentId(agentId)
                .withCampaignId(campaignId)
                .withDateFrom(dateFrom)
                .withDateTo(dateTo)
                .withIsMigratedIsTrue()
                .withGcpFileKeyIsNotNull()
                .build()
                .getFilters();

        return five9FilterService.getAudioMetadata(filters,
                page,
                size,
                sortField,
                sortDirection);
    }
}
