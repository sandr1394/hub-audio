package web.hub.audio.dao.entity.five9;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "Agent", schema = "dbo")
@Data
@NoArgsConstructor
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", insertable = false, updatable = false)
    private Integer id;

    @Basic
    @Column(name = "Email")
    private String email;

    @Basic
    @Column(name = "FirstName")
    private String firstName;

    @Basic
    @Column(name = "LastName")
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "AgentGroupID", referencedColumnName = "id")
    private AgentGroup agentGroup;
}
