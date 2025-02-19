package web.hub.audio.dao.repository.five9;

import org.springframework.data.jpa.repository.JpaRepository;
import web.hub.audio.dao.entity.five9.Campaign;

import java.util.Optional;

public interface CampaignRepository extends JpaRepository<Campaign, Integer> {

}
