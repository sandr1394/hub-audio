import { Five9FilterParams } from '../types';

const getFive9ListUrl = (params: Five9FilterParams) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.set(key, value);
  });
  return `/audio/list/five9?${queryParams.toString()}`;
};

export default getFive9ListUrl;
