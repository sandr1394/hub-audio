import { InteractionsFilterParams } from '../types';

const getInteractionsListUrl = (params: InteractionsFilterParams) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.set(key, value);
  });
  return `/audio/list/interactions?${queryParams.toString()}`;
};

export default getInteractionsListUrl;
