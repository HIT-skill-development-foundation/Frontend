import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentDonation: null,
  donationHistory: [],
  selectedPresetAmount: 5000,
  taxExemptionEnabled: true,
};

export const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    setDonationData: (state, action) => {
      state.currentDonation = action.payload;
      if (action.payload) {
        state.donationHistory.unshift(action.payload);
      }
    },
    setSelectedPresetAmount: (state, action) => {
      state.selectedPresetAmount = action.payload;
    },
    toggleTaxExemption: (state, action) => {
      state.taxExemptionEnabled = action.payload !== undefined ? action.payload : !state.taxExemptionEnabled;
    },
    resetDonationData: (state) => {
      state.currentDonation = null;
    },
  },
});

export const {
  setDonationData,
  setSelectedPresetAmount,
  toggleTaxExemption,
  resetDonationData,
} = donationSlice.actions;

export const selectCurrentDonation = (state) => state.donation.currentDonation;
export const selectDonationHistory = (state) => state.donation.donationHistory;
export const selectSelectedPresetAmount = (state) => state.donation.selectedPresetAmount;
export const selectTaxExemptionEnabled = (state) => state.donation.taxExemptionEnabled;

export default donationSlice.reducer;
