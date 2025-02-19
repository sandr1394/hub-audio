package web.hub.audio.service.impl;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.hub.audio.dao.entity.five9.Five9CallSegmentsView;
import web.hub.audio.dao.repository.five9.Five9CallSegmentsNoCountRepository;
import web.hub.audio.dao.specification.SpecificationBuilder;
import web.hub.audio.dao.specification.filter.FilterAttribute;
import web.hub.audio.dao.specification.filter.SearchCriteria;
import web.hub.audio.dto.FilterResultDto;
import web.hub.audio.dto.Five9ResultDto;
import web.hub.audio.dto.PageDto;
import web.hub.audio.service.AuditService;
import web.hub.audio.service.FilterService;

import java.util.List;
import java.util.stream.Collectors;

import static web.hub.audio.enums.AuditActionType.METADATA_LOOKUP;
import static web.hub.audio.enums.VendorType.FIVE9;
import static web.hub.audio.util.Converter.convertToFive9Dto;
import static web.hub.audio.util.Util.getFilterData;
import static web.hub.audio.util.Util.getPageable;

@Service
@RequiredArgsConstructor
public class Five9FilterService implements FilterService {

    private static final Logger LOGGER = LoggerFactory.getLogger(Five9FilterService.class);

    private final SpecificationBuilder<Five9CallSegmentsView> five9SpecificationBuilder;
    private final AuditService auditService;
    private final Five9CallSegmentsNoCountRepository five9CallSegmentsRepository;

    @Override
    @Transactional(readOnly = true)
    public <R> FilterResultDto<R> getAudioMetadata(List<SearchCriteria> filters,
                                                   Integer page,
                                                   Integer size,
                                                   String sortField,
                                                   FilterAttribute sortDirection) {
        String filterData = getFilterData(filters);
        //auditService.addAuditRecord(METADATA_LOOKUP, FIVE9, filterData);
        LOGGER.info("Received request to lookup Five9 audio metadata by filter: {}", filterData);

        Pageable pageable = getPageable(page, size, sortField, sortDirection);
        Specification<Five9CallSegmentsView> fiveSpecification =
                five9SpecificationBuilder.getSpecificationFromFilter(filters);
        Page<Five9CallSegmentsView> result = five9CallSegmentsRepository.findAll(fiveSpecification, pageable, Five9CallSegmentsView.class);
        LOGGER.info("Retrieved Five9 audio metadata regarding lookup filter. Result set size: {}", result.getContent().size());
        return getResponse(result);
    }

    @Override
    public <C, R> FilterResultDto<R> getResponse(Page<C> result) {
        List<Five9ResultDto> content = result.getContent().stream()
                .map(item -> {
                    Five9CallSegmentsView segment = (Five9CallSegmentsView) item;
                    return convertToFive9Dto(segment);
                })
                .collect(Collectors.toList());

        PageDto page = new PageDto(result.getSize(),
                result.getPageable().getPageNumber());
        return (FilterResultDto<R>) new FilterResultDto<>(content, page);
    }
}
