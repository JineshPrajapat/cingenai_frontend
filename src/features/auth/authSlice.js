import { createSlice } from '@reduxjs/toolkit';
import { tokenService } from './token.service';

const initialState = {
  user: null,
  isAuthenticated: !!tokenService.getAccessToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      tokenService.setTokens(action.payload)
    },
    setTokens: (state, action) => {
      persistTokens(action.payload);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      tokenService.clear()
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
     logout(state) {
      state.user = null;
      state.error = null;
      state.isAuthenticated = false;
      tokenService.clear();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, setTokens, clearCredentials, setUser, logout, setLoading, setError } =
  authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;