package web.hub.audio.dao.entity.interactions;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "InteractionsCall", schema = "dbo")
@Data
@NoArgsConstructor
public class InteractionsCall implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", insertable = false, updatable = false)
    private Integer id;

    @Basic
    @Column(name = "CallId")
    private Long callId;

    @Basic
    @Column(name = "SegmentId")
    private String segmentId;

    @Basic
    @Column(name = "ANI")
    private Long ani;

    @Basic
    @Column(name = "DNIS")
    private Long dnis;

    @Basic
    @Column(name = "GcpFileKey")
    private String gcpFileKey;

    @Basic
    @Column(name = "IsMigrated")
    private Boolean isMigrated;

    @Basic
    @Column(name = "CallDuration")
    private Integer callDuration;

    @Basic
    @Column(name = "DateOfCall")
    private LocalDateTime dateOfCall;

    @Basic
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;
}
