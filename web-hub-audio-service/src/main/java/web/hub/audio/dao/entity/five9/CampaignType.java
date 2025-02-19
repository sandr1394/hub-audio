package web.hub.audio.dao.entity.five9;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "CampaignType", schema = "dbo")
@Data
@NoArgsConstructor
public class CampaignType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", insertable = false, updatable = false)
    private Integer id;

    @Basic
    @Column(name = "CampaignTypeName")
    private String campaignTypeName;
}
