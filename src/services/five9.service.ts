import axios from 'axios';
import { Agent, Campaign, Five9Element, Pageable } from '../types';

const getCampaigns = (): Promise<Campaign[]> => {
  return axios.get<Campaign[]>(`/audio/api/v1/campaign/all`).then((response) => response.data);
};

const getAgent = (id: string): Promise<Agent> => {
  return axios.get<Agent>(`/audio/api/v1/agent/${id}`).then((response) => response.data);
};

const searchAgents = (agentInfo: string[]): Promise<Agent[]> => {
  const filterParams = new URLSearchParams();
  agentInfo.forEach((info) => filterParams.append('agentInfo', info));
  return axios.get<Agent[]>(`/audio/api/v1/agent/?${filterParams.toString()}`).then((response) => response.data);
};

const getAudioList = (filterParams: URLSearchParams, page: number, pageSize = 25): Promise<Pageable<Five9Element>> => {
  if (filterParams.has('id')) {
    return axios
      .get<Five9Element>(`/audio/api/v1/segment/${filterParams.get('id')}`)
      .then((response) => response.data)
      .then((data) => ({
        content: [data],
        page: {
          page: 0,
          size: pageSize,
          total: 1,
        },
      }))
      .catch(() => ({
        content: [],
        page: {
          page: 0,
          size: pageSize,
          total: 0,
        },
      }));
  }
  return axios
    .get<Pageable<Five9Element>>(
      `/audio/api/v1/filter/five9?${filterParams.toString()}&page=${page}&size=${pageSize}&sortField=dateOfCall&sortDirection=DESC`,
    )
    .then((response) => response.data);
};

const five9Service = {
  getCampaigns,
  getAudioList,
  searchAgents,
  getAgent,
};

export default five9Service;
