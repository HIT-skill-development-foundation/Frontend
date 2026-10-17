import { createSlice } from '@reduxjs/toolkit';
import { mockDonationRecord } from '../../data/mockData';

const initialState = {
  currentDonation: mockDonationRecord,
  donationHistory: [mockDonationRecord],
  selectedPresetAmount: 1100,
  taxExemptionEnabled: true,
};

export const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    setDonationData: (state, action) => {
      state.currentDonation = { ...state.currentDonation, ...action.payload };
      state.donationHistory.unshift(state.currentDonation);
    },
    setSelectedPresetAmount: (state, action) => {
      state.selectedPresetAmount = action.payload;
    },
    toggleTaxExemption: (state, action) => {
      state.taxExemptionEnabled = action.payload !== undefined ? action.payload : !state.taxExemptionEnabled;
    },
    resetDonationData: (state) => {
      state.currentDonation = mockDonationRecord;
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
