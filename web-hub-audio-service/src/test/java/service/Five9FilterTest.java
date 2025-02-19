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
import web.hub.audio.dao.entity.five9.Five9CallSegmentsView;
import web.hub.audio.dao.repository.five9.Five9CallSegmentsNoCountRepository;
import web.hub.audio.dao.repository.five9.Five9SegmentRepository;
import web.hub.audio.dao.specification.QueryOperator;
import web.hub.audio.dao.specification.SpecificationBuilder;
import web.hub.audio.dao.specification.filter.SearchCriteria;
import web.hub.audio.dto.FilterResultDto;
import web.hub.audio.dto.Five9ResultDto;
import web.hub.audio.service.AuditService;
import web.hub.audio.service.impl.Five9FilterService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static web.hub.audio.dao.specification.filter.FilterAttribute.ANI;
import static web.hub.audio.dao.specification.filter.FilterAttribute.DESC;

@RunWith(PowerMockRunner.class)
public class Five9FilterTest {

    @InjectMocks
    Five9FilterService five9FilterService;
    @Mock
    Five9CallSegmentsNoCountRepository five9CallSegmentsRepository;
    @Mock
    Five9SegmentRepository five9SegmentRepository;
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
    public void getFive9AudioMetadata_test() {
        Five9CallSegmentsView segment = new Five9CallSegmentsView();
        segment.setCallId(123L);
        segment.setAni(123L);
        segment.setDnis(123L);
        segment.setGcpFileKey("gcpFileKey");
        segment.setIsMigrated(true);
        Page<Five9CallSegmentsView> result = new PageImpl<>(Collections.singletonList(segment), pageable, 1);

        Specification<Five9CallSegmentsView> specification = (root, query, criteriaBuilder) -> null;
        when(specificationBuilder.getSpecificationFromFilter(searchCriteria)).thenReturn(specification);
        when(five9CallSegmentsRepository.findAll(specification, pageable, Five9CallSegmentsView.class)).thenReturn(result);

        FilterResultDto<Five9ResultDto> audioMetadata = five9FilterService.getAudioMetadata(searchCriteria,
                0,
                1,
                ANI.getValue(),
                DESC);
        assertEquals(1, audioMetadata.getContent().size());
    }
}
