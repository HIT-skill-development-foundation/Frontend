import { createSlice } from '@reduxjs/toolkit';
import { mockExpensesList, mockAdmissionsTable, mockDonationsList } from '../../data/mockData';

const initialState = {
  isAdminLoggedIn: false,
  adminUser: null,
  expenses: mockExpensesList,
  donations: mockDonationsList,
  pendingApprovals: mockAdmissionsTable,
  stats: {
    totalStudents: 89,
    totalDonations: 43500,
    totalExpenses: 198350,
  },
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginAdmin: (state, action) => {
      state.isAdminLoggedIn = true;
      state.adminUser = action.payload || {
        name: 'Super Admin / Director Desk',
        email: 'admin@hitindia.org',
        role: 'Central Trustee & Registrar',
      };
    },
    logoutAdmin: (state) => {
      state.isAdminLoggedIn = false;
      state.adminUser = null;
    },
    addExpense: (state, action) => {
      state.expenses.unshift(action.payload);
      state.stats.totalExpenses += Number(action.payload.amount) || 0;
    },
    deleteExpense: (state, action) => {
      const item = state.expenses.find((e) => e.id === action.payload);
      if (item) {
        state.stats.totalExpenses -= Number(item.amount) || 0;
      }
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
    approveAdmissionOrCert: (state, action) => {
      const id = action.payload;
      state.pendingApprovals = state.pendingApprovals.map((item) =>
        item.id === id ? { ...item, status: 'Approved', certificateIssued: true } : item
      );
    },
    rejectAdmissionOrCert: (state, action) => {
      const id = action.payload;
      state.pendingApprovals = state.pendingApprovals.map((item) =>
        item.id === id ? { ...item, status: 'Revision Needed' } : item
      );
    },
  },
});

export const {
  loginAdmin,
  logoutAdmin,
  addExpense,
  deleteExpense,
  approveAdmissionOrCert,
  rejectAdmissionOrCert,
} = adminSlice.actions;

export const selectIsAdminLoggedIn = (state) => state.admin.isAdminLoggedIn;
export const selectAdminUser = (state) => state.admin.adminUser;
export const selectExpenses = (state) => state.admin.expenses;
export const selectAdminDonations = (state) => state.admin.donations;
export const selectPendingApprovals = (state) => state.admin.pendingApprovals;
export const selectAdminStats = (state) => state.admin.stats;

export default adminSlice.reducer;
