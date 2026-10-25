import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  universityPrograms: [],
  centres: [],
  selectedCourseId: '',
  selectedCategory: 'all',
  searchKeyword: '',
};

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload || [];
      if (!state.selectedCourseId && state.courses.length > 0) {
        state.selectedCourseId = state.courses[0].id || state.courses[0]._id || state.courses[0].code;
      }
    },
    setUniversityPrograms: (state, action) => {
      state.universityPrograms = action.payload || [];
    },
    setCentres: (state, action) => {
      state.centres = action.payload || [];
    },
    setSelectedCourseId: (state, action) => {
      state.selectedCourseId = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    addCourse: (state, action) => {
      state.courses.unshift(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex((c) => (c.id || c._id || c.code) === (action.payload.id || action.payload._id || action.payload.code));
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], ...action.payload };
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter((c) => (c.id || c._id || c.code) !== action.payload);
    },
  },
});

export const {
  setCourses,
  setUniversityPrograms,
  setCentres,
  setSelectedCourseId,
  setSelectedCategory,
  setSearchKeyword,
  addCourse,
  updateCourse,
  deleteCourse,
} = coursesSlice.actions;

export const selectCourses = (state) => state.courses.courses;
export const selectUniversityPrograms = (state) => state.courses.universityPrograms || [];
export const selectCentres = (state) => state.courses.centres;
export const selectSelectedCourseId = (state) => state.courses.selectedCourseId;
export const selectSelectedCourse = (state) =>
  state.courses.courses.find((c) => (c.id || c._id || c.code) === state.courses.selectedCourseId) || state.courses.courses[0] || null;

export default coursesSlice.reducer;
