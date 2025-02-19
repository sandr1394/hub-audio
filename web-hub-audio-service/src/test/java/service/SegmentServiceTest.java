package service;

import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import web.hub.audio.dao.entity.five9.Agent;
import web.hub.audio.dao.entity.five9.Campaign;
import web.hub.audio.dao.entity.five9.Five9Call;
import web.hub.audio.dao.entity.five9.Five9Segment;
import web.hub.audio.dao.repository.five9.Five9SegmentRepository;
import web.hub.audio.dto.Five9ResultDto;
import web.hub.audio.exception.SegmentNotFoundException;
import web.hub.audio.service.impl.SegmentServiceImpl;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SegmentServiceTest {

    @InjectMocks
    private SegmentServiceImpl segmentService;
    @Mock
    private Five9SegmentRepository five9SegmentRepository;

    @Test
    public void getByIdTest() {
        Integer segmentId = 1;

        Agent agent = new Agent();
        agent.setEmail("test@mail.com");
        agent.setFirstName("testFirstName");
        agent.setLastName("testLastName");

        Campaign campaign = new Campaign();
        campaign.setCampaignName("testCampaign");

        Five9Call call = new Five9Call();
        call.setCallId(123L);
        call.setAni(123L);
        call.setDnis(123L);
        call.setAgent(agent);
        call.setCampaign(campaign);

        Five9Segment segment = new Five9Segment();
        segment.setId(segmentId);
        segment.setCall(call);
        Optional<Five9Segment> segmentOptional = Optional.of(segment);
        when(five9SegmentRepository.findById(segmentId)).thenReturn(segmentOptional);
        Five9ResultDto result = segmentService.getById(segmentId);
        assertNotNull(result);
        assertEquals(segmentId, result.getId());
    }

    @Test
    public void cannotFindSegmentTest() {
        Integer segmentId = 1;
        SegmentNotFoundException ex = Assertions.assertThrows(SegmentNotFoundException.class, () -> segmentService.getById(segmentId));
        assertTrue(ex.getMessage().contains("Cannot find Five9 segment with ID: " + segmentId));
    }
}
