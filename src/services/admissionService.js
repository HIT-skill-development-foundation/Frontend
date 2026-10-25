import { admissionService as apiAdmissionService } from './hitApi';

export const admissionService = {
    async submitApplication(formData) {
    const payload = {
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      motherName: formData.motherName || '',
      dob: formData.dob,
      gender: formData.gender,
      category: formData.category || 'General',
      mobile: formData.mobile?.replace(/^\+91\s*/, ''),
      email: formData.email,
      address: formData.address,
      district: formData.district || '',
      state: formData.state || 'Uttar Pradesh',
      pincode: formData.pincode || '',
      courseId: formData.courseId,
      centreId: formData.centreId,
      batchTime: formData.batchTime,
      qualification: formData.qualification,
      aadhaarNo: formData.aadhaarNo,
      paymentMode: formData.paymentMode || 'upi',
      paymentRef: formData.paymentRef || `UPI-${Date.now()}`,
    };

    const res = await apiAdmissionService.submitAdmission(payload);

    return {
      success: res.success !== false,
      regId: res.regId || res.data?.regId,
      rollId: res.rollId || res.data?.rollId,
      studentData: res.data || res,
      message: res.message,
    };
  },

  submitAdmission: (data) => apiAdmissionService.submitAdmission(data),
  getAdmissions: (params) => apiAdmissionService.getAdmissions(params),
  updateStatus: (id, data) => apiAdmissionService.updateStatus(id, data),
};

export default admissionService;
