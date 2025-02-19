import React, { ComponentProps, useRef, useState } from 'react';
import CacheContext from './cache-context';
import { Agent, AudioCache, Campaign, ListElement, Source } from '../types';

function CacheContextProvider({ children }: ComponentProps<any>) {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [agents, setAgents] = useState<Record<string, Agent>>({});
  const [audio, setAudio] = useState<AudioCache>({
    src: null,
    playing: false,
    loading: false,
  });
  const cache = useRef(new Map());
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const currentAudio = useRef<ListElement<Source> | null>(null);

  return (
    <CacheContext.Provider
      value={{ campaigns, agents, setCampaigns, setAgents, audio, setAudio, cache, audioElement, currentAudio }}
    >
      {children}
    </CacheContext.Provider>
  );
}

export default CacheContextProvider;
