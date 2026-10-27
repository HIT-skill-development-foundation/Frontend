import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent, useLoader } from '../store/hooks';
import { authService } from '../services/hitApi';
import loginSvg from '../assets/images/Login.svg';

export default function StudentPortalPage() {
  const navigate = useNavigate();
  const { student, isLoggedIn, logIn, logOut } = useStudent();
  const { withLoader, notify } = useLoader();

  // Error state for prominent feedback
  const [loginError, setLoginError] = useState(null);

  // Email & OTP login state
  const [otpLoginEmail, setOtpLoginEmail] = useState('');
  const [otpLoginCode, setOtpLoginCode] = useState('');
  const [otpLoginSent, setOtpLoginSent] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  // Profile navigation tabs: 'profile' | 'academic' | 'fee'
  const [activePortalTab, setActivePortalTab] = useState('profile');

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (otpResendTimer > 0) {
      timer = setInterval(() => setOtpResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpResendTimer]);

  // Send OTP for student login
  const handleSendLoginOtp = async (e) => {
    e?.preventDefault();
    setLoginError(null);
    const email = otpLoginEmail.trim().toLowerCase();

    if (!email || !email.includes('@')) {
      const msg = 'Please enter your registered email address.';
      setLoginError(msg);
      notify('error', msg);
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.sendOtp({ email, purpose: 'login' });
        setOtpLoginSent(true);
        setOtpResendTimer(60);
        setLoginError(null);
        notify('success', res.message || `Verification code sent to ${email}`);
      } catch (err) {
        const errMsg = err.message || 'Failed to dispatch verification code. Please check your email address.';
        setLoginError(errMsg);
        notify('error', errMsg);
      }
    }, 'Dispatching Secure OTP Code...');
  };

  // Verify OTP & log in
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setLoginError(null);
    const email = otpLoginEmail.trim().toLowerCase();
    const code = otpLoginCode.trim();

    if (!code || code.length !== 6) {
      const msg = 'Please enter the 6-digit OTP code received on your registered email.';
      setLoginError(msg);
      notify('error', msg);
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.verifyOtp({ email, otp: code, purpose: 'login' });
        if (res && (res.success || res.token)) {
          const userData = res.data || {};
          logIn(userData);
          setLoginError(null);
          notify('success', `Welcome back, ${userData.fullName || 'Candidate'}!`);
          return;
        }
        const errMsg = res?.message || 'Authentication failed. Please check the OTP code.';
        setLoginError(errMsg);
        notify('error', errMsg);
      } catch (err) {
        const errMsg = err.message || 'Invalid or expired OTP code. Please try again.';
        setLoginError(errMsg);
        notify('error', errMsg);
      }
    }, 'Verifying OTP & Authorizing Session...');
  };

  const handleSignOut = () => {
    authService.logout();
    logOut();
    setOtpLoginSent(false);
    setOtpLoginCode('');
    notify('info', 'Successfully signed out from Student Portal.');
  };

  // -------------------------------------------------------------
  // 1. UNAUTHENTICATED STATE: EMAIL + OTP SIGN-IN ONLY
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col w-full pb-space-xl">
        {/* Top Institutional Header */}
        <div className="w-full bg-[#001030] text-white py-2.5 px-4 lg:px-8 border-b border-white/10">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white/70">Academic Wing</span>
              <span className="text-white/40">/</span>
              <span className="text-secondary-fixed font-semibold">Student Portal Authentication</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="material-symbols-outlined text-sm">lock</span>
              Verified Student Gateway
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
          <div className="bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
            {/* Left Institutional Branding */}
            <div className="lg:col-span-5 bg-[#00163d] p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-secondary-fixed text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span>Enrolled Student Portal</span>
                </div>
                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Student Portal
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Sign in with your registered email and secure OTP to view your admission dossier, batch timing, academic curriculum, and fee records.
                </p>
              </div>

              <div className="relative z-10 py-6 my-auto flex items-center justify-center">
                <img
                  src={loginSvg}
                  alt="Student Portal Access"
                  className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain drop-shadow-xl"
                />
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span className="font-semibold text-[11px]">Passwordless Email OTP Security</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="material-symbols-outlined text-sm text-secondary-fixed">school</span>
                  <span className="text-[11px]">ISO 9001:2015 & NITI Aayog Verified</span>
                </div>
              </div>
            </div>

            {/* Right Login Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-surface-container-lowest">
              <div className="max-w-md mx-auto w-full">
                <div className="pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Official Candidate Access
                  </span>
                  <h3 className="font-['Fraunces'] text-2xl font-bold text-primary mt-0.5">
                    Sign In to Your Dossier
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Enter your registered email address to receive a 6-digit verification code.
                  </p>
                </div>

                {/* Inline Error Alert Banner */}
                {loginError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <span className="material-symbols-outlined text-base text-red-600 shrink-0 mt-0.5">
                      error
                    </span>
                    <div className="flex-1">
                      <strong className="block font-semibold">Sign In Notice</strong>
                      <span>{loginError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLoginError(null)}
                      className="text-red-400 hover:text-red-700 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}

                {/* Single Form: Email + OTP */}
                <form onSubmit={otpLoginSent ? handleVerifyLoginOtp : handleSendLoginOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">
                      Registered Candidate Email <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                        mail
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={otpLoginEmail}
                        onChange={(e) => {
                          setOtpLoginEmail(e.target.value);
                          if (loginError) setLoginError(null);
                        }}
                        disabled={otpLoginSent}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-75 focus:outline-none"
                      />
                    </div>
                  </div>

                  {otpLoginSent && (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-on-surface-variant">
                          Enter 6-Digit Verification Code <span className="text-error">*</span>
                        </label>
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">mark_email_read</span>
                          Sent via Email
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
                          onChange={(e) => {
                            setOtpLoginCode(e.target.value.replace(/\D/g, ''));
                            if (loginError) setLoginError(null);
                          }}
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm font-mono tracking-widest font-bold text-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          autoFocus
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpLoginSent(false);
                            setOtpLoginCode('');
                            setLoginError(null);
                          }}
                          className="text-[#065F46] font-medium hover:underline cursor-pointer"
                        >
                          ← Change Email
                        </button>
                        {otpResendTimer > 0 ? (
                          <span className="text-slate-400">Resend in {otpResendTimer}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendLoginOtp}
                            className="text-secondary font-semibold hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full h-11 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-base">
                      {otpLoginSent ? 'verified_user' : 'send'}
                    </span>
                    <span>{otpLoginSent ? 'Verify OTP & Access Profile' : 'Send Verification OTP'}</span>
                  </button>
                </form>

                {/* Fresh Admission Guidance Card */}
                <div className="mt-8 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5">
                    how_to_reg
                  </span>
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-primary">New Student? Apply for Online Admission</p>
                    <p className="text-on-surface-variant text-[11px] mt-0.5 leading-relaxed">
                      If you haven't enrolled yet, please complete your admission registration through the online portal.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/admission')}
                      className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Proceed to Online Admission Form</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED STATE: STUDENT PROFILE & DOSSIER DASHBOARD
  // -------------------------------------------------------------
  const regNo = student.admissionNo || student.regId || student.regNo || 'HIT-ADM-2026';
  const candidateInitials = (student.fullName || 'S')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#000d29] via-[#072a6b] to-[#134994] rounded-3xl text-white p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-secondary/50 shadow-md shrink-0 bg-white"
                />
              ) : (
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center text-xl sm:text-2xl font-bold font-['Fraunces'] text-secondary-fixed shrink-0">
                  {candidateInitials}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {student.status || 'Active Enrolled Student'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/10 text-secondary-fixed text-xs font-mono font-bold">
                    Reg No: {regNo}
                  </span>
                </div>
                <h1 className="font-['Fraunces'] text-2xl sm:text-3xl text-white font-bold tracking-tight">
                  {student.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  {student.courseName} • <span className="text-secondary-fixed font-semibold">{student.centreName || 'Ghosi Main Campus (HQ)'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSignOut}
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/30">
          {[
            { id: 'profile', label: 'Student Profile & Dossier', icon: 'person' },
            { id: 'academic', label: 'Academic Curriculum & Marks', icon: 'school' },
            { id: 'fee', label: 'Fee & Registration Ledger', icon: 'receipt_long' },
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

      {/* Tab 1: Student Profile & Dossier */}
      {activePortalTab === 'profile' && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Personal Dossier Card */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-2xl">account_circle</span>
                  <h3 className="font-['Fraunces'] text-lg font-bold text-primary">
                    Personal Identity Record
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  Verified Identity
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Candidate Legal Name</span>
                  <span className="font-bold text-primary text-sm mt-0.5 block">{student.fullName || '—'}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Application / Registration No.</span>
                  <span className="font-bold font-mono text-secondary text-sm mt-0.5 block">{regNo}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Father's / Guardian's Name</span>
                  <span className="font-bold text-on-surface mt-0.5 block">{student.fatherName || '—'}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Mother's Name</span>
                  <span className="font-bold text-on-surface mt-0.5 block">{student.motherName || '—'}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Date of Birth</span>
                  <span className="font-bold text-on-surface mt-0.5 block">{student.dob || '—'}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Gender & Category</span>
                  <span className="font-bold text-on-surface mt-0.5 block">
                    {student.gender || 'Male'} • {student.category || 'General'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 sm:col-span-2">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Registered Contact Details</span>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-xs">
                    <span className="font-semibold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                      {student.email}
                    </span>
                    {student.mobile && (
                      <span className="font-semibold text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-secondary">phone_iphone</span>
                        {student.mobile}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 sm:col-span-2">
                  <span className="text-on-surface-variant block text-[11px] font-medium">Permanent Address</span>
                  <span className="font-medium text-on-surface mt-0.5 block leading-relaxed">
                    {student.address?.line || student.address || 'Kasba Khas'}, {student.address?.district || student.district || 'Mau'}, {student.address?.state || student.state || 'Uttar Pradesh'} - {student.address?.pincode || student.pincode || '275105'}
                  </span>
                </div>
              </div>
            </div>

            {/* Enrolled Program & Campus Card */}
            <div className="lg:col-span-5 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-2xl">school</span>
                <h3 className="font-['Fraunces'] text-lg font-bold text-primary">
                  Academic Program & ATC
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-secondary font-bold uppercase tracking-wider text-[10px] block">
                    Enrolled Program
                  </span>
                  <h4 className="font-bold text-primary text-sm mt-0.5">{student.courseName}</h4>
                  <p className="text-on-surface-variant text-xs mt-1">
                    Duration: <strong>{student.courseDuration || '3 Months'}</strong> • Code: <strong>{student.courseCode || 'CCC'}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-secondary font-bold uppercase tracking-wider text-[10px] block">
                    Authorized Training Centre (ATC)
                  </span>
                  <h4 className="font-bold text-on-surface text-sm mt-0.5">
                    {student.centreName || 'Ghosi Main Campus (HQ)'}
                  </h4>
                  <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                    Kasba Khas, Ghosi, Mau, Uttar Pradesh - 275105
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-white border border-outline-variant/40 text-[11px] font-mono font-bold text-primary">
                    Centre ID: {student.centreCode || 'HIT-CEN-0001'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-on-surface-variant block text-[11px]">Batch Timing:</span>
                    <span className="font-bold text-primary block mt-0.5">{student.batchTime || 'Morning (08:00 AM – 10:00 AM)'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-on-surface-variant block text-[11px]">Academic Session:</span>
                    <span className="font-bold text-primary block mt-0.5">2026–2027</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700 text-lg shrink-0">verified</span>
                  <span>Registered under H.I.T India Skill Development Foundation (NITI Aayog & ISO 9001:2015).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Academic Curriculum & Marks */}
      {activePortalTab === 'academic' && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-outline-variant/20 gap-3">
              <div>
                <h3 className="font-['Fraunces'] text-xl font-bold text-primary">
                  Academic Modules & Performance Evaluation
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Continuous performance tracking and unit exam assessments for {student.courseName}.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">done_all</span>
                  Attendance: {student.attendance || '100% Verified'}
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary-container text-secondary text-xs font-bold">
                  Overall: {student.overallGrade || 'A+'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold">
                    <th className="p-3 rounded-l-xl">Curriculum / Practical Module</th>
                    <th className="p-3">Max Marks</th>
                    <th className="p-3">Marks Obtained</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {(student.subjects && student.subjects.length > 0 ? student.subjects : [
                    { name: 'Computer Fundamentals & OS', marks: '92/100', grade: 'A+' },
                    { name: 'Office Productivity Tools (Word, Excel, PPT)', marks: '88/100', grade: 'A' },
                    { name: 'Financial Accounting & Digital Payment Systems', marks: '95/100', grade: 'A+' },
                    { name: 'Internet Applications & Cyber Ethics', marks: '90/100', grade: 'A+' },
                  ]).map((sub, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-3 font-semibold text-primary">{sub.name}</td>
                      <td className="p-3 text-on-surface-variant">100</td>
                      <td className="p-3 font-bold text-on-surface">{sub.marks}</td>
                      <td className="p-3 font-extrabold text-emerald-700">{sub.grade}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Fee & Registration Ledger */}
      {activePortalTab === 'fee' && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div>
                <h3 className="font-['Fraunces'] text-xl font-bold text-primary">
                  Registration & Fee Ledger
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Official financial settlement ledger for candidate enrollment.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Status: Settled & Cleared
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs space-y-3">
                <span className="text-secondary font-bold uppercase tracking-wider text-[11px] block">
                  Admission Fee Summary
                </span>
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Nominal Registration Fee:</span>
                  <span className="font-bold text-emerald-700 text-sm">₹100.00</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Payment Method:</span>
                  <span className="font-semibold text-on-surface">Online UPI / Net Banking</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Settlement State:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Payment Cleared
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs space-y-3">
                <span className="text-secondary font-bold uppercase tracking-wider text-[11px] block">
                  Central Registry Audit
                </span>
                <p className="text-on-surface-variant leading-relaxed">
                  Your registration fee of ₹100.00 has been verified and permanently linked to registration ledger <strong>{regNo}</strong>.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-slate-500 block">Authorized By:</span>
                  <span className="font-bold text-primary">Central Admissions Desk, Ghosi Main Campus (HQ)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
