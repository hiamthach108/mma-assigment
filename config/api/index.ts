import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_URL } from '../constants/env';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Modify the request config here
    return config;
  },
  (error: AxiosError) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Modify the response data here
    return response && response.data;
  },
  (error: AxiosError) => {
    // Handle response error here
    return Promise.reject(error);
  }
);

export default api;
