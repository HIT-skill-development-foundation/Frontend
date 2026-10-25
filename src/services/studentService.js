import {
  verificationService as apiVerificationService,
  studentService as apiStudentService,
} from './hitApi';

export const studentService = {
    async verifyRollNumber(rollNumber) {
    const sanitized = (rollNumber || '').trim();
    if (!sanitized) {
      return {
        success: false,
        error: 'Please enter a valid Roll Number or Certificate ID.',
      };
    }

    try {
      const res = await apiVerificationService.verify(sanitized);
      if (res && res.success && res.data) {
        return {
          success: true,
          data: res.data,
        };
      }
      return {
        success: false,
        error: res?.error || 'Credential record not found in central registry.',
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Credential record not found in central registry.',
      };
    }
  },

  /**
   * Trigger official student ID card download from live API
   */
  async generateIdCardDownload(rollNumber) {
    const sanitized = (rollNumber || '').trim();
    const res = await apiStudentService.getIdCard(sanitized);

    // Audit log increment
    try {
      await apiStudentService.logDownload(sanitized);
    } catch {
      // non-blocking
    }

    if (res?.data?.url || res?.url) {
      window.open(res.data?.url || res.url, '_blank');
    }

    return {
      success: true,
      filename: `HIT_ID_CARD_${sanitized || 'STU'}.pdf`,
      url: res?.data?.url || res?.url,
    };
  },

  listStudents: (params) => apiStudentService.listStudents(params),
  getByRoll: (rollNo) => apiStudentService.getByRoll(rollNo),
  getIdCard: (rollNo) => apiStudentService.getIdCard(rollNo),
  logDownload: (rollNo) => apiStudentService.logDownload(rollNo),
};

export default studentService;
