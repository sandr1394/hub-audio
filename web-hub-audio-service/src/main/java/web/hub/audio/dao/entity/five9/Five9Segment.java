package web.hub.audio.dao.entity.five9;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "Five9Segment", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
public class Five9Segment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", insertable = false, updatable = false)
    private Integer id;

    @Basic
    @Column(name = "SegmentId")
    private Long segmentId;

    @Basic
    @Column(name = "CallDuration")
    private Integer callDuration;

    @Basic
    @Column(name = "GcpFileKey")
    private String gcpFileKey;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "CallID", referencedColumnName = "CallID")
    private Five9Call call;

    @Basic
    @Column(name = "DateOfCall")
    private LocalDateTime dateOfCall;
}
