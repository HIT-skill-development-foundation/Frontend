import { initialStudentData } from '../data/mockData';

export const studentService = {
  /**
   * Simulates fetching student record from central registry ledger with verification delay
   */
  async verifyRollNumber(rollNumber) {
    // Artificial latency for realistic cryptographic lookup & loader demonstration
    await new Promise((resolve) => setTimeout(resolve, 800));

    const sanitized = (rollNumber || '').trim().toUpperCase();
    if (sanitized.includes('HIT') || sanitized.length >= 4) {
      return {
        success: true,
        data: {
          ...initialStudentData,
          rollNo: sanitized,
        },
      };
    }

    return {
      success: false,
      error: 'Credential Record Not Found in Central NITI Aayog/MCA Registry',
    };
  },

  /**
   * Simulates generating and downloading official student ID card
   */
  async generateIdCardDownload(rollNumber) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      filename: `HIT_ID_CARD_${rollNumber || 'STU'}.pdf`,
    };
  },
};

export default studentService;
