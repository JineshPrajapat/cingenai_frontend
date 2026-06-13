import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    themeMode: 'light',
    snackbar: {
      open: false,
      message: '',
      severity: 'info', // success | error | warning | info
    },
  },
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const { toggleTheme, showSnackbar, hideSnackbar } = uiSlice.actions;

export const selectThemeMode = (state) => state.ui.themeMode;
export const selectSnackbar = (state) => state.ui.snackbar;

export default uiSlice.reducer;