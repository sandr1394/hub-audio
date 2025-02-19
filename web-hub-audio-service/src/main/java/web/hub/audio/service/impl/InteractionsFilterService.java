package web.hub.audio.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import web.hub.audio.dao.entity.interactions.InteractionsCall;
import web.hub.audio.dao.repository.interactions.InteractionsCallRepository;
import web.hub.audio.dao.specification.SpecificationBuilder;
import web.hub.audio.dao.specification.filter.FilterAttribute;
import web.hub.audio.dao.specification.filter.SearchCriteria;
import web.hub.audio.dto.FilterResultDto;
import web.hub.audio.dto.InteractionsResultDto;
import web.hub.audio.dto.PageDto;
import web.hub.audio.service.AuditService;
import web.hub.audio.service.FilterService;

import java.util.List;
import java.util.stream.Collectors;

import static web.hub.audio.enums.AuditActionType.METADATA_LOOKUP;
import static web.hub.audio.enums.VendorType.INTERACTIONS;
import static web.hub.audio.util.Converter.convertToInteractionsDto;
import static web.hub.audio.util.Util.getFilterData;
import static web.hub.audio.util.Util.getPageable;

@Service
public class InteractionsFilterService implements FilterService {

    private static final Logger LOGGER = LoggerFactory.getLogger(InteractionsFilterService.class);

    private final InteractionsCallRepository interactionsCallRepository;
    private final SpecificationBuilder<InteractionsCall> interactionsSpecificationBuilder;
    private final AuditService auditService;

    public InteractionsFilterService(InteractionsCallRepository interactionsCallRepository,
                                     SpecificationBuilder<InteractionsCall> interactionsSpecificationBuilder,
                                     AuditService auditService) {
        this.interactionsCallRepository = interactionsCallRepository;
        this.interactionsSpecificationBuilder = interactionsSpecificationBuilder;
        this.auditService = auditService;
    }

    @Override
    public <R> FilterResultDto<R> getAudioMetadata(List<SearchCriteria> filters,
                                                   Integer page,
                                                   Integer size,
                                                   String sortField,
                                                   FilterAttribute sortDirection) {
        String filterData = getFilterData(filters);
        auditService.addAuditRecord(METADATA_LOOKUP, INTERACTIONS, filterData);
        LOGGER.info("Received request to lookup Interactions audio metadata by filter: {}", getFilterData(filters));

        Pageable pageable = getPageable(page, size, sortField, sortDirection);
        Specification<InteractionsCall> interactionsSpecification =
                interactionsSpecificationBuilder.getSpecificationFromFilter(filters);
        Page<InteractionsCall> result = interactionsCallRepository.findAll(interactionsSpecification, pageable);
        LOGGER.info("Retrieved Interactions audio metadata regarding lookup filter. Result set size: {}", result.getTotalElements());
        return getResponse(result);
    }

    @Override
    public <C, R> FilterResultDto<R> getResponse(Page<C> result) {
        List<InteractionsResultDto> content = result.getContent().stream()
                .map(item -> {
                    InteractionsCall interactionsCall = (InteractionsCall) item;
                    return convertToInteractionsDto(interactionsCall);
                })
                .collect(Collectors.toList());
        PageDto page = new PageDto(result.getSize(),
                result.getPageable().getPageNumber());
        return (FilterResultDto<R>) new FilterResultDto<>(content, page);
    }

}
