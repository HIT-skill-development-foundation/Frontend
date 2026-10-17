import { createSlice } from '@reduxjs/toolkit';
import { initialStudentData } from '../../data/mockData';

const initialState = {
  searchQuery: 'HIT-STU-2026-00001',
  verificationResult: initialStudentData,
  hasSearched: true,
  searchHistory: ['HIT-STU-2026-00001'],
  isVerifying: false,
};

export const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setVerificationResult: (state, action) => {
      state.verificationResult = action.payload;
      state.hasSearched = true;
      if (action.payload && !state.searchHistory.includes(state.searchQuery)) {
        state.searchHistory.unshift(state.searchQuery);
      }
    },
    setIsVerifying: (state, action) => {
      state.isVerifying = action.payload;
    },
    resetVerification: (state) => {
      state.searchQuery = '';
      state.verificationResult = null;
      state.hasSearched = false;
      state.isVerifying = false;
    },
  },
});

export const {
  setSearchQuery,
  setVerificationResult,
  setIsVerifying,
  resetVerification,
} = verificationSlice.actions;

export const selectSearchQuery = (state) => state.verification.searchQuery;
export const selectVerificationResult = (state) => state.verification.verificationResult;
export const selectHasSearched = (state) => state.verification.hasSearched;
export const selectSearchHistory = (state) => state.verification.searchHistory;
export const selectIsVerifying = (state) => state.verification.isVerifying;

export default verificationSlice.reducer;
