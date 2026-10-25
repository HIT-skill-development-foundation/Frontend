import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStudent: null,
  isLoggedIn: false,
  registeredStudents: [],
  downloadedIdCount: 0,
};

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    loginStudent: (state, action) => {
      state.isLoggedIn = true;
      state.currentStudent = action.payload || null;
    },
    logoutStudent: (state) => {
      state.isLoggedIn = false;
      state.currentStudent = null;
    },
    setStudentData: (state, action) => {
      state.currentStudent = action.payload;
    },
    setRegisteredStudents: (state, action) => {
      state.registeredStudents = action.payload || [];
    },
    updateStudentField: (state, action) => {
      const { field, value } = action.payload;
      if (state.currentStudent) {
        state.currentStudent[field] = value;
      }
    },
    registerNewStudent: (state, action) => {
      state.registeredStudents.unshift(action.payload);
      state.currentStudent = action.payload;
      state.isLoggedIn = true;
    },
    incrementIdDownload: (state) => {
      state.downloadedIdCount += 1;
    },
    resetStudentData: (state) => {
      state.currentStudent = null;
      state.isLoggedIn = false;
    },
  },
});

export const {
  loginStudent,
  logoutStudent,
  setStudentData,
  setRegisteredStudents,
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
