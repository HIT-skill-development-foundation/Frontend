import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useStudent, useLoader } from '../store/hooks';
import admissionService from '../services/admissionService';
import { courseService, centreService, uploadService, authService } from '../services/hitApi';
import ImageUploader from '../components/common/ImageUploader';

const INITIAL_CENTRES = [
  { id: 'HIT-CEN-0001', name: 'Ghosi Main Campus (HQ)', district: 'Mau', address: 'Kasba Khas, Ghosi, Mau - 275105' },
];

export default function AdmissionPage({ setActiveTab, setStudentData }) {
  const navigate = useNavigate();
  const { updateStudent } = useStudent();
  const { withLoader, notify } = useLoader();

  const [coursesList, setCoursesList] = useState([]);
  const [centresList, setCentresList] = useState(INITIAL_CENTRES);

  useEffect(() => {
    courseService.getAllCourses()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCoursesList(list);
        if (list.length > 0) {
          setFormData((prev) => ({ ...prev, courseId: prev.courseId || list[0].id || list[0]._id || list[0].code }));
        }
      })
      .catch(() => null);

    centreService.getCentres()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        const mainCampusCentres = list.filter(
          (c) => c.id === 'HIT-CEN-0001' || (c.name && c.name.toLowerCase().includes('main campus'))
        );
        const finalCentres = mainCampusCentres.length > 0 ? mainCampusCentres : INITIAL_CENTRES;
        setCentresList(finalCentres);
        setFormData((prev) => ({ ...prev, centreId: prev.centreId || finalCentres[0].id || finalCentres[0]._id }));
      })
      .catch(() => null);
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male',
    category: 'General',
    mobile: '',
    email: '',
    address: '',
    district: '',
    state: 'Uttar Pradesh',
    pincode: '',
    courseId: '',
    centreId: 'HIT-CEN-0001',
    batchTime: '08:00 AM - 10:00 AM (Morning)',
    qualification: '12th Pass',
    aadhaarNo: '',
    photoUrl: '',
    photoUploaded: false,
    aadhaarUploaded: false,
    emailVerificationToken: '',
    paymentMode: 'upi',
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedRegId, setGeneratedRegId] = useState('');
  const [generatedRollId, setGeneratedRollId] = useState('');

  // Email OTP Verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendAdmissionOtp = async () => {
    const email = (formData.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      notify('error', 'Please enter a valid email address first.');
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.sendOtp({
          email,
          purpose: 'signup',
          name: formData.fullName || 'Student Candidate',
        });
        setOtpSent(true);
        setOtpTimer(60);
        notify('success', res.message || `Verification code sent to ${email}`);
      } catch (err) {
        notify('error', err.message || 'Failed to send OTP code.');
      }
    }, 'Sending OTP code via Resend...');
  };

  const handleVerifyAdmissionOtp = async () => {
    const email = (formData.email || '').trim().toLowerCase();
    const code = otpCode.trim();

    if (!code || code.length !== 6) {
      notify('error', 'Please enter the 6-digit code received on your email.');
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.verifyOtp({ email, otp: code, purpose: 'signup' });
        if (res?.success) {
          const token = res.data?.verificationToken || res.verificationToken || '';
          setIsEmailVerified(true);
          setFormData((prev) => ({ ...prev, emailVerificationToken: token }));
          notify('success', 'Email verified successfully! Confirmation email will be delivered here.');
        } else {
          notify('error', res?.message || 'Verification failed.');
        }
      } catch (err) {
        notify('error', err.message || 'Incorrect verification code.');
      }
    }, 'Verifying OTP code...');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setIsEmailVerified(false);
      setOtpSent(false);
      setFormData((prev) => ({ ...prev, emailVerificationToken: '' }));
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    await withLoader(async () => {
      let submissionData = { ...formData };
      if (formData.photoFile) {
        try {
          const uploadRes = await uploadService.uploadImage(formData.photoFile, { folder: 'students' });
          if (uploadRes?.url) {
            submissionData.photoUrl = uploadRes.url;
          }
        } catch (uploadErr) {
          notify('error', 'Failed to upload photo: ' + uploadErr.message);
          return;
        }
      }
      const res = await admissionService.submitApplication(submissionData);

      if (res.success) {
        setGeneratedRegId(res.regId);
        setGeneratedRollId(res.rollId);
        setIsCompleted(true);

        // Update Redux student dossier
        updateStudent(res.studentData);

        // Update legacy callback if provided
        if (setStudentData) {
          setStudentData(res.studentData);
        }

        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }

        notify('success', `Admission successfully processed! Roll No: ${res.rollId}`);
      }
    }, 'Cryptographically Generating Permanent Roll Number & Registering with NITI Aayog...');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      notify('error', 'Please enter your Full Legal Name.');
      return false;
    }
    if (!formData.fatherName.trim()) {
      notify('error', "Please enter your Father's Name.");
      return false;
    }
    if (!formData.dob) {
      notify('error', 'Please enter your Date of Birth.');
      return false;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/[^0-9]/g, '').length < 10) {
      notify('error', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      notify('error', 'Please enter a valid email address.');
      return false;
    }
    if (!isEmailVerified) {
      notify('error', 'Please verify your email address with the OTP code before proceeding.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.courseId) {
      notify('error', 'Please select a Course.');
      return false;
    }
    if (!formData.centreId) {
      notify('error', 'Please select a Training Centre.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.aadhaarNo.trim() || formData.aadhaarNo.replace(/[^0-9]/g, '').length < 12) {
      notify('error', 'Please enter a valid 12-digit Aadhaar Number.');
      return false;
    }
    return true;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb & Status Bar */}
      <div className="w-full bg-[#001030] text-white py-2.5 px-4 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (setActiveTab) setActiveTab('home');
                navigate('/');
              }} 
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              HIT Computer Education
            </button>
            <span className="text-white/40">/</span>
            <span className="text-secondary-fixed font-semibold">Student Admissions Session 2026-2027</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Direct Enrollment • Processing Fee Flat ₹100.00</span>
          </div>
        </div>
      </div>

      {/* Multi-Step Progress Tracker */}
      <div className="w-full bg-surface-container-low py-3.5 px-4 lg:px-8 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { num: 1, title: 'Personal Dossier', desc: currentStep > 1 ? 'Completed' : 'Step 1' },
              { num: 2, title: 'Course & Centre', desc: currentStep > 2 ? 'Completed' : currentStep === 2 ? 'Active Selection' : 'Next' },
              { num: 3, title: 'Photo & Aadhaar', desc: currentStep > 3 ? 'Completed' : currentStep === 3 ? 'Document Upload' : 'Next' },
              { num: 4, title: '₹100 Fee & Instant ID', desc: isCompleted ? 'Verified & Paid' : 'Verification & Pay' },
            ].map((st) => {
              const isPassed = currentStep > st.num || isCompleted;
              const isCurrent = currentStep === st.num && !isCompleted;
              return (
                <div
                  key={st.num}
                  onClick={() => {
                    if (isCompleted) return;
                    if (st.num === 1) setCurrentStep(1);
                    else if (st.num === 2 && validateStep1()) setCurrentStep(2);
                    else if (st.num === 3 && validateStep1() && validateStep2()) setCurrentStep(3);
                    else if (st.num === 4 && validateStep1() && validateStep2() && validateStep3()) setCurrentStep(4);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-surface-container-lowest border-2 border-primary shadow-xs'
                      : isPassed
                      ? 'bg-surface-container-lowest border border-emerald-200'
                      : 'bg-surface-container-lowest/70 border border-outline-variant/30 opacity-75'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPassed
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {isPassed ? <span className="material-symbols-outlined text-sm">check</span> : st.num}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-primary truncate">
                      {st.title}
                    </span>
                    <span
                      className={`text-[11px] truncate ${
                        isPassed ? 'text-emerald-600 font-semibold' : isCurrent ? 'text-secondary font-semibold' : 'text-on-surface-variant'
                      }`}
                    >
                      {st.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg py-space-xl">
        {isCompleted ? (
                    <div className="bg-surface-container-lowest rounded-2xl p-8 sm:p-12 shadow-xl border border-outline-variant/30 text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-5xl">task_alt</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              Payment Settled & Registration Cleared
            </span>
            <h2 className="font-headline text-3xl font-bold text-primary">
              Admission Successfully Confirmed!
            </h2>
            <p className="font-body-md text-on-surface-variant text-base mt-2 max-w-xl mx-auto">
              Congratulations <strong className="text-on-surface">{formData.fullName}</strong>! Your registration for <strong className="text-on-surface">{coursesList.find(c => c.id === formData.courseId)?.name}</strong> has been confirmed under H.I.T India Skill Development Foundation.
            </p>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto my-8 text-left bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">Temporary Registration No.</span>
                <span className="font-mono text-base font-bold text-primary">{generatedRegId}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">Permanent Roll Number</span>
                <span className="font-mono text-base font-bold text-secondary">{generatedRollId}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">Allocated Training Centre</span>
                <span className="text-xs font-semibold text-on-surface">{centresList.find(c => c.id === formData.centreId)?.name}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">Processing Fee Settled</span>
                <span className="text-xs font-bold text-emerald-700">₹100.00 (Instant Verification)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('student_portal');
                  navigate('/student-portal');
                }}
                className="btn-primary h-12 px-6 w-full sm:w-auto"
              >
                <span>Open Digital ID Card & Dossier</span>
              </button>
              <button
                onClick={() => window.print()}
                className="btn-secondary h-12 px-6 w-full sm:w-auto"
              >
                <span>Print Admission Slip</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              
              {currentStep === 1 && (
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-2xl">person</span>
                      <h2 className="font-headline-md text-headline-md font-bold text-primary">
                        Applicant Information (Personal Dossier)
                      </h2>
                    </div>
                    <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-high px-space-sm py-1 rounded">
                      Fields with <span className="text-error">*</span> are Mandatory
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Student Full Name (As per High School Certificate) <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter Full Name"
                        className="h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Father's / Guardian's Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        placeholder="Enter Father's Name"
                        className="h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        placeholder="Enter Mother's Name"
                        className="h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-xs font-semibold text-on-surface">
                          Date of Birth <span className="text-error">*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-xs font-semibold text-on-surface">
                          Gender <span className="text-error">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Mobile Number (WhatsApp Enabled) <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile"
                        className="h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-label-md text-xs font-semibold text-on-surface">
                          Email Address <span className="text-error">*</span>
                        </label>
                        {isEmailVerified && (
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isEmailVerified}
                          placeholder="candidate@example.com"
                          className="w-full h-11 pl-3.5 pr-24 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all disabled:opacity-75"
                        />
                        <div className="absolute right-1.5 flex items-center">
                          {isEmailVerified ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsEmailVerified(false);
                                setOtpSent(false);
                                setFormData((prev) => ({ ...prev, emailVerificationToken: '' }));
                              }}
                              className="h-8 px-2.5 rounded-md bg-surface-container-high hover:bg-surface-container-highest text-primary font-semibold text-xs cursor-pointer transition-colors border border-outline-variant/30 flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-xs">edit</span>
                              <span>Change</span>
                            </button>
                          ) : otpTimer > 0 ? (
                            <span className="h-8 px-2.5 rounded-md bg-slate-100 border border-slate-200 text-slate-500 font-medium text-xs flex items-center justify-center cursor-not-allowed">
                              {otpTimer}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendAdmissionOtp}
                              disabled={!formData.email}
                              className="h-8 px-3 rounded-md bg-[#001030] hover:bg-[#001845] text-white text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>{otpSent ? 'Resend' : 'Verify'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline OTP Verification Input */}
                      {otpSent && !isEmailVerified && (
                        <div className="mt-2 p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between gap-2 animate-fadeIn">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-secondary">pin</span>
                            <span className="text-xs text-on-surface-variant font-medium">6-Digit Code:</span>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="••••••"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                              className="w-24 h-8 px-2 rounded-md bg-white border border-outline-variant/60 text-xs font-mono tracking-widest font-bold text-primary focus:outline-none focus:ring-1 focus:ring-secondary text-center"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleVerifyAdmissionOtp}
                            className="h-8 px-3.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors shrink-0"
                          >
                            Confirm OTP
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Permanent Residential Address <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Village/Town, Street, Post Office"
                        className="h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-3 md:col-span-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-xs font-semibold text-on-surface">District</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant/40"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-xs font-semibold text-on-surface">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant/40"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-xs font-semibold text-on-surface">PIN Code</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant/40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setCurrentStep(2);
                      }}
                      className="btn-primary h-11 px-6"
                    >
                      <span>Proceed to Course & Centre</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              
              {currentStep === 2 && (
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-2xl">school</span>
                      <h2 className="font-headline-md text-headline-md font-bold text-primary">
                        Course Enrollment & Centre Selection
                      </h2>
                    </div>
                    <span className="text-label-sm font-label-sm text-secondary font-semibold">Step 2 of 4</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Select Vocational Course / Diploma Program <span className="text-error">*</span>
                      </label>
                      <select
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleInputChange}
                        className="h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary font-medium"
                      >
                        {coursesList.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.code} - {c.duration})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Authorized Training Centre Location <span className="text-error">*</span>
                      </label>
                      <select
                        name="centreId"
                        value={formData.centreId}
                        onChange={handleInputChange}
                        className="h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary font-medium"
                      >
                        {centresList.map((centre) => {
                          const cid = centre.id || centre._id || 'HIT-CEN-0001';
                          return (
                            <option key={cid} value={cid}>
                              {centre.name} ({cid}) – {centre.district}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Preferred Batch Timing <span className="text-error">*</span>
                      </label>
                      <select
                        name="batchTime"
                        value={formData.batchTime}
                        onChange={handleInputChange}
                        className="h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        <option value="08:00 AM - 10:00 AM (Morning)">08:00 AM - 10:00 AM (Morning)</option>
                        <option value="10:00 AM - 12:00 PM (Mid-Day)">10:00 AM - 12:00 PM (Mid-Day)</option>
                        <option value="01:00 PM - 03:00 PM (Afternoon)">01:00 PM - 03:00 PM (Afternoon)</option>
                        <option value="04:00 PM - 06:00 PM (Evening)">04:00 PM - 06:00 PM (Evening)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Highest Qualification <span className="text-error">*</span>
                      </label>
                      <select
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        <option value="10th Pass (High School)">10th Pass (High School)</option>
                        <option value="12th Pass (Intermediate)">12th Pass (Intermediate)</option>
                        <option value="Graduate (B.A / B.Sc / B.Com)">Graduate (B.A / B.Sc / B.Com)</option>
                        <option value="Post Graduate / Diploma">Post Graduate / Diploma</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="btn-secondary h-11 px-5"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep2()) setCurrentStep(3);
                      }}
                      className="btn-primary h-11 px-6"
                    >
                      <span>Proceed to Documents & Photo</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              
              {currentStep === 3 && (
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-2xl">add_photo_alternate</span>
                      <h2 className="font-headline-md text-headline-md font-bold text-primary">
                        Student Photograph & Identity Proof
                      </h2>
                    </div>
                    <span className="text-label-sm font-label-sm text-secondary font-semibold">Step 3 of 4</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                    
                    <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
                      <ImageUploader
                        label="Passport Sized Photograph"
                        preview={formData.photoUrl}
                        file={formData.photoFile}
                        onChange={(file, previewUrl) =>
                          setFormData((prev) => ({
                            ...prev,
                            photoFile: file,
                            photoUrl: previewUrl,
                            photoUploaded: !!file || !!previewUrl,
                          }))
                        }
                        helperText="Official student identification photo (JPEG, PNG, WEBP)"
                        required
                      />
                    </div>

                    
                    <div className="p-space-md rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-secondary">fingerprint</span>
                          <span className="font-label-md text-xs font-bold text-primary">Aadhaar Card Verification</span>
                        </div>
                        <label className="text-[11px] text-on-surface-variant block mb-1">
                          Aadhaar Number (12 Digits) <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          name="aadhaarNo"
                          value={formData.aadhaarNo}
                          onChange={handleInputChange}
                          className="h-10 px-3 rounded-lg bg-white border border-outline-variant text-sm font-mono w-full"
                        />
                        <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">
                          Used strictly for digital verification under Government skill training registry guidelines.
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        <span>Aadhaar Document Attached</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="btn-secondary h-11 px-5"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep3()) setCurrentStep(4);
                      }}
                      className="btn-primary h-11 px-6"
                    >
                      <span>Proceed to ₹100 Payment</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              
              {currentStep === 4 && (
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-2xl">payments</span>
                      <h2 className="font-headline-md text-headline-md font-bold text-primary">
                        Processing Fee Payment & Instant Digital ID
                      </h2>
                    </div>
                    <span className="text-label-sm font-label-sm text-secondary font-semibold">Final Step</span>
                  </div>

                  <div className="bg-surface-container-low p-space-md rounded-xl space-y-2 border border-outline-variant/30">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Online Application & Processing Charge</span>
                      <span className="font-semibold text-on-surface">₹0.00 (Waived)</span>
                    </div>
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Digital Ledger Registration & ID Card Issue Fee</span>
                      <span className="font-semibold text-on-surface">₹100.00</span>
                    </div>
                    <div className="pt-2 border-t border-outline-variant/20 flex justify-between text-base font-bold text-primary">
                      <span>Total Payable Today</span>
                      <span className="text-secondary text-xl">₹100.00</span>
                    </div>
                  </div>

                  
                  <div>
                    <label className="font-label-md text-xs font-bold text-primary block mb-2">
                      Select Payment Mode:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'upi', label: 'UPI / QR Code', icon: 'qr_code_scanner' },
                        { id: 'card', label: 'Debit / Card', icon: 'credit_card' },
                        { id: 'netbanking', label: 'Net Banking', icon: 'account_balance' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMode: mode.id })}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            formData.paymentMode === mode.id
                              ? 'border-secondary bg-secondary-fixed/30 text-primary font-bold shadow-xs'
                              : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xl">{mode.icon}</span>
                          <span className="text-xs">{mode.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  
                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="termsAgree"
                      defaultChecked
                      className="mt-1 rounded text-secondary focus:ring-secondary"
                    />
                    <label htmlFor="termsAgree" className="text-xs text-on-surface-variant leading-relaxed">
                      I declare that all submitted personal records are authentic. I agree to abide by the academic code and regulations of H.I.T India Skill Development Foundation.
                    </label>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="btn-secondary h-11 px-5"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePaymentSubmit}
                      className="btn-primary h-12 px-8 text-sm sm:text-base"
                    >
                      <span>Pay ₹100.00 & Generate Registration</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            
            <div className="lg:col-span-4 flex flex-col gap-4">
              {currentStep < 4 ? (
                <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-lg">assignment</span>
                    <h3 className="font-['Fraunces'] text-base font-bold text-primary">Application Instructions</h3>
                  </div>

                  <ul className="space-y-3 text-xs text-on-surface-variant">
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">verified</span>
                      <span><strong>Personal Dossier:</strong> Enter your full name and father's name exactly as recorded in your 10th marksheet or Aadhaar.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">verified</span>
                      <span><strong>Contact Verification:</strong> Verification OTP, permanent Roll Number, and ID card will be dispatched to your registered email and mobile.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">verified</span>
                      <span><strong>Course & Centre:</strong> In Step 2, choose your intended certification program and your nearest Authorized Training Centre (ATC).</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">verified</span>
                      <span><strong>Photo & Identity:</strong> Keep a passport photo or smartphone portrait ready for your student PVC ID card in Step 3.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 mt-0.5">verified</span>
                      <span><strong>Nominal Processing Fee:</strong> Flat ₹100 registration fee settles via UPI or Net Banking at Step 4 with instant admission clearance.</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-lg">fact_check</span>
                    <h3 className="font-['Fraunces'] text-base font-bold text-primary">Enrollment Summary & Review</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-on-surface-variant block text-[11px]">Candidate Name:</span>
                      <span className="font-bold text-primary text-sm">{formData.fullName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[11px]">Selected Course:</span>
                      <span className="font-semibold text-secondary">
                        {coursesList.find((c) => c.id === formData.courseId)?.name || 'Course Selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[11px]">Training Centre:</span>
                      <span className="font-semibold text-on-surface">
                        {centresList.find((c) => c.id === formData.centreId)?.name || 'Center Selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[11px]">Batch Timing:</span>
                      <span className="font-medium text-on-surface">{formData.batchTime}</span>
                    </div>
                    <div className="pt-2 border-t border-outline-variant/20">
                      <span className="text-on-surface-variant block text-[11px]">Processing Fee:</span>
                      <span className="font-bold text-base text-emerald-700">₹100.00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Admissions Helpline Support */}
              <div className="bg-[#001030] text-white p-5 rounded-2xl shadow-sm border border-white/10">
                <span className="text-xs uppercase tracking-wider text-secondary-fixed font-bold block mb-1">
                  Need Help With Admission?
                </span>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Our admissions desk is available Mon–Sat (09:00 AM to 06:00 PM) to assist students with center selection and form filling.
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:1800HITSKILL"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary-fixed">call</span>
                    <span>1800-HIT-SKILL (Toll Free)</span>
                  </a>
                  <a
                    href="mailto:admissions@hit.org.in"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 text-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary-fixed">mail</span>
                    <span>admissions@hit.org.in</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
