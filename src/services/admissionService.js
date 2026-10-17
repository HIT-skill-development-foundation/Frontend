import { coursesList, universityProgramsList, centresList } from '../data/mockData';

export const admissionService = {
  /**
   * Process enrollment application and generate student dossier
   */
  async submitApplication(formData) {
    // Artificial latency for realistic gateway processing & loader display
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const regId = `HIT-ADM-2026-${randomSuffix}`;
    const rollId = `HIT-STU-2026-${randomSuffix}`;

    const selectedCourse =
      coursesList.find((c) => c.id === formData.courseId) ||
      universityProgramsList.find((u) => u.id === formData.courseId) ||
      coursesList[0];
    const selectedCentre = centresList.find((c) => c.id === formData.centreId) || centresList[0];

    const newStudent = {
      rollNo: rollId,
      regNo: regId,
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      motherName: formData.motherName || 'Shanti Devi',
      dob: formData.dob,
      gender: formData.gender,
      category: formData.category || 'General',
      mobile: `+91 ${formData.mobile}`,
      email: formData.email,
      courseCode: selectedCourse.code,
      courseName: selectedCourse.name,
      centreName: selectedCentre.name,
      centreCode: selectedCentre.id,
      session: '2026-2027',
      batchTiming: formData.batchTime || '08:00 AM - 10:00 AM (Morning)',
      admissionDate: new Date().toLocaleDateString('en-GB'),
      status: 'Active Enrolled Student',
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7w1t1k4oE5UqY7CjyUR9wr4ds1UGeSFZ3ypw5-HptD0EkF58K5E_vmI_bA_f-uvoCN_b5QE-r2mxd-Qkmddhft6wn7PXH7whtkiBb1dTJDjJVOyAKIo7zA0yQzmr4PUxGNfinra069nOa3zmuRri1yPodaLmd6-OIFQGJKZaRvAf485ZePcjl6rZon7kqfgLE1uKxMG6GpvCoyemhXKNm4PSZixEqRPRApUwBqT4PhqUJoBZ3PrTiSQ',
      attendancePercentage: '100%',
      overallGrade: 'A+',
      modulesCompleted: '1 / ' + (selectedCourse.modules ? selectedCourse.modules.length : 8),
      nextExam: 'Unit 1 Practical Test (Scheduled Next Month)',
      feeStatus: '₹100 Registration Settled (Online)',
    };

    return {
      success: true,
      regId,
      rollId,
      studentData: newStudent,
    };
  },
};

export default admissionService;
