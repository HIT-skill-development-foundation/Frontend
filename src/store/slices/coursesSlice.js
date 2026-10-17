import { createSlice } from '@reduxjs/toolkit';
import { coursesList, universityProgramsList, centresList } from '../../data/mockData';

const initialState = {
  courses: coursesList,
  universityPrograms: universityProgramsList,
  centres: centresList,
  selectedCourseId: 'adca',
  selectedCategory: 'all',
  searchKeyword: '',
};

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
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
      const index = state.courses.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], ...action.payload };
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
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
  state.courses.courses.find((c) => c.id === state.courses.selectedCourseId) || state.courses.courses[0];

export default coursesSlice.reducer;
