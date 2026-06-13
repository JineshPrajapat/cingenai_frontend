const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const ACCESS_EXPIRES = 'access_token_expires_at';
const REFRESH_EXPIRES = 'refresh_token_expires_at';

export const tokenService = {
  setTokens(data) {
    localStorage.setItem(ACCESS_TOKEN, data.access_token);
    localStorage.setItem(REFRESH_TOKEN, data.refresh_token);
    localStorage.setItem(ACCESS_EXPIRES, data.access_token_expires_at);
    localStorage.setItem(REFRESH_EXPIRES, data.refresh_token_expires_at);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  },

  setAccessToken(data){
    localStorage.setItem(ACCESS_TOKEN, data.access_token);
    localStorage.setItem(ACCESS_EXPIRES, data.access_token_expires_at);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  },

  isAccessTokenExpired() {
    const exp = localStorage.getItem(ACCESS_EXPIRES);
    if (!exp) return true;
    return new Date(exp).getTime() < Date.now();
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_EXPIRES);
    localStorage.removeItem(REFRESH_EXPIRES);
  },
};