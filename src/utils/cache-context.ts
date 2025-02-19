import { createContext } from 'react';
import { Cache } from '../types';

const CacheContext = createContext<Cache>({
  campaigns: null,
  agents: {},
  audio: { src: null, playing: false, loading: false },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCampaigns: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAgents: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAudio: () => {},
  cache: { current: new Map() },
  audioElement: { current: null },
  currentAudio: { current: null },
});

export default CacheContext;
