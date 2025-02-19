import { useContext, useEffect } from 'react';
import CacheContext from './cache-context';
import five9Service from '../services/five9.service';
import { Agent } from '../types';

function useAgent(id: string | null): [Agent | null, (value: Agent) => void] {
  const { agents, setAgents } = useContext(CacheContext);

  useEffect(() => {
    const fetchAgent = async () => {
      if (id && !agents[id]) {
        const result = await five9Service.getAgent(id);
        setAgents({ ...agents, [id]: result });
      }
    };

    fetchAgent();
  }, [agents]);

  const addAgent = (agent: Agent) => {
    setAgents({ ...agents, [agent.id]: agent });
  };

  return [id ? agents[id] : null, addAgent];
}

export default useAgent;
