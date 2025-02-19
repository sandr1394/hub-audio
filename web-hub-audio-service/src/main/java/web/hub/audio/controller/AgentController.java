package web.hub.audio.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import web.hub.audio.dao.entity.five9.Agent;
import web.hub.audio.service.impl.AgentService;

import java.util.List;

@RestController
@RequestMapping("api/v1/agent")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping
    public List<Agent> getAgents(@RequestParam(value = "agentInfo") String[] agentInfo) {
        return agentService.getAgents(agentInfo);
    }

    @GetMapping("{id}")
    public Agent getAgent(@PathVariable Integer id) {
        return agentService.getAgent(id);
    }
}
