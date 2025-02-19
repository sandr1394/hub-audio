package web.hub.audio.service.impl;

import org.springframework.stereotype.Service;
import web.hub.audio.dao.entity.five9.Campaign;
import web.hub.audio.dao.repository.five9.CampaignRepository;

import java.util.List;
import java.util.stream.Collectors;

import static web.hub.audio.util.Constants.NONE;
import static web.hub.audio.util.Constants.UNKNOWN;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    public List<Campaign> getCampaigns() {
        return campaignRepository.findAll().stream()
                .filter(item -> !UNKNOWN.equals(item.getCampaignName()) && !NONE.equals(item.getCampaignName()))
                .collect(Collectors.toList());
    }
}
