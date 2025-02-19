package web.hub.audio.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.hub.audio.dao.entity.five9.Campaign;
import web.hub.audio.service.impl.CampaignService;

import java.util.List;

@RestController
@RequestMapping("api/v1/campaign/")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping("all")
    public List<Campaign> getCampaigns() {
        return campaignService.getCampaigns();
    }
}
