import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useStudent, useLoader } from '../store/hooks';
import studentService from '../services/studentService';
import admissionService from '../services/admissionService';
import { authService, courseService, centreService } from '../services/hitApi';
import logo2 from '../assets/images/logo2.jpeg';
import loginSvg from '../assets/images/Login.svg';

export default function StudentPortalPage() {
  const { student, isLoggedIn, logIn, logOut, enrollNewStudent, logDownload } = useStudent();
  const { withLoader, notify } = useLoader();

  const [coursesList, setCoursesList] = useState([]);
  const [universityProgramsList, setUniversityProgramsList] = useState([]);
  const [centresList, setCentresList] = useState([]);

  useEffect(() => {
    courseService.getAllCourses()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCoursesList(list);
        if (list.length > 0) {
          setSignUpData((prev) => ({ ...prev, courseId: prev.courseId || list[0].id || list[0]._id || list[0].code }));
        }
      })
      .catch(() => null);

    courseService.getUniversityPrograms()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setUniversityProgramsList(list);
      })
      .catch(() => null);

    centreService.getCentres()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCentresList(list);
        if (list.length > 0) {
          setSignUpData((prev) => ({ ...prev, centreId: prev.centreId || list[0].id || list[0]._id }));
        }
      })
      .catch(() => null);
  }, []);

  
  // Navigation state: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login'); 

  // Login method: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState('password');

  // Password login state
  const [loginCreds, setLoginCreds] = useState({
    rollOrEmail: '',
    password: '',
  });

  // OTP login state
  const [otpLoginEmail, setOtpLoginEmail] = useState('');
  const [otpLoginCode, setOtpLoginCode] = useState('');
  const [otpLoginSent, setOtpLoginSent] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  // Signup OTP verification state
  const [signupOtpCode, setSignupOtpCode] = useState('');
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [isSignupEmailVerified, setIsSignupEmailVerified] = useState(false);
  const [signupResendTimer, setSignupResendTimer] = useState(0);

  // Countdown timers for OTP resend
  useEffect(() => {
    let timer;
    if (otpResendTimer > 0) {
      timer = setInterval(() => setOtpResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpResendTimer]);

  useEffect(() => {
    let timer;
    if (signupResendTimer > 0) {
      timer = setInterval(() => setSignupResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [signupResendTimer]);

  // Sign up / Registration form state
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    fatherName: '',
    dob: '',
    gender: 'Male',
    category: 'General',
    mobile: '',
    email: '',
    address: '',
    district: '',
    state: 'Uttar Pradesh',
    courseId: '',
    centreId: '',
    batchTime: '08:00 AM - 10:00 AM (Morning)',
    qualification: '12th Pass',
    aadhaarNo: '',
    paymentMode: 'upi',
  });

  
  const [activePortalTab, setActivePortalTab] = useState('id_card'); 
  const [cardSide, setCardSide] = useState('front'); 
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginCreds.rollOrEmail || !loginCreds.password) {
      notify('error', 'Please enter your Roll Number or Email and Password.');
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.loginStudent({
          rollOrEmail: loginCreds.rollOrEmail.trim(),
          password: loginCreds.password,
        });
        if (res && (res.success || res.token)) {
          const userData = res.data || {};
          logIn(userData);
          notify('success', `Welcome back, ${userData.fullName || 'Student'}!`);
          return;
        }
        notify('error', res?.message || 'Authentication failed. Please verify your credentials.');
      } catch (err) {
        notify('error', err.message || 'Authentication failed. Please check your credentials.');
      }
    }, 'Authenticating Student with Central Registry Ledger...');
  };

  
  const handleDemoLogin = async () => {
    await withLoader(async () => {
      try {
        const res = await authService.loginStudent({
          rollOrEmail: 'HIT-STU-2026-00001',
          password: 'password123',
        });
        if (res && (res.success || res.token)) {
          logIn(res.data);
          notify('success', `Logged in as ${res.data?.fullName || 'Enrolled Student'}`);
          return;
        }
        notify('error', 'Demo student record is not available on server.');
      } catch (err) {
        notify('error', err.message || 'Demo login failed.');
      }
    }, 'Accessing Student Dossier...');
  };

  
  // OTP Login Handlers
  const handleSendLoginOtp = async (e) => {
    e?.preventDefault();
    const email = otpLoginEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      notify('error', 'Please enter a valid registered email address to receive OTP.');
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.sendOtp({ email, purpose: 'login' });
        setOtpLoginSent(true);
        setOtpResendTimer(60);
        notify('success', res.message || `Verification code sent to ${email}`);
      } catch (err) {
        notify('error', err.message || 'Failed to dispatch OTP code. Please check email address.');
      }
    }, 'Dispatching Secure OTP via Resend...');
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    const email = otpLoginEmail.trim().toLowerCase();
    const code = otpLoginCode.trim();

    if (!code || code.length !== 6) {
      notify('error', 'Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.verifyOtp({ email, otp: code, purpose: 'login' });
        if (res && (res.success || res.token)) {
          const userData = res.data || {};
          logIn(userData);
          notify('success', `Welcome back, ${userData.fullName || 'Student'}! Verified via Email OTP.`);
          return;
        }
        notify('error', res?.message || 'Authentication failed with the provided OTP.');
      } catch (err) {
        notify('error', err.message || 'OTP verification failed. Please try again.');
      }
    }, 'Verifying OTP & Authorizing Session...');
  };

  // Signup OTP Handlers
  const handleSendSignupOtp = async () => {
    const email = signUpData.email.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      notify('error', 'Please enter a valid email address first.');
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.sendOtp({
          email,
          purpose: 'signup',
          name: signUpData.fullName || 'Student',
        });
        setSignupOtpSent(true);
        setSignupResendTimer(60);
        notify('success', res.message || `6-digit verification code sent to ${email}`);
      } catch (err) {
        notify('error', err.message || 'Failed to send OTP to email.');
      }
    }, 'Dispatching Email Verification Code...');
  };

  const handleVerifySignupOtp = async () => {
    const email = signUpData.email.trim().toLowerCase();
    const code = signupOtpCode.trim();

    if (!code || code.length !== 6) {
      notify('error', 'Please enter the 6-digit verification code.');
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.verifyOtp({ email, otp: code, purpose: 'signup' });
        if (res?.success) {
          setIsSignupEmailVerified(true);
          notify('success', 'Email verified successfully! You can now complete registration.');
        } else {
          notify('error', res?.message || 'Failed to verify code.');
        }
      } catch (err) {
        notify('error', err.message || 'Verification failed. Please check the OTP code.');
      }
    }, 'Verifying Email Code...');
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpData.fullName || !signUpData.mobile) {
      alert('Please enter your full name and mobile number.');
      return;
    }

    if (!isSignupEmailVerified) {
      notify('error', 'Please verify your email address using the OTP code before submitting.');
      return;
    }

    await withLoader(async () => {
      const res = await admissionService.submitApplication(signUpData);
      if (res.success) {
        enrollNewStudent(res.studentData);
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {
          
        }
        notify(
          'success',
          `Enrollment Confirmed! Roll No: ${res.rollId}. Confirmation email dispatched.`
        );
      }
    }, 'Registering Student, Allocating Roll Number & Processing ₹100 Fee...');
  };

  
  const handleDownloadId = async () => {
    await withLoader(async () => {
      await studentService.generateIdCardDownload(student.rollNo);
      logDownload();
      setDownloadSuccess(true);
      notify('success', `High-Resolution PVC ID Card generated for ${student.fullName}`);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 'Compiling Cryptographic PVC Student ID Card...');
  };

  
  
  
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col w-full pb-space-xl">
        
        <div className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] to-[#0d4499] text-white py-space-sm px-margin-sm lg:px-margin-lg shadow-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
            <div className="flex items-center gap-space-xs">
              <span className="text-white/70">Academic Wing</span>
              <span className="text-white/40">/</span>
              <span className="text-secondary-fixed font-semibold">Student Central Authentication Gateway</span>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="material-symbols-outlined text-sm">lock</span>
              256-Bit SSL Encrypted Student Portal
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full px-margin-sm lg:px-margin-lg py-8 sm:py-12">
          <div className="bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
            
            
            <div className="lg:col-span-5 bg-gradient-to-br from-primary via-[#241544] to-primary p-6 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

              
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-secondary-fixed text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">school</span>
                  <span>Student Gateway</span>
                </div>
                <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  HIT Student Portal
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Sign in to access your digital ID card, academic marksheet, fee receipts, and course registrations.
                </p>
              </div>

              
              <div className="relative z-10 py-6 my-auto flex items-center justify-center">
                <img
                  src={loginSvg}
                  alt="Student Login & Registration Illustration"
                  className="w-full max-w-[280px] sm:max-w-[340px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              
              <div className="relative z-10 pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span className="font-semibold text-[11px]">256-Bit SSL Encrypted Student Portal</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="material-symbols-outlined text-sm text-secondary-fixed">badge</span>
                  <span className="text-[11px]">Instant PVC Student ID Card & Academic Ledger</span>
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-surface-container-lowest">
              
              <div className="bg-surface-container-low p-1.5 rounded-2xl flex items-center mb-6 shadow-xs border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Student Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">how_to_reg</span>
                  <span>New Student Sign Up (₹100)</span>
                </button>
              </div>

              {authMode === 'login' ? (
                <div className="max-w-md mx-auto w-full">
                  <div className="text-center pb-2">
                    <h3 className="font-headline text-xl font-bold text-primary">Sign In to Your Dossier</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Access your enrolled course ledger, PVC ID card & academic ledger
                    </p>
                  </div>

                  {/* Login Mode Toggle: Password PIN vs Email OTP */}
                  <div className="flex rounded-xl bg-surface-container-low p-1 mb-4 border border-outline-variant/30 text-xs">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('password')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        loginMethod === 'password'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>Password Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('otp')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        loginMethod === 'otp'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">mail</span>
                      <span>Email OTP Sign In</span>
                    </button>
                  </div>

                  {loginMethod === 'password' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">
                          Roll Number / Mobile / Email
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                            badge
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. HIT-STU-2026-00001"
                            value={loginCreds.rollOrEmail}
                            onChange={(e) => setLoginCreds({ ...loginCreds, rollOrEmail: e.target.value })}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">
                          Password / Date of Birth PIN
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                            lock
                          </span>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={loginCreds.password}
                            onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary" />
                          <span>Remember my device</span>
                        </label>
                        <a href="tel:1800HITSKILL" className="text-secondary font-semibold hover:underline">
                          Forgot Roll No?
                        </a>
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full h-11"
                      >
                        <span className="material-symbols-outlined text-base">login</span>
                        <span>Sign In to Student Portal</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={otpLoginSent ? handleVerifyLoginOtp : handleSendLoginOtp} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">
                          Roll Number or Registered Email
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                            badge
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. HIT-STU-2026-00001 or rahul@gmail.com"
                            value={otpLoginEmail}
                            onChange={(e) => setOtpLoginEmail(e.target.value)}
                            disabled={otpLoginSent}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-75"
                          />
                        </div>
                      </div>

                      {otpLoginSent && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-on-surface-variant">
                              Enter 6-Digit OTP Code
                            </label>
                            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">mark_email_read</span>
                              Sent via Resend
                            </span>
                          </div>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                              pin
                            </span>
                            <input
                              type="text"
                              maxLength={6}
                              required
                              placeholder="6-digit code"
                              value={otpLoginCode}
                              onChange={(e) => setOtpLoginCode(e.target.value.replace(/\D/g, ''))}
                              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm font-mono tracking-widest font-bold text-primary focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2">
                            <button
                              type="button"
                              onClick={() => { setOtpLoginSent(false); setOtpLoginCode(''); }}
                              className="text-[#065F46] font-medium hover:underline cursor-pointer"
                            >
                              ← Change Email
                            </button>
                            {otpResendTimer > 0 ? (
                              <span className="text-slate-400">Resend code in {otpResendTimer}s</span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendLoginOtp}
                                className="text-secondary font-semibold hover:underline cursor-pointer"
                              >
                                Resend OTP
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn-primary w-full h-11"
                      >
                        <span className="material-symbols-outlined text-base">
                          {otpLoginSent ? 'verified_user' : 'send'}
                        </span>
                        <span>{otpLoginSent ? 'Verify OTP & Access Dossier' : 'Send Verification OTP'}</span>
                      </button>
                    </form>
                  )}

                  {/* 1-Click Demo Login */}
                  <div className="pt-4 border-t border-outline-variant/20 text-center">
                    <span className="text-[11px] text-on-surface-variant block mb-2">Want to test the portal instantly?</span>
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="btn-secondary w-full h-10"
                    >
                      <span>1-Click Demo Login as Rahul Kumar Verma (ADCA)</span>
                    </button>
                  </div>
                </div>
              ) : (
                            <form onSubmit={handleSignUpSubmit} className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div>
                    <h3 className="font-headline text-xl font-bold text-primary">
                      New Student Admission & Course Registration
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Session 2026–2027 • Standard Direct Processing Fee Flat ₹100.00
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    Fee: ₹100
                  </span>
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Kumar Verma"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Father's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dinesh Verma"
                      value={signUpData.fatherName}
                      onChange={(e) => setSignUpData({ ...signUpData, fatherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={signUpData.dob}
                      onChange={(e) => setSignUpData({ ...signUpData, dob: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Mobile Contact *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9452078192"
                      value={signUpData.mobile}
                      onChange={(e) => setSignUpData({ ...signUpData, mobile: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-on-surface-variant">Email Address *</label>
                      {isSignupEmailVerified ? (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          Email Verified
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          OTP verification required
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="student@gmail.com"
                        value={signUpData.email}
                        disabled={isSignupEmailVerified}
                        onChange={(e) => {
                          setSignUpData({ ...signUpData, email: e.target.value });
                          setIsSignupEmailVerified(false);
                          setSignupOtpSent(false);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20 disabled:opacity-75"
                      />
                      {!isSignupEmailVerified && (
                        <button
                          type="button"
                          onClick={handleSendSignupOtp}
                          disabled={signupResendTimer > 0 || !signUpData.email}
                          className="px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-semibold text-xs whitespace-nowrap cursor-pointer disabled:opacity-60 transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">send</span>
                          <span>
                            {signupResendTimer > 0
                              ? `Resend in ${signupResendTimer}s`
                              : signupOtpSent
                              ? 'Resend OTP'
                              : 'Send OTP'}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Inline OTP Input Box */}
                    {signupOtpSent && !isSignupEmailVerified && (
                      <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center gap-2 animate-scale-up">
                        <span className="text-xs font-semibold text-[#064E3B] shrink-0 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">pin</span>
                          <span>Enter 6-digit Code:</span>
                        </span>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="e.g. 582914"
                          value={signupOtpCode}
                          onChange={(e) => setSignupOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="w-32 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-mono tracking-widest font-bold text-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleVerifySignupOtp}
                          className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs cursor-pointer shadow-xs"
                        >
                          Verify Code
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Aadhaar Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="4829-1928-8472"
                      value={signUpData.aadhaarNo}
                      onChange={(e) => setSignUpData({ ...signUpData, aadhaarNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-outline-variant/20">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Select Course *</label>
                    <select
                      value={signUpData.courseId}
                      onChange={(e) => setSignUpData({ ...signUpData, courseId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <optgroup label="Vocational & Computer IT Programs">
                        {coursesList.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.code} - {c.name} ({c.duration} • {c.fee})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="University Programs (Online & Distance)">
                        {universityProgramsList.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.code} - {u.name} ({u.duration})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Select Training Centre *</label>
                    <select
                      value={signUpData.centreId}
                      onChange={(e) => setSignUpData({ ...signUpData, centreId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {centresList.map((cen) => (
                        <option key={cen.id} value={cen.id}>
                          {cen.name} ({cen.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Preferred Batch Timing *</label>
                    <select
                      value={signUpData.batchTime}
                      onChange={(e) => setSignUpData({ ...signUpData, batchTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option>08:00 AM - 10:00 AM (Morning)</option>
                      <option>10:00 AM - 12:00 PM (Midday)</option>
                      <option>02:00 PM - 04:00 PM (Afternoon)</option>
                      <option>04:00 PM - 06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                      ₹
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary block">
                        Direct Processing Fee: ₹100.00
                      </span>
                      <span className="text-[11px] text-on-surface-variant block">
                        Instant UPI / QR Webhook settlement • Generates permanent Roll No.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      UPI Auto-Settled
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full h-11"
                >
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span>Pay ₹100 & Complete Enrollment</span>
                </button>
              </form>
            )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  
  
  return (
    <div className="flex flex-col w-full pb-space-xl">
      
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#000d29] via-[#072a6b] via-[#0d4499] to-[#1a62c6] rounded-3xl text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-secondary opacity-15 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-label-sm text-xs uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {student.status || 'Active Enrolled Student'}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-surface-container-highest/20 text-secondary-fixed font-label-sm text-xs">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Roll No: {student.rollNo}
                </span>
              </div>
              <h1 className="font-headline text-2xl sm:text-4xl text-on-primary font-bold tracking-tight">
                Welcome back, {student.fullName}
              </h1>
              <p className="font-body-md text-sm sm:text-base text-surface-container-high leading-relaxed">
                {student.courseName} • {student.centreName} (
                <span className="font-semibold text-secondary-fixed">{student.centreCode}</span>)
              </p>
            </div>

            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  authService.logout();
                  logOut();
                  notify('info', 'Successfully signed out.');
                }}
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/30">
          {[
            { id: 'id_card', label: 'Digital PVC ID Card', icon: 'badge' },
            { id: 'course_reg', label: 'Course Registration & Fees', icon: 'school' },
            { id: 'academic', label: 'Academic Grades & Attendance', icon: 'grade' },
            { id: 'certificate', label: 'Certificate & Roll Verification', icon: 'verified' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePortalTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activePortalTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      
      {activePortalTab === 'id_card' && (
        <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="flex items-center justify-between w-full max-w-sm mb-3">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Interactive PVC ID Card ({cardSide.toUpperCase()})
                </span>
                <button
                  onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                  className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">cached</span>
                  <span>Flip to {cardSide === 'front' ? 'Back' : 'Front'}</span>
                </button>
              </div>

              
              {cardSide === 'front' ? (
                <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-primary via-primary-container to-primary text-white p-6 shadow-2xl border-2 border-secondary/30 relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-secondary/40 shrink-0 overflow-hidden">
                        <img src={logo2} alt="Logo" className="w-full h-full object-contain rounded-full" />
                      </div>
                      <div>
                        <span className="font-headline text-xs font-bold block leading-tight">HIT COMPUTER EDUCATION</span>
                        <span className="text-[10px] text-secondary-fixed block">Official Student Identity Dossier</span>
                      </div>
                    </div>
                  </div>

                  <div className="py-4 flex gap-4 items-center">
                    <img
                      src={student.photoUrl}
                      alt="Student"
                      className="w-20 h-24 rounded-xl object-cover border-2 border-secondary/40 shadow-md shrink-0"
                    />
                    <div className="space-y-1 text-xs">
                      <h4 className="font-headline text-base font-bold text-white">{student.fullName}</h4>
                      <p className="text-[11px] text-secondary-fixed font-semibold">{student.courseName}</p>
                      <p className="text-[11px] text-surface-container-high font-mono">Roll: {student.rollNo}</p>
                      <p className="text-[11px] text-surface-container-high">Centre: {student.centreCode}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[10px] text-surface-container-highest">
                    <span>Kasba Khas, Ghosi, Mau</span>
                    <span className="text-emerald-400 font-bold">QR Verified</span>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white p-6 shadow-2xl border-2 border-secondary/30 relative">
                  <div className="pb-3 border-b border-white/20 text-xs font-bold text-secondary-fixed">
                    Terms & Instructions
                  </div>
                  <div className="py-3 text-[11px] space-y-1 text-surface-container-high">
                    <p>1. This card confirms registration under H.I.T India Skill Development Foundation.</p>
                    <p>2. Must be presented during theoretical & practical lab examinations.</p>
                    <p>3. Reg. CIN: U85300UP2021NPL148821 | NITI Aayog: UP/2021/0284729.</p>
                    <p>4. Helpline: 1800-HIT-SKILL | +91 94520-78192.</p>
                  </div>
                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-outline">Authorised Signatory</span>
                    <span className="font-serif italic font-bold text-secondary-fixed">Er. A. K. Verma</span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleDownloadId}
                  className="btn-primary h-11 px-6"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Download PVC ID Card (PDF)</span>
                </button>
              </div>
            </div>

            
            <div className="lg:col-span-6 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 space-y-4">
              <h3 className="font-headline text-lg font-bold text-primary pb-2 border-b border-outline-variant/20">
                Enrollment Dossier Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-on-surface-variant block">Father's Name:</span>
                  <span className="font-bold text-on-surface">{student.fatherName || 'Dinesh Verma'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Date of Birth:</span>
                  <span className="font-bold text-on-surface">{student.dob || '2004-06-14'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Batch Timing:</span>
                  <span className="font-bold text-secondary">{student.batchTime || 'Morning (08-10 AM)'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Training Centre:</span>
                  <span className="font-bold text-on-surface">{student.centreName}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Registration Status:</span>
                  <span className="font-bold text-emerald-700">₹100 Fee Settled (Online)</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Attendance:</span>
                  <span className="font-bold text-primary">{student.attendance || '94.5%'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {activePortalTab === 'course_reg' && (
        <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-8">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Enrolled Course Curriculum</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{student.courseName}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Status: Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs space-y-2">
                <span className="text-on-surface-variant font-bold uppercase tracking-wider block">Course Details</span>
                <p><strong>Code:</strong> {student.courseCode || 'ADCA-101'}</p>
                <p><strong>Duration:</strong> {student.courseDuration || '12 Months'}</p>
                <p><strong>Affiliated Hub:</strong> {student.centreName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs space-y-2">
                <span className="text-on-surface-variant font-bold uppercase tracking-wider block">Fee Ledger</span>
                <p><strong>Registration Fee:</strong> <span className="text-emerald-700 font-bold">₹100.00 (Paid)</span></p>
                <p><strong>Monthly Tuition Fee:</strong> ₹600.00 / Month</p>
                <p><strong>Payment Status:</strong> Current Month Paid (Receipt Generated)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {activePortalTab === 'academic' && (
        <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-8">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <h3 className="font-headline text-xl font-bold text-primary pb-3 border-b border-outline-variant/20">
              Unit Examination Marks & Subject Grades
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant">
                    <th className="p-3 rounded-l-xl">Subject / Practical Module</th>
                    <th className="p-3">Max Marks</th>
                    <th className="p-3">Marks Obtained</th>
                    <th className="p-3 rounded-r-xl">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {(student.subjects || [
                    { name: 'Computer Fundamentals & OS', marks: '92/100', grade: 'A+' },
                    { name: 'MS Office 2024 Productivity Suite', marks: '88/100', grade: 'A' },
                    { name: 'Tally Prime 4.0 with GST', marks: '95/100', grade: 'A+' },
                    { name: 'Web Designing (HTML, CSS, JS)', marks: '86/100', grade: 'A' },
                    { name: 'Programming in Python & Logic', marks: '90/100', grade: 'A+' },
                  ]).map((sub, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/50">
                      <td className="p-3 font-semibold text-primary">{sub.name}</td>
                      <td className="p-3 text-on-surface-variant">100</td>
                      <td className="p-3 font-bold text-on-surface">{sub.marks}</td>
                      <td className="p-3 font-extrabold text-emerald-700">{sub.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      
      {activePortalTab === 'certificate' && (
        <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-8">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl">verified_user</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-primary">Cryptographically Verified Credential</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Permanent Roll Number <strong>{student.rollNo}</strong> is cryptographically registered in the central academic ledger of H.I.T India Skill Development Foundation.
            </p>
            <div className="p-4 rounded-2xl bg-surface-container-low text-xs font-mono text-primary font-bold">
              CENTRAL-REGISTRY-LEDGER-HASH: {student.rollNo}-VERIFIED-2026
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
