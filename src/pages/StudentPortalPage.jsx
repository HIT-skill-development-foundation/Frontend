import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useStudent, useLoader } from '../store/hooks';
import studentService from '../services/studentService';
import admissionService from '../services/admissionService';
import { coursesList, universityProgramsList, centresList, initialStudentData } from '../data/mockData';
import logo2 from '../assets/images/logo2.jpeg';
import loginSvg from '../assets/images/Login.svg';

export default function StudentPortalPage() {
  const { student, isLoggedIn, logIn, logOut, enrollNewStudent, logDownload } = useStudent();
  const { withLoader, notify } = useLoader();

  // Auth gate state (when not logged in)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Login form state
  const [loginCreds, setLoginCreds] = useState({
    rollOrEmail: 'HIT-STU-2026-00001',
    password: 'password123',
  });

  // Sign up / Registration form state
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    fatherName: '',
    dob: '2004-06-14',
    gender: 'Male',
    category: 'OBC',
    mobile: '',
    email: '',
    address: 'Kasba Khas, Ward 4',
    district: 'Mau',
    state: 'Uttar Pradesh',
    courseId: 'adca',
    centreId: 'HIT-CEN-0001',
    batchTime: '08:00 AM - 10:00 AM (Morning)',
    qualification: '12th Pass',
    aadhaarNo: '4829-1928-8472',
    paymentMode: 'upi',
  });

  // Authenticated Dashboard Sub-tabs
  const [activePortalTab, setActivePortalTab] = useState('id_card'); // 'id_card' | 'course_reg' | 'academic' | 'certificate'
  const [cardSide, setCardSide] = useState('front'); // 'front' | 'back'
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      logIn({
        ...initialStudentData,
        rollNo: loginCreds.rollOrEmail.toUpperCase().includes('HIT')
          ? loginCreds.rollOrEmail.toUpperCase()
          : 'HIT-STU-2026-00001',
      });
      notify('success', `Welcome back, ${student.fullName || 'Rahul Verma'}!`);
    }, 'Authenticating Student with Central NITI Aayog Ledger...');
  };

  // Demo Quick Login
  const handleDemoLogin = async () => {
    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      logIn(initialStudentData);
      notify('success', 'Logged in as Rahul Kumar Verma (ADCA)');
    }, 'Accessing Student Dossier...');
  };

  // Handle Student Registration & Payment (Sign Up)
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpData.fullName || !signUpData.mobile) {
      alert('Please enter your full name and mobile number.');
      return;
    }

    await withLoader(async () => {
      const res = await admissionService.submitApplication(signUpData);
      if (res.success) {
        enrollNewStudent(res.studentData);
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
        notify(
          'success',
          `Enrollment Confirmed! Roll No: ${res.rollId}. Registration fee of ₹100 Settled.`
        );
      }
    }, 'Registering Student, Allocating Roll Number & Processing ₹100 Fee...');
  };

  // Handle ID Card Download
  const handleDownloadId = async () => {
    await withLoader(async () => {
      await studentService.generateIdCardDownload(student.rollNo);
      logDownload();
      setDownloadSuccess(true);
      notify('success', `High-Resolution PVC ID Card generated for ${student.fullName}`);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 'Compiling Cryptographic PVC Student ID Card...');
  };

  // ==========================================
  // VIEW 1: UNAUTHENTICATED LOGIN / SIGN UP GATE
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col w-full pb-space-xl">
        {/* Header Ribbon */}
        <div className="w-full bg-primary text-on-primary py-space-sm px-margin-sm lg:px-margin-lg shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
            <div className="flex items-center gap-space-xs">
              <span className="text-on-primary/70">Academic Wing</span>
              <span className="text-on-primary/40">/</span>
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
            
            {/* LEFT HALF: Login.svg Illustration & Branding */}
            <div className="lg:col-span-5 bg-gradient-to-br from-primary via-[#241544] to-primary p-6 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Top Branding */}
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

              {/* Center SVG Vector Illustration */}
              <div className="relative z-10 py-6 my-auto flex items-center justify-center">
                <img
                  src={loginSvg}
                  alt="Student Login & Registration Illustration"
                  className="w-full max-w-[280px] sm:max-w-[340px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Trust Badges */}
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

            {/* RIGHT HALF: Form & Tab Controls */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-surface-container-lowest">
              {/* Tab Selector: Login vs Sign Up */}
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
                /* LOGIN TAB */
                <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto w-full space-y-4">
                  <div className="text-center pb-2">
                    <h3 className="font-headline text-xl font-bold text-primary">Sign In to Your Dossier</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Enter your Permanent Roll Number or registered Mobile/Email
                    </p>
                  </div>

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
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Sign In to Student Portal</span>
                </button>

                {/* 1-Click Quick Demo Login */}
                <div className="pt-4 border-t border-outline-variant/20 text-center">
                  <span className="text-[11px] text-on-surface-variant block mb-2">Want to test the portal instantly?</span>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full py-2.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-xs transition-colors cursor-pointer border border-secondary/30 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">bolt</span>
                    <span>1-Click Demo Login as Rahul Kumar Verma (ADCA)</span>
                  </button>
                </div>
              </form>
            ) : (
              /* SIGN UP / COURSE REGISTRATION TAB */
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

                {/* Personal Details */}
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

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                    />
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

                {/* Course & Centre Allocation */}
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

                {/* Payment Simulation Section */}
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
                  className="w-full h-12 rounded-xl bg-tertiary-container hover:bg-primary text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
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

  // ==========================================
  // VIEW 2: AUTHENTICATED STUDENT PORTAL DASHBOARD
  // ==========================================
  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Welcome Dossier Header */}
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-6">
        <div className="relative overflow-hidden bg-primary rounded-3xl text-on-primary p-6 sm:p-8 shadow-xl">
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

            {/* Logout button */}
            <div className="flex items-center gap-3">
              <button
                onClick={logOut}
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-portal Navigation Tabs */}
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

      {/* Tab 1: DIGITAL PVC ID CARD */}
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

              {/* CARD PREVIEW */}
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
                  className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Download PVC ID Card (PDF)</span>
                </button>
              </div>
            </div>

            {/* Quick Summary Pod */}
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

      {/* Tab 2: COURSE REGISTRATION & FEES */}
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

      {/* Tab 3: ACADEMIC GRADES & ATTENDANCE */}
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

      {/* Tab 4: CERTIFICATE & ROLL VERIFICATION */}
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
