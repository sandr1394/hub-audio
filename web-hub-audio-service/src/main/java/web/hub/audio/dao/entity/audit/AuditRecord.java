package web.hub.audio.dao.entity.audit;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "AuditLog", schema = "dbo")
public class AuditRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", insertable = false, updatable = false)
    private Integer id;

    @Basic
    @Column(name = "AgentUser")
    private String user;

    @OneToOne
    @JoinColumn(name = "AuditActionID", referencedColumnName = "id")
    private AuditAction auditAction;

    @OneToOne
    @JoinColumn(name = "VendorID", referencedColumnName = "id")
    private Vendor vendor;

    @Basic
    @Column(name = "CallID")
    private String callId;

    @Basic
    @Column(name = "SegmentID")
    private String segmentId;

    @Basic
    @Column(name = "Details")
    private String details;

    @Basic
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

}
