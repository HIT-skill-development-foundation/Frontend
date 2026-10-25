import { createSlice } from '@reduxjs/toolkit';

const getStoredAdminUser = () => {
  try {
    const raw = localStorage.getItem('hit_admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const hasAdminToken = () => {
  try {
    return Boolean(localStorage.getItem('hit_admin_token'));
  } catch {
    return false;
  }
};

const initialState = {
  isAdminLoggedIn: hasAdminToken(),
  adminUser: getStoredAdminUser(),
  expenses: [],
  donations: [],
  pendingApprovals: [],
  stats: {
    totalStudents: 0,
    totalDonations: 0,
    totalExpenses: 0,
    pendingAdmissions: 0,
    activeCentres: 0,
    activeCourses: 0,
  },
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginAdmin: (state, action) => {
      state.isAdminLoggedIn = true;
      state.adminUser = action.payload || null;
    },
    logoutAdmin: (state) => {
      state.isAdminLoggedIn = false;
      state.adminUser = null;
      try {
        localStorage.removeItem('hit_admin_token');
        localStorage.removeItem('hit_admin_user');
      } catch {
        // ignore
      }
    },
    setAdminStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload || [];
    },
    setDonations: (state, action) => {
      state.donations = action.payload || [];
    },
    setPendingApprovals: (state, action) => {
      state.pendingApprovals = action.payload || [];
    },
    addExpense: (state, action) => {
      state.expenses.unshift(action.payload);
      state.stats.totalExpenses += Number(action.payload.amount) || 0;
    },
    deleteExpense: (state, action) => {
      const item = state.expenses.find((e) => (e.id || e._id) === action.payload);
      if (item) {
        state.stats.totalExpenses -= Number(item.amount) || 0;
      }
      state.expenses = state.expenses.filter((e) => (e.id || e._id) !== action.payload);
    },
    approveAdmissionOrCert: (state, action) => {
      const id = action.payload;
      state.pendingApprovals = state.pendingApprovals.map((item) =>
        item.id === id || item._id === id || item.regId === id
          ? { ...item, status: 'Approved', certificateIssued: true }
          : item
      );
    },
    rejectAdmissionOrCert: (state, action) => {
      const id = action.payload;
      state.pendingApprovals = state.pendingApprovals.map((item) =>
        item.id === id || item._id === id || item.regId === id
          ? { ...item, status: 'Revision Needed' }
          : item
      );
    },
  },
});

export const {
  loginAdmin,
  logoutAdmin,
  setAdminStats,
  setExpenses,
  setDonations,
  setPendingApprovals,
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
