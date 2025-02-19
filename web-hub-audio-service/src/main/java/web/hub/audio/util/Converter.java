package web.hub.audio.util;

import web.hub.audio.dao.entity.five9.Five9Call;
import web.hub.audio.dao.entity.five9.Five9CallSegmentsView;
import web.hub.audio.dao.entity.five9.Five9Segment;
import web.hub.audio.dao.entity.interactions.InteractionsCall;
import web.hub.audio.dto.Five9ResultDto;
import web.hub.audio.dto.InteractionsResultDto;

public class Converter {

    public static Five9ResultDto convertToFive9Dto(Five9Call call, Five9Segment segment){
        Five9ResultDto five9Result = new Five9ResultDto();
        five9Result.setId(segment.getId());
        five9Result.setCallId(call.getCallId().toString());
        five9Result.setSessionId(call.getSessionId());
        five9Result.setAni(call.getAni().toString());
        five9Result.setDnis(call.getDnis().toString());
        five9Result.setAgentFirstName(call.getAgent().getFirstName());
        five9Result.setAgentLastName(call.getAgent().getLastName());
        five9Result.setAgentEmail(call.getAgent().getEmail());
        five9Result.setCallDuration(segment.getCallDuration());
        five9Result.setCampaign(call.getCampaign().getCampaignName());
        five9Result.setDateOfCall(segment.getDateOfCall());
        return five9Result;
    }

    public static Five9ResultDto convertToFive9Dto(Five9CallSegmentsView segment) {
        Five9ResultDto five9Result = new Five9ResultDto();
        five9Result.setId(segment.getId());
        five9Result.setCallId(segment.getCallId().toString());
        five9Result.setSessionId(segment.getSessionId());
        five9Result.setAni(segment.getAni().toString());
        five9Result.setDnis(segment.getDnis().toString());
        five9Result.setAgentFirstName(segment.getAgentFirstName());
        five9Result.setAgentLastName(segment.getAgentLastName());
        five9Result.setAgentEmail(segment.getAgentEmail());
        five9Result.setCallDuration(segment.getCallDuration());
        five9Result.setCampaign(segment.getCampaignName());
        five9Result.setDateOfCall(segment.getDateOfCall());
        return five9Result;
    }

    public static InteractionsResultDto convertToInteractionsDto(InteractionsCall interactionsCall){
        InteractionsResultDto interactionsResult = new InteractionsResultDto();
        interactionsResult.setId(interactionsCall.getId());
        interactionsResult.setCallId(interactionsCall.getCallId().toString());
        interactionsResult.setSegmentId(interactionsCall.getSegmentId());
        interactionsResult.setAni(interactionsCall.getAni().toString());
        interactionsResult.setDnis(interactionsCall.getDnis().toString());
        interactionsResult.setCallDuration(interactionsCall.getCallDuration());
        interactionsResult.setDateOfCall(interactionsCall.getDateOfCall());
        return interactionsResult;
    }
}
