package web.hub.audio.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import web.hub.audio.dao.entity.five9.Agent;
import web.hub.audio.dao.repository.five9.AgentRepository;
import web.hub.audio.exception.AgentNotFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import static web.hub.audio.util.Constants.UNKNOWN;

@Service
public class AgentService {

    private final AgentRepository agentRepository;

    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public List<Agent> getAgents(String[] agentInfo) {
        AtomicReference<List<Agent>> agents = new AtomicReference<>(agentRepository.getAgentByAgentInfo(agentInfo[0]));
        Arrays.stream(agentInfo)
                .forEach(item -> agents.set(agents.get().stream()
                        .filter(agent -> StringUtils.containsIgnoreCase(agent.getFirstName(), item) ||
                                StringUtils.containsIgnoreCase(agent.getLastName(), item) ||
                                StringUtils.containsIgnoreCase(agent.getEmail(), item))
                        .filter(agent -> !UNKNOWN.equalsIgnoreCase(agent.getEmail()) ||
                                !UNKNOWN.equalsIgnoreCase(agent.getFirstName()))
                        .collect(Collectors.toList())));
        return agents.get();
    }

    public Agent getAgent(Integer id) {
        return agentRepository.findById(id).orElseThrow(() ->
        {
            throw new AgentNotFoundException("Cannot find agent with id: " + id);
        });
    }
}
