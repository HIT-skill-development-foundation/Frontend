import apiClient from './apiClient';

/* ==========================================================================
   1. AUTHENTICATION SERVICE
   ========================================================================== */
export const authService = {
  // Super Admin Login
  loginAdmin: async ({ email, password }) => {
    const res = await apiClient.post('/auth/admin/login', { email, password });
    if (res.token) {
      localStorage.setItem('hit_admin_token', res.token);
      localStorage.setItem('hit_admin_user', JSON.stringify(res.data));
    }
    return res;
  },

  // Student Portal Login (via Roll No or Email)
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

  // Logout helper
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

/* ==========================================================================
   2. ADMIN DASHBOARD SERVICE
   ========================================================================== */
export const adminService = {
  // Get aggregated KPI tiles (Admin protected)
  getStats: async () => {
    return await apiClient.get('/admin/stats');
  },
};

/* ==========================================================================
   3. ADMISSIONS SERVICE
   ========================================================================== */
export const admissionService = {
  // Public: Submit Online Student Admission Form
  submitAdmission: async (admissionData) => {
    return await apiClient.post('/admissions', admissionData);
  },

  // Admin Protected: List admission applications with filters & pagination
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

  // Admin Protected: Approve or reject admission
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

  // Public / Student: Get student dossier by roll number
  getByRoll: async (rollNo) => {
    return await apiClient.get(`/students/${encodeURIComponent(rollNo)}`);
  },

  // Public / Student: Get download link for PVC ID card PDF
  getIdCard: async (rollNo) => {
    return await apiClient.get(
      `/students/${encodeURIComponent(rollNo)}/id-card`
    );
  },

  // Student Protected: Increment ID card download audit counter
  logDownload: async (rollNo) => {
    return await apiClient.post(
      `/students/${encodeURIComponent(rollNo)}/download-log`
    );
  },
};

/* ==========================================================================
   5. VERIFICATION LEDGER SERVICE
   ========================================================================== */
export const verificationService = {
  // Public: Verify roll number or certificate serial against central registry
  verify: async (identifier) => {
    return await apiClient.get(
      `/verification/${encodeURIComponent(identifier)}`
    );
  },
};

/* ==========================================================================
   6. COURSES & UNIVERSITY PROGRAMS SERVICE
   ========================================================================== */
export const courseService = {
  // Public: List all active vocational courses
  getAllCourses: async () => {
    return await apiClient.get('/courses');
  },

  // Admin Protected: Add a new vocational course
  createCourse: async (courseData) => {
    return await apiClient.post('/courses', courseData);
  },

  // Admin Protected: Edit course details
  updateCourse: async (courseId, updatedData) => {
    return await apiClient.put(`/courses/${courseId}`, updatedData);
  },

  // Admin Protected: Delete course
  deleteCourse: async (courseId) => {
    return await apiClient.delete(`/courses/${courseId}`);
  },

  // Public: List university degree / distance learning programs
  getUniversityPrograms: async () => {
    return await apiClient.get('/courses/university-programs');
  },

  // Public: Submit admission counseling inquiry for degree course
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

/* ==========================================================================
   7. CENTRES & FRANCHISE SERVICE
   ========================================================================== */
export const centreService = {
  // Public: List authorized training centres
  getCentres: async () => {
    return await apiClient.get('/centres');
  },

  // Public: Submit application for opening/affiliating a training centre
  applyFranchise: async (franchiseData) => {
    return await apiClient.post('/centres/franchise-apply', franchiseData);
  },
};

/* ==========================================================================
   8. DONATIONS & 80G TAX EXEMPTION SERVICE
   ========================================================================== */
export const donationService = {
  // Tax savings calculation helper
  calculate80gTaxBenefit(amount, taxBracketPercentage = 30) {
    const num = Number(amount) || 0;
    const eligible50Percent = Math.round(num * 0.5);
    const estimatedTaxSaved = Math.round(eligible50Percent * (taxBracketPercentage / 100));
    return {
      eligible50Percent,
      estimatedTaxSaved,
    };
  },

  // Public: Process donation and generate formal 80G tax receipt
  processDonation: async ({ amount, donorInfo }) => {
    return await apiClient.post('/donations/process', {
      amount: Number(amount),
      donorInfo,
    });
  },

  // Admin Protected: Get list of donations received
  getDonations: async () => {
    return await apiClient.get('/donations');
  },
};

/* ==========================================================================
   9. MEMBERSHIP SERVICE
   ========================================================================== */
export const membershipService = {
  // Public: Register life/patron/annual member
  register: async (memberData) => {
    return await apiClient.post('/memberships', memberData);
  },
};

/* ==========================================================================
   10. FINANCIAL EXPENSES SERVICE (PUBLIC TRANSPARENCY)
   ========================================================================== */
export const expenseService = {
  // Public: List all audited institutional expenses
  getExpenses: async () => {
    return await apiClient.get('/expenses');
  },

  // Admin Protected: Record an audited expense entry
  addExpense: async (expenseData) => {
    return await apiClient.post('/expenses', expenseData);
  },

  // Admin Protected: Void/Delete expense entry
  deleteExpense: async (expenseId) => {
    return await apiClient.delete(`/expenses/${expenseId}`);
  },
};

/* ==========================================================================
   11. MEDIA GALLERY SERVICE
   ========================================================================== */
export const galleryService = {
  // Public: List gallery photos
  getItems: async (category = '') => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return await apiClient.get(`/gallery${query}`);
  },

  // Admin Protected: Upload new photo entry
  addItem: async (galleryData) => {
    return await apiClient.post('/gallery', galleryData);
  },

  // Admin Protected: Delete gallery photo
  deleteItem: async (galleryId) => {
    return await apiClient.delete(`/gallery/${galleryId}`);
  },
};

/* ==========================================================================
   12. SYSTEM HEALTH CHECK
   ========================================================================== */
export const systemService = {
  checkHealth: async () => {
    return await apiClient.get('/health');
  },
};
