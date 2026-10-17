import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useStudent, useLoader } from '../store/hooks';
import admissionService from '../services/admissionService';
import { coursesList, centresList } from '../data/mockData';

export default function AdmissionPage({ setActiveTab, setStudentData }) {
  const navigate = useNavigate();
  const { updateStudent } = useStudent();
  const { withLoader, notify } = useLoader();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: 'Rahul Kumar Verma',
    fatherName: 'Dinesh Verma',
    motherName: 'Shanti Devi',
    dob: '2004-06-14',
    gender: 'Male',
    category: 'OBC',
    mobile: '9452078192',
    email: 'rahul.verma@email.com',
    address: 'Kasba Khas, Ward 4',
    district: 'Mau',
    state: 'Uttar Pradesh',
    pincode: '275105',
    courseId: 'adca',
    centreId: 'HIT-CEN-0001',
    batchTime: '08:00 AM - 10:00 AM (Morning)',
    qualification: '12th Pass (Science Stream)',
    aadhaarNo: '4829-1928-8472',
    photoUploaded: true,
    aadhaarUploaded: true,
    paymentMode: 'upi',
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedRegId, setGeneratedRegId] = useState('');
  const [generatedRollId, setGeneratedRollId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    await withLoader(async () => {
      const res = await admissionService.submitApplication(formData);

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

  return (
    <div className="flex flex-col w-full">
      {/* Session Header Banner */}
      <div className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] to-[#0d4499] text-white py-space-sm px-margin-sm lg:px-margin-lg shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-label-sm font-label-sm">
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
          <div className="flex items-center gap-space-xs bg-white/10 px-space-sm py-1 rounded-full text-label-sm font-label-sm text-secondary-fixed border border-white/15">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Direct Enrollment • Processing Fee Flat ₹100.00</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] via-[#0d4499] to-[#1a62c6] text-white py-space-lg px-margin-sm lg:px-margin-lg shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-space-md max-w-3xl">
            <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center shrink-0 text-secondary-fixed shadow-sm">
              <span className="material-symbols-outlined text-3xl">how_to_reg</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs mb-1">
                <span className="px-2 py-0.5 rounded text-label-sm font-label-sm uppercase tracking-wider bg-on-tertiary-container text-white font-bold">
                  Standard Fee Notice
                </span>
                <span className="text-label-sm font-label-sm text-white/80">
                  Govt. Registered Skill Mission
                </span>
              </div>
              <h1 className="font-headline-xl text-2xl sm:text-4xl text-white font-bold leading-tight tracking-tight">
                Online Admission Form <span className="text-tertiary-fixed font-normal">(Session 2026–27)</span>
              </h1>
              <p className="font-body-md text-sm sm:text-base text-white/80 mt-1">
                Admission & Verification Processing Fee: <strong className="text-white font-semibold">Flat ₹100.00</strong>. Instant digital registration code, student profile, and QR-verifiable student credential generated immediately on transaction clearance.
              </p>
            </div>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between bg-white/10 backdrop-blur-md p-space-md rounded-xl shadow-md min-w-[220px] border border-white/15">
            <div className="flex flex-col text-left md:text-right">
              <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wide">
                Government Affiliated
              </span>
              <span className="font-headline-md text-headline-md text-white font-bold">
                H.I.T Foundation
              </span>
              <span className="font-label-sm text-label-sm text-secondary-fixed">
                NITI Aayog Darpan Verified
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-label-sm font-label-sm text-emerald-300">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>256-Bit SSL Secured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wizard Steps Navigation Bar */}
      <div className="w-full bg-surface-container-low py-space-md px-margin-sm lg:px-margin-lg shadow-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
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
                  onClick={() => !isCompleted && setCurrentStep(st.num)}
                  className={`flex items-center gap-space-sm p-space-sm rounded-lg cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-surface-container-lowest ring-2 ring-secondary shadow-sm'
                      : isPassed
                      ? 'bg-surface-container-lowest shadow-sm'
                      : 'bg-surface-container-lowest/60 opacity-80'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-md shrink-0 ${
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
                    <span className="font-label-md text-label-md font-bold text-primary truncate">
                      {st.title}
                    </span>
                    <span
                      className={`font-label-sm text-xs truncate ${
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg py-space-xl">
        {isCompleted ? (
          /* Success Screen */
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

            {/* Generated Credentials Pod */}
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
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">badge</span>
                <span>Open Digital ID Card & Dossier</span>
              </button>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">print</span>
                <span>Print Admission Slip</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left Form Column */}
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              {/* STEP 1: Personal Dossier */}
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
                      <label className="font-label-md text-xs font-semibold text-on-surface">
                        Email Address <span className="text-error">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="candidate@example.com"
                        className="h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md border border-outline-variant/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      />
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
                      onClick={() => setCurrentStep(2)}
                      className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-sm transition-all flex items-center gap-2"
                    >
                      <span>Proceed to Course & Centre</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Course & Centre Selection */}
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
                        {centresList.map((centre) => (
                          <option key={centre.id} value={centre.id}>
                            {centre.name} ({centre.id}) - {centre.district}
                          </option>
                        ))}
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
                      className="h-11 px-5 rounded-lg bg-surface-container text-primary font-semibold text-sm hover:bg-surface-container-high transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-sm transition-all flex items-center gap-2"
                    >
                      <span>Proceed to Documents & Photo</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Photo & Document Upload */}
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
                    {/* Passport Photo Upload Box */}
                    <div className="p-space-md rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant flex flex-col items-center text-center">
                      <div className="w-24 h-28 rounded-lg overflow-hidden bg-surface-container-high shadow-md mb-3 border border-outline-variant">
                        <img
                          alt="Passport preview"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7w1t1k4oE5UqY7CjyUR9wr4ds1UGeSFZ3ypw5-HptD0EkF58K5E_vmI_bA_f-uvoCN_b5QE-r2mxd-Qkmddhft6wn7PXH7whtkiBb1dTJDjJVOyAKIo7zA0yQzmr4PUxGNfinra069nOa3zmuRri1yPodaLmd6-OIFQGJKZaRvAf485ZePcjl6rZon7kqfgLE1uKxMG6GpvCoyemhXKNm4PSZixEqRPRApUwBqT4PhqUJoBZ3PrTiSQ"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-label-md text-xs font-bold text-primary">Passport Sized Photograph</span>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">JPEG / PNG, Max 200KB</span>
                      <div className="mt-3 flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>Photo attached & verified</span>
                      </div>
                    </div>

                    {/* Aadhaar Card Box */}
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
                      className="h-11 px-5 rounded-lg bg-surface-container text-primary font-semibold text-sm hover:bg-surface-container-high transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-sm transition-all flex items-center gap-2"
                    >
                      <span>Proceed to ₹100 Payment</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Fee & Instant ID Generation */}
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

                  {/* Payment Mode Selection */}
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

                  {/* Terms */}
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
                      className="h-11 px-5 rounded-lg bg-surface-container text-primary font-semibold text-sm hover:bg-surface-container-high transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePaymentSubmit}
                      className="h-12 px-8 rounded-xl bg-tertiary-fixed hover:bg-tertiary-fixed/90 text-on-tertiary-fixed font-bold text-base shadow-md transition-all flex items-center gap-2 transform active:scale-95"
                    >
                      <span className="material-symbols-outlined text-xl">lock</span>
                      <span>Pay ₹100.00 & Generate Registration</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary Sidebar Card */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary">fact_check</span>
                  <h3 className="font-headline text-base font-bold text-primary">Enrollment Summary</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-on-surface-variant block">Candidate Name:</span>
                    <span className="font-bold text-primary text-sm">{formData.fullName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Selected Course:</span>
                    <span className="font-semibold text-secondary">
                      {coursesList.find((c) => c.id === formData.courseId)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Training Centre:</span>
                    <span className="font-semibold text-on-surface">
                      {centresList.find((c) => c.id === formData.centreId)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Batch Timing:</span>
                    <span className="font-medium text-on-surface">{formData.batchTime}</span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/20">
                    <span className="text-on-surface-variant block">Processing Fee:</span>
                    <span className="font-bold text-base text-primary">₹100.00</span>
                  </div>
                </div>
              </div>

              {/* Assistance Card */}
              <div className="bg-primary text-on-primary p-space-md rounded-2xl shadow-sm">
                <span className="text-xs uppercase tracking-wider text-secondary-fixed font-bold block mb-1">
                  Need Help With Admission?
                </span>
                <p className="text-xs text-on-primary-container leading-relaxed mb-3">
                  Our admissions helpline assists students in filling details and selecting centres.
                </p>
                <a
                  href="tel:1800HITSKILL"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>1800-HIT-SKILL</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
