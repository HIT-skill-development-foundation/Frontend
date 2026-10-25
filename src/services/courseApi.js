import apiClient from './apiClient';

const API_BASE = '/courses';

// --- Vocational Courses ---
export const getCourses = () => apiClient.get(API_BASE);
export const createCourse = (courseData) => apiClient.post(API_BASE, courseData);
export const updateCourse = (id, courseData) => apiClient.put(`${API_BASE}/${id}`, courseData);
export const deleteCourse = (id) => apiClient.delete(`${API_BASE}/${id}`);

// --- University Programs ---
export const getUniversityPrograms = () => apiClient.get(`${API_BASE}/university-programs`);
export const createUniversityProgram = (programData) =>
  apiClient.post(`${API_BASE}/university-programs`, programData);
export const updateUniversityProgram = (id, programData) =>
  apiClient.put(`${API_BASE}/university-programs/${id}`, programData);
export const deleteUniversityProgram = (id) =>
  apiClient.delete(`${API_BASE}/university-programs/${id}`);

// --- Inquiry ---
export const submitInquiry = (inquiryData) => apiClient.post(`${API_BASE}/inquiry`, inquiryData);

export default {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getUniversityPrograms,
  createUniversityProgram,
  updateUniversityProgram,
  deleteUniversityProgram,
  submitInquiry,
};
