package web.hub.audio.dao.entity.five9;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Five9Call", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
public class Five9Call implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", insertable = false, updatable = false)
    private Integer id;

    @Basic
    @Column(name = "CallID")
    private Long callId;

    @Basic
    @Column(name = "SessionID")
    private String sessionId;

    @Basic
    @Column(name = "ANI")
    private Long ani;

    @Basic
    @Column(name = "DNIS")
    private Long dnis;

    @Basic
    @Column(name = "Abandoned")
    private Boolean abandoned;

    @Basic
    @Column(name = "Calls")
    private Boolean calls;

    @Basic
    @Column(name = "CustomerName")
    private String customerName;

    @Basic
    @Column(name = "DisconnectedFromHold")
    private Boolean disconnectedFromHold;

    @Basic
    @Column(name = "Recordings")
    private String recordings;

    @Basic
    @Column(name = "SpeedOfAnswerSecs")
    private Long speedOfAnswerSecs;

    @Basic
    @Column(name = "CallTimeSecs")
    private Long callTimeSecs;

    @Basic
    @Column(name = "HandleTimeSecs")
    private Long handleTimeSecs;

    @Basic
    @Column(name = "HoldTimeSecs")
    private Long holdTimeSecs;

    @Basic
    @Column(name = "IVRTimeSecs")
    private Long ivrTimeSecs;

    @Basic
    @Column(name = "QueueWaitTimeSecs")
    private Long queueWaitTimeSecs;

    @Basic
    @Column(name = "parkTimeSecs")
    private Long parkTimeSecs;

    @Basic
    @Column(name = "Holds")
    private Integer holds;

    @Basic
    @Column(name = "Transfers")
    private Integer transfers;

    @Basic
    @Column(name = "Extension")
    private Integer extension;

    @Basic
    @Column(name = "FraudFlag")
    private Boolean fraudFlag;

    @Basic
    @Column(name = "IsMigrated")
    private Boolean isMigrated;

    @ManyToOne
    @JoinColumn(name = "CampaignID", referencedColumnName = "id")
    private Campaign campaign;

    @ManyToOne
    @JoinColumn(name = "DispositionID", referencedColumnName = "id")
    private Disposition disposition;

    @ManyToOne
    @JoinColumn(name = "AgentID", referencedColumnName = "id")
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "CallTypeID", referencedColumnName = "id")
    private CallType callType;

    @ManyToOne
    @JoinColumn(name = "SkillID", referencedColumnName = "id")
    private Skill skill;

    @JsonManagedReference
    @OneToMany(mappedBy = "call",
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL)
    private List<Five9Segment> segments;

    @Basic
    @Column(name = "DateOfCall")
    private LocalDateTime dateOfCall;

    @Basic
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;
}
