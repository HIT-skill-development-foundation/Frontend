import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import studentReducer from './slices/studentSlice';
import donationReducer from './slices/donationSlice';
import verificationReducer from './slices/verificationSlice';
import coursesReducer from './slices/coursesSlice';
import admissionReducer from './slices/admissionSlice';
import adminReducer from './slices/adminSlice';
import galleryReducer from './slices/gallerySlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    student: studentReducer,
    donation: donationReducer,
    verification: verificationReducer,
    courses: coursesReducer,
    admission: admissionReducer,
    admin: adminReducer,
    gallery: galleryReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
