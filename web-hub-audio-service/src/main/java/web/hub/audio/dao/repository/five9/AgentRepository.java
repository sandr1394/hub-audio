package web.hub.audio.dao.repository.five9;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import web.hub.audio.dao.entity.five9.Agent;

import java.util.List;

public interface AgentRepository extends JpaRepository<Agent, Integer> {

    @Query(value = "SELECT a FROM Agent a WHERE a.firstName like %:agentInfo% " +
            "OR a.lastName like %:agentInfo% " +
            "OR a.email like %:agentInfo%")
    List<Agent> getAgentByAgentInfo(@Param("agentInfo") String agentInfo);
}
