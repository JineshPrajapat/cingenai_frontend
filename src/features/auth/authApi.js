import client from '../../app/client';

export const loginApi = (payload) => client.post('/auth/login', payload);
export const registerApi = (payload) => client.post('/auth/register', payload);
export const refreshTokenApi = (refresh_token) =>
  client.post('/auth/refresh', { refresh_token });