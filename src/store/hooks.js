import { useDispatch, useSelector } from 'react-redux';
import {
  startLoading,
  stopLoading,
  showNotification,
  clearNotification,
  selectIsLoading,
  selectLoadingMessage,
  selectNotification,
} from './slices/uiSlice';
import {
  loginStudent,
  logoutStudent,
  setStudentData,
  updateStudentField,
  registerNewStudent,
  incrementIdDownload,
  selectCurrentStudent,
  selectIsStudentLoggedIn,
  selectRegisteredStudents,
} from './slices/studentSlice';
import {
  setDonationData,
  setSelectedPresetAmount,
  selectCurrentDonation,
  selectSelectedPresetAmount,
} from './slices/donationSlice';
import {
  setSearchQuery,
  setVerificationResult,
  setIsVerifying,
  selectSearchQuery,
  selectVerificationResult,
  selectHasSearched,
  selectIsVerifying,
} from './slices/verificationSlice';
import {
  selectCourses,
  selectUniversityPrograms,
  setCourses,
  setUniversityPrograms,
  addCourse,
  updateCourse,
  deleteCourse,
  addUniversityProgram,
  updateUniversityProgram,
  deleteUniversityProgram,
} from './slices/coursesSlice';
import {
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
  selectIsAdminLoggedIn,
  selectAdminUser,
  selectExpenses,
  selectAdminDonations,
  selectPendingApprovals,
  selectAdminStats,
} from './slices/adminSlice';
import {
  selectGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
  setGalleryCategory,
} from './slices/gallerySlice';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export function useLoader() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const loadingMessage = useAppSelector(selectLoadingMessage);
  const notification = useAppSelector(selectNotification);

  const showLoader = (message = 'Processing...') => dispatch(startLoading(message));
  const hideLoader = () => dispatch(stopLoading());

  const notify = (type, message) => {
    dispatch(showNotification({ type, message }));
    setTimeout(() => dispatch(clearNotification()), 4000);
  };

    const withLoader = async (asyncFn, message = 'Processing...') => {
    try {
      showLoader(message);
      const result = await asyncFn();
      return result;
    } finally {
      hideLoader();
    }
  };

  return {
    isLoading,
    loadingMessage,
    notification,
    showLoader,
    hideLoader,
    notify,
    withLoader,
  };
}

export function useStudent() {
  const dispatch = useAppDispatch();
  const currentStudent = useAppSelector(selectCurrentStudent);
  const isLoggedIn = useAppSelector(selectIsStudentLoggedIn);
  const registeredStudents = useAppSelector(selectRegisteredStudents);

  const updateStudent = (data) => dispatch(setStudentData(data));
  const updateField = (field, value) => dispatch(updateStudentField({ field, value }));
  const logDownload = () => dispatch(incrementIdDownload());
  const logIn = (userData) => dispatch(loginStudent(userData));
  const logOut = () => dispatch(logoutStudent());
  const enrollNewStudent = (studentData) => dispatch(registerNewStudent(studentData));

  return {
    student: currentStudent,
    isLoggedIn,
    registeredStudents,
    updateStudent,
    updateField,
    logDownload,
    logIn,
    logOut,
    enrollNewStudent,
  };
}

export function useDonation() {
  const dispatch = useAppDispatch();
  const currentDonation = useAppSelector(selectCurrentDonation);
  const selectedPresetAmount = useAppSelector(selectSelectedPresetAmount);

  const recordDonation = (data) => dispatch(setDonationData(data));
  const setPreset = (amount) => dispatch(setSelectedPresetAmount(amount));

  return {
    donation: currentDonation,
    selectedPresetAmount,
    recordDonation,
    setPreset,
  };
}

export function useVerification() {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectSearchQuery);
  const result = useAppSelector(selectVerificationResult);
  const hasSearched = useAppSelector(selectHasSearched);
  const isVerifying = useAppSelector(selectIsVerifying);

  const setQuery = (q) => dispatch(setSearchQuery(q));
  const setResult = (res) => dispatch(setVerificationResult(res));
  const setVerifyingState = (val) => dispatch(setIsVerifying(val));

  return {
    query,
    result,
    hasSearched,
    isVerifying,
    setQuery,
    setResult,
    setVerifyingState,
  };
}

export function useAdmin() {
  const dispatch = useAppDispatch();
  const isAdminLoggedIn = useAppSelector(selectIsAdminLoggedIn);
  const adminUser = useAppSelector(selectAdminUser);
  const expenses = useAppSelector(selectExpenses);
  const adminDonations = useAppSelector(selectAdminDonations);
  const pendingApprovals = useAppSelector(selectPendingApprovals);
  const adminStats = useAppSelector(selectAdminStats);
  const courses = useAppSelector(selectCourses);
  const universityPrograms = useAppSelector(selectUniversityPrograms);
  const galleryItems = useAppSelector(selectGalleryItems);

  const adminLogin = (user) => dispatch(loginAdmin(user));
  const adminLogout = () => dispatch(logoutAdmin());
  const syncStats = (stats) => dispatch(setAdminStats(stats));
  const syncExpenses = (list) => dispatch(setExpenses(list));
  const syncDonations = (list) => dispatch(setDonations(list));
  const syncPendingApprovals = (list) => dispatch(setPendingApprovals(list));
  const syncCourses = (list) => dispatch(setCourses(list));
  const syncUniversityPrograms = (list) => dispatch(setUniversityPrograms(list));
  const recordExpense = (exp) => dispatch(addExpense(exp));
  const removeExpense = (id) => dispatch(deleteExpense(id));
  const approveCert = (id) => dispatch(approveAdmissionOrCert(id));
  const rejectCert = (id) => dispatch(rejectAdmissionOrCert(id));
  const addNewCourse = (course) => dispatch(addCourse(course));
  const editCourse = (course) => dispatch(updateCourse(course));
  const removeCourse = (id) => dispatch(deleteCourse(id));
  const addNewUniversityProgram = (prog) => dispatch(addUniversityProgram(prog));
  const editUniversityProgram = (prog) => dispatch(updateUniversityProgram(prog));
  const removeUniversityProgram = (id) => dispatch(deleteUniversityProgram(id));
  const addNewGalleryItem = (item) => dispatch(addGalleryItem(item));
  const removeGalleryItem = (id) => dispatch(deleteGalleryItem(id));

  return {
    isAdminLoggedIn,
    adminUser,
    expenses,
    adminDonations,
    pendingApprovals,
    adminStats,
    courses,
    universityPrograms,
    galleryItems,
    adminLogin,
    adminLogout,
    syncStats,
    syncExpenses,
    syncDonations,
    syncPendingApprovals,
    syncCourses,
    syncUniversityPrograms,
    recordExpense,
    removeExpense,
    approveCert,
    rejectCert,
    addNewCourse,
    editCourse,
    removeCourse,
    addNewUniversityProgram,
    editUniversityProgram,
    removeUniversityProgram,
    addNewGalleryItem,
    removeGalleryItem,
  };
}
