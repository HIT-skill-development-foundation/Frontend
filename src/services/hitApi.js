import apiClient from './apiClient';

export const authService = {
  
  loginAdmin: async ({ email, password }) => {
    const res = await apiClient.post('/auth/admin/login', { email, password });
    if (res.token) {
      localStorage.setItem('hit_admin_token', res.token);
      localStorage.setItem('hit_admin_user', JSON.stringify(res.data));
    }
    return res;
  },

  
  loginStudent: async ({ rollOrEmail, password }) => {
    const res = await apiClient.post('/auth/student/login', {
      rollOrEmail,
      password,
    });
    if (res.token) {
      localStorage.setItem('hit_student_token', res.token);
      localStorage.setItem('hit_student_user', JSON.stringify(res.data));
    }
    return res;
  },

  // Resend Email OTP: Request 6-digit verification code
  sendOtp: async ({ email, purpose = 'login', name = '' }) => {
    return await apiClient.post('/auth/send-otp', { email, purpose, name });
  },

  // Resend Email OTP: Verify code & Authenticate
  verifyOtp: async ({ email, otp, purpose = 'login' }) => {
    const res = await apiClient.post('/auth/verify-otp', { email, otp, purpose });
    if (res.token) {
      if (res.userType === 'admin') {
        localStorage.setItem('hit_admin_token', res.token);
        localStorage.setItem('hit_admin_user', JSON.stringify(res.data));
      } else {
        localStorage.setItem('hit_student_token', res.token);
        localStorage.setItem('hit_student_user', JSON.stringify(res.data));
      }
    }
    return res;
  },

  
  logout: () => {
    localStorage.removeItem('hit_admin_token');
    localStorage.removeItem('hit_admin_user');
    localStorage.removeItem('hit_student_token');
    localStorage.removeItem('hit_student_user');
  },

  getStoredAdmin: () => {
    try {
      return JSON.parse(localStorage.getItem('hit_admin_user') || 'null');
    } catch {
      return null;
    }
  },

  getStoredStudent: () => {
    try {
      return JSON.parse(localStorage.getItem('hit_student_user') || 'null');
    } catch {
      return null;
    }
  },

  getAdminToken: () => localStorage.getItem('hit_admin_token'),
  getStudentToken: () => localStorage.getItem('hit_student_token'),
};

export const adminService = {
  
  getStats: async () => {
    return await apiClient.get('/admin/stats');
  },
};

export const admissionService = {
  
  submitAdmission: async (admissionData) => {
    return await apiClient.post('/admissions', admissionData);
  },

  
  getAdmissions: async ({
    page = 1,
    limit = 20,
    status = '',
    search = '',
  } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    return await apiClient.get(`/admissions?${params.toString()}`);
  },

  
  updateStatus: async (
    admissionId,
    { status, certificateIssued = false, remark = '' }
  ) => {
    return await apiClient.patch(`/admissions/${admissionId}/status`, {
      status,
      certificateIssued,
      remark,
    });
  },
};

/* ==========================================================================
   4. STUDENT REGISTRY & ID CARD SERVICE
   ========================================================================== */
export const studentService = {
  // Admin Protected: List all enrolled students
  listStudents: async ({ search = '', courseId = '' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (courseId) params.append('courseId', courseId);

    return await apiClient.get(`/students?${params.toString()}`);
  },

  
  getByRoll: async (rollNo) => {
    return await apiClient.get(`/students/${encodeURIComponent(rollNo)}`);
  },

  
  getIdCard: async (rollNo) => {
    return await apiClient.get(
      `/students/${encodeURIComponent(rollNo)}/id-card`
    );
  },

  
  logDownload: async (rollNo) => {
    return await apiClient.post(
      `/students/${encodeURIComponent(rollNo)}/download-log`
    );
  },
};

export const verificationService = {
  
  verify: async (identifier) => {
    return await apiClient.get(
      `/verification/${encodeURIComponent(identifier)}`
    );
  },
};

export const courseService = {
  
  getAllCourses: async () => {
    return await apiClient.get('/courses');
  },

  
  createCourse: async (courseData) => {
    return await apiClient.post('/courses', courseData);
  },

  
  updateCourse: async (courseId, updatedData) => {
    return await apiClient.put(`/courses/${courseId}`, updatedData);
  },

  
  deleteCourse: async (courseId) => {
    return await apiClient.delete(`/courses/${courseId}`);
  },

  
  getUniversityPrograms: async () => {
    return await apiClient.get('/courses/university-programs');
  },

  
  createUniversityProgram: async (programData) => {
    return await apiClient.post('/courses/university-programs', programData);
  },

  
  updateUniversityProgram: async (id, programData) => {
    return await apiClient.put(`/courses/university-programs/${id}`, programData);
  },

  
  deleteUniversityProgram: async (id) => {
    return await apiClient.delete(`/courses/university-programs/${id}`);
  },

  
  submitInquiry: async ({
    programId,
    programName,
    name,
    phone,
    qualification,
  }) => {
    return await apiClient.post('/courses/inquiry', {
      programId,
      programName,
      name,
      phone,
      qualification,
    });
  },
};

export const centreService = {
  
  getCentres: async () => {
    return await apiClient.get('/centres');
  },

  
  applyFranchise: async (franchiseData) => {
    return await apiClient.post('/centres/franchise-apply', franchiseData);
  },
};

export const donationService = {
  
  calculate80gTaxBenefit(amount, taxBracketPercentage = 30) {
    const num = Number(amount) || 0;
    const eligible50Percent = Math.round(num * 0.5);
    const estimatedTaxSaved = Math.round(eligible50Percent * (taxBracketPercentage / 100));
    return {
      eligible50Percent,
      estimatedTaxSaved,
    };
  },

  
  processDonation: async ({ amount, donorInfo }) => {
    return await apiClient.post('/donations/process', {
      amount: Number(amount),
      donorInfo,
    });
  },

  
  getDonations: async () => {
    return await apiClient.get('/donations');
  },
};

export const membershipService = {
  
  register: async (memberData) => {
    return await apiClient.post('/memberships', memberData);
  },
};

export const expenseService = {
  
  getExpenses: async () => {
    return await apiClient.get('/expenses');
  },

  
  addExpense: async (expenseData) => {
    return await apiClient.post('/expenses', expenseData);
  },

  
  deleteExpense: async (expenseId) => {
    return await apiClient.delete(`/expenses/${expenseId}`);
  },
};

export const galleryService = {
  getItems: async (category = '') => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return await apiClient.get(`/gallery${query}`);
  },

  addItem: async (galleryData) => {
    return await apiClient.post('/gallery', galleryData);
  },

  deleteItem: async (galleryId) => {
    return await apiClient.delete(`/gallery/${galleryId}`);
  },
};

export { uploadService } from './uploadService';

export const systemService = {
  checkHealth: async () => {
    return await apiClient.get('/health');
  },
};
