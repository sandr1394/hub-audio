import { Dispatch, SetStateAction } from 'react';
import { InteractionsElement, InteractionsFilterParams } from './interactions';
import { Agent, Campaign, Five9Element, Five9FilterParams } from './five9';

export * from './interactions';
export * from './five9';

export interface Pageable<T> {
  content: T[];
  page: {
    page: number;
    size: number;
  };
}

export enum Source {
  FIVE9 = 'five9',
  INTERACTIONS = 'interactions',
}

export type ListElement<T extends Source> = T extends Source.INTERACTIONS
  ? InteractionsElement & Partial<Five9Element>
  : Five9Element & Partial<InteractionsElement>;

export type FilterParams = InteractionsFilterParams & Five9FilterParams;

export interface AudioCache {
  src: string | null;
  playing: boolean;
  loading: boolean;
}

export interface Cache {
  campaigns: Campaign[] | null;
  agents: Record<string, Agent>;
  audio: AudioCache;
  setCampaigns: Dispatch<SetStateAction<Campaign[] | null>>;
  setAgents: Dispatch<SetStateAction<Record<string, Agent>>>;
  setAudio: Dispatch<SetStateAction<AudioCache>>;
  cache: React.MutableRefObject<Map<any, any>>;
  audioElement: React.MutableRefObject<HTMLAudioElement | null>;
  currentAudio: React.MutableRefObject<ListElement<Source> | null>;
}

export type JwtToken = {
  roles: { name: string }[];
};
