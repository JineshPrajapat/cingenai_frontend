import axios from 'axios';
import { store } from './store';
import { clearCredentials, setTokens } from '../features/auth/authSlice';
import { tokenService } from '../features/auth/token.service';

const BASE_URL =  import.meta.env.VITE_API_BASE
const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});


client.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  const appToken = import.meta.env.VITE_APP_TOKEN;
  if (appToken) config.headers['app-token'] = appToken;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        const data = res.data.data;
        tokenService.setAccessToken(data);
        store.dispatch(setTokens(data));
        processQueue(null, data);
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(clearCredentials());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default client;