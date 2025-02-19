package web.hub.audio.dao.entity.five9;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "vFive9CallSegments", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
public class Five9CallSegmentsView {

    @Id
    @Column(name = "ID", insertable = false, updatable = false)
    private Integer id;

    @Basic
    @Column(name = "CallID")
    private Long callId;

    @Basic
    @Column(name = "SessionID")
    private String sessionId;

    @Basic
    @Column(name = "SegmentID")
    private String segmentId;

    @Basic
    @Column(name = "AgentID")
    private Integer agentId;

    @Basic
    @Column(name = "AgentEmail")
    private String agentEmail;

    @Basic
    @Column(name = "AgentFirstName")
    private String agentFirstName;

    @Basic
    @Column(name = "AgentLastName")
    private String agentLastName;

    @Basic
    @Column(name = "CampaignID")
    private Integer campaignId;

    @Basic
    @Column(name = "CampaignName")
    private String campaignName;

    @Basic
    @Column(name = "ANI")
    private Long ani;

    @Basic
    @Column(name = "DNIS")
    private Long dnis;

    @Basic
    @Column(name = "CallDuration")
    private Integer callDuration;

    @Basic
    @Column(name = "GcpFileKey")
    private String gcpFileKey;

    @Basic
    @Column(name = "IsMigrated")
    private Boolean isMigrated;

    @Basic
    @Column(name = "DateOfCall")
    private LocalDateTime dateOfCall;

}
