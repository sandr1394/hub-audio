package service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import web.hub.audio.dao.entity.interactions.InteractionsCall;
import web.hub.audio.dao.repository.interactions.InteractionsCallRepository;
import web.hub.audio.dao.specification.QueryOperator;
import web.hub.audio.dao.specification.SpecificationBuilder;
import web.hub.audio.dao.specification.filter.SearchCriteria;
import web.hub.audio.dto.FilterResultDto;
import web.hub.audio.dto.InteractionsResultDto;
import web.hub.audio.service.AuditService;
import web.hub.audio.service.impl.InteractionsFilterService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static web.hub.audio.dao.specification.filter.FilterAttribute.ANI;
import static web.hub.audio.dao.specification.filter.FilterAttribute.DESC;

@RunWith(PowerMockRunner.class)
public class InteractionsFilterTest {

    @InjectMocks
    InteractionsFilterService interactionsFilterService;
    @Mock
    InteractionsCallRepository interactionsCallRepository;
    @Mock
    SpecificationBuilder specificationBuilder;
    @Mock
    AuditService auditService;

    Pageable pageable;
    List<SearchCriteria> searchCriteria;

    @Before
    public void setup() {
        pageable = PageRequest.of(0, 1, Sort.by(ANI.getValue()).descending());

        SearchCriteria searchCriteria = new SearchCriteria();
        searchCriteria.setField(ANI.getValue());
        searchCriteria.setValue("1234567890");
        searchCriteria.setOperator(QueryOperator.LIKE);
        this.searchCriteria = new ArrayList<>();
        this.searchCriteria.add(searchCriteria);
    }

    @Test
    public void getInteractionsAudioMetadata_test() {
        InteractionsCall interactionsCall = new InteractionsCall();
        interactionsCall.setCallId(123L);
        interactionsCall.setCallId(123L);
        interactionsCall.setSegmentId("123");
        interactionsCall.setAni(123L);
        interactionsCall.setDnis(123L);
        interactionsCall.setIsMigrated(true);
        interactionsCall.setDateOfCall(LocalDateTime.now());
        Page<InteractionsCall> result = new PageImpl<>(Collections.singletonList(interactionsCall), pageable, 1);
        Specification<InteractionsCall> specification = (root, query, criteriaBuilder) -> null;
        when(specificationBuilder.getSpecificationFromFilter(searchCriteria)).thenReturn(specification);
        when(interactionsCallRepository.findAll(specification, pageable)).thenReturn(result);

        FilterResultDto<InteractionsResultDto> audioMetadata = interactionsFilterService.getAudioMetadata(searchCriteria,
                0,
                1,
                ANI.getValue(),
                DESC);
        assertEquals(audioMetadata.getContent().size(), 1);
    }
}
