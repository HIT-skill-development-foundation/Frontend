import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  loadingMessage: 'Processing...',
  mobileMenuOpen: false,
  notification: null, 
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.isLoading = true;
      state.loadingMessage = action.payload || 'Processing request...';
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = '';
    },
    toggleMobileMenu: (state, action) => {
      state.mobileMenuOpen = action.payload !== undefined ? action.payload : !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    showNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  toggleMobileMenu,
  closeMobileMenu,
  showNotification,
  clearNotification,
} = uiSlice.actions;

export const selectUi = (state) => state.ui;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectLoadingMessage = (state) => state.ui.loadingMessage;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
export const selectNotification = (state) => state.ui.notification;

export default uiSlice.reducer;
