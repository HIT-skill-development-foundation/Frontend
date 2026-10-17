import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
  formData: {
    fullName: 'Rahul Kumar Verma',
    fatherName: 'Dinesh Verma',
    motherName: 'Shanti Devi',
    dob: '2004-06-14',
    gender: 'Male',
    category: 'OBC',
    mobile: '9452078192',
    email: 'rahul.verma@email.com',
    address: 'Kasba Khas, Ward 4',
    district: 'Mau',
    state: 'Uttar Pradesh',
    pincode: '275105',
    courseId: 'adca',
    centreId: 'HIT-CEN-0001',
    batchTime: '08:00 AM - 10:00 AM (Morning)',
    qualification: '12th Pass (Science Stream)',
    aadhaarNo: '4829-1928-8472',
    photoUploaded: true,
    aadhaarUploaded: true,
    paymentMode: 'upi',
  },
  isCompleted: false,
  generatedRegId: '',
  generatedRollId: '',
  isSubmitting: false,
};

export const admissionSlice = createSlice({
  name: 'admission',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setAdmissionCompleted: (state, action) => {
      state.isCompleted = true;
      state.generatedRegId = action.payload.regId;
      state.generatedRollId = action.payload.rollId;
      state.isSubmitting = false;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    resetAdmissionForm: (state) => {
      state.currentStep = 1;
      state.isCompleted = false;
      state.generatedRegId = '';
      state.generatedRollId = '';
      state.isSubmitting = false;
    },
  },
});

export const {
  setCurrentStep,
  updateFormData,
  setAdmissionCompleted,
  setIsSubmitting,
  resetAdmissionForm,
} = admissionSlice.actions;

export const selectCurrentStep = (state) => state.admission.currentStep;
export const selectFormData = (state) => state.admission.formData;
export const selectIsAdmissionCompleted = (state) => state.admission.isCompleted;
export const selectGeneratedRegId = (state) => state.admission.generatedRegId;
export const selectGeneratedRollId = (state) => state.admission.generatedRollId;
export const selectIsSubmitting = (state) => state.admission.isSubmitting;

export default admissionSlice.reducer;
