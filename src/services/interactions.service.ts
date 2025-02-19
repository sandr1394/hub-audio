import axios from 'axios';
import { InteractionsElement, Pageable } from '../types';

const getAudioList = (
  filterParams: URLSearchParams,
  page: number,
  pageSize = 25,
): Promise<Pageable<InteractionsElement>> =>
  axios
    .get<Pageable<InteractionsElement>>(
      `/audio/api/v1/filter/interactions?${filterParams.toString()}&page=${page}&size=${pageSize}&sortField=dateOfCall&sortDirection=DESC`,
    )
    .then((response) => response.data);

const interactionsService = {
  getAudioList,
};

export default interactionsService;
