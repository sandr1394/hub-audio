import axios from 'axios';

export const HUB_JWT_KEY = 'hub-jwt';

const NetworkService = {
  setupInterceptors: () => {
    axios.interceptors.request.use(
      (request) => {
        const jwt = localStorage.getItem(HUB_JWT_KEY);
        if (jwt) {
          // eslint-disable-next-line
          request.headers.Authorization = `Bearer ${jwt}`;
          return request;
        }
        return request;
      },
      (error) => {
        throw new Error(`Interceptor failed ${error}`);
      },
    );

    axios.interceptors.response.use(
      (response) => {
        if (response.headers[HUB_JWT_KEY]) {
          localStorage.setItem(HUB_JWT_KEY, response.headers[HUB_JWT_KEY]);
        }
        return response;
      },
      (error) => {
        if (error.response.headers[HUB_JWT_KEY]) {
          localStorage.setItem(HUB_JWT_KEY, error.response.headers[HUB_JWT_KEY]);
        }

        if (error.response.status === 401) {
          localStorage.removeItem(HUB_JWT_KEY);
          const { pathname, search } = window.location;
          const redirect = pathname ? `?redirect=${encodeURIComponent(`${pathname}${search}`)}` : '';
          window.location.href = `/${redirect}`;
        } else if (error.response.status !== 404) {
          window.location.href = `/audio/server-error`;
        }
        return Promise.reject(error);
      },
    );
  },
};

export default NetworkService;
