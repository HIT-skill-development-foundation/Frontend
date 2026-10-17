import { createSlice } from '@reduxjs/toolkit';
import { initialStudentData, registeredStudentsList } from '../../data/mockData';

const initialState = {
  currentStudent: initialStudentData,
  isLoggedIn: false, // Default unauthenticated so student sees Login / Sign Up gate
  registeredStudents: registeredStudentsList,
  downloadedIdCount: 0,
};

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    loginStudent: (state, action) => {
      state.isLoggedIn = true;
      if (action.payload) {
        state.currentStudent = { ...state.currentStudent, ...action.payload };
      }
    },
    logoutStudent: (state) => {
      state.isLoggedIn = false;
    },
    setStudentData: (state, action) => {
      state.currentStudent = { ...state.currentStudent, ...action.payload };
    },
    updateStudentField: (state, action) => {
      const { field, value } = action.payload;
      state.currentStudent[field] = value;
    },
    registerNewStudent: (state, action) => {
      state.registeredStudents.unshift(action.payload);
      state.currentStudent = { ...state.currentStudent, ...action.payload };
      state.isLoggedIn = true;
    },
    incrementIdDownload: (state) => {
      state.downloadedIdCount += 1;
    },
    resetStudentData: (state) => {
      state.currentStudent = initialStudentData;
      state.isLoggedIn = false;
    },
  },
});

export const {
  loginStudent,
  logoutStudent,
  setStudentData,
  updateStudentField,
  registerNewStudent,
  incrementIdDownload,
  resetStudentData,
} = studentSlice.actions;

export const selectCurrentStudent = (state) => state.student.currentStudent;
export const selectIsStudentLoggedIn = (state) => state.student.isLoggedIn;
export const selectRegisteredStudents = (state) => state.student.registeredStudents;
export const selectDownloadedIdCount = (state) => state.student.downloadedIdCount;

export default studentSlice.reducer;
