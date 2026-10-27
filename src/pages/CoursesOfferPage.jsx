import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCourses,
  selectUniversityPrograms,
  setCourses,
  setUniversityPrograms,
} from '../store/slices/coursesSlice';
import { courseService } from '../services/hitApi';

export default function CoursesOfferPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const universityPrograms = useSelector(selectUniversityPrograms);
  const [isLoading, setIsLoading] = useState(courses.length === 0);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      courseService.getAllCourses().catch(() => null),
      courseService.getUniversityPrograms().catch(() => null),
    ]).then(([cRes, uRes]) => {
      if (cRes?.data && Array.isArray(cRes.data)) {
        dispatch(setCourses(cRes.data));
      }
      if (uRes?.data && Array.isArray(uRes.data)) {
        dispatch(setUniversityPrograms(uRes.data));
      }
      setIsLoading(false);
    });
  }, [dispatch]);

  const [activeCatalogTab, setActiveCatalogTab] = useState('vocational');
  const [filterDuration, setFilterDuration] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  // University Program Inquiry Modal
  const [selectedUnivModal, setSelectedUnivModal] = useState(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    phone: '',
    program: '',
    qualification: '',
  });

  const filteredVocationalCourses = (courses || []).filter((c) => {
    if (!c) return false;
    const name = c.name || '';
    const code = c.code || '';
    const formula = c.formula || '';
    const modules = Array.isArray(c.modules) ? c.modules : [];
    const duration = c.duration || '';
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !q ||
      name.toLowerCase().includes(q) ||
      code.toLowerCase().includes(q) ||
      formula.toLowerCase().includes(q) ||
      modules.some((m) => typeof m === 'string' && m.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (filterDuration === 'all') return true;
    if (filterDuration === '12m') return duration.includes('12');
    if (filterDuration === '6m') return duration.includes('6');
    if (filterDuration === '3m') return duration.includes('3');
    if (filterDuration === '2m') return duration.includes('2');
    return true;
  });

  const filteredUnivPrograms = (universityPrograms || []).filter((p) => {
    if (!p) return false;
    const name = p.name || '';
    const code = p.code || '';
    const streams = p.streams || '';
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      name.toLowerCase().includes(q) ||
      code.toLowerCase().includes(q) ||
      streams.toLowerCase().includes(q)
    );
  });

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.submitInquiry({
        programId: selectedUnivModal?.id || inquiryData.program,
        programName: selectedUnivModal?.name || inquiryData.program,
        name: inquiryData.name,
        phone: inquiryData.phone,
        qualification: inquiryData.qualification,
      });
    } catch (err) {
      console.warn('Backend university inquiry submission error:', err.message);
    }

    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setSelectedUnivModal(null);
      setInquiryData({ name: '', phone: '', program: '', qualification: '' });
    }, 2800);
  };

  const formatFee = (c) => {
    if (c.fee && typeof c.fee === 'string' && c.fee.trim() !== '') {
      return c.fee;
    }
    if (typeof c.fee === 'number') {
      return `₹${c.fee.toLocaleString('en-IN')}`;
    }
    if (c.feeAmount && typeof c.feeAmount === 'number') {
      return `₹${c.feeAmount.toLocaleString('en-IN')}`;
    }
    return 'Subsidized Scheme';
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Breadcrumb Navigation */}
      <div className="w-full bg-[#001438] text-white/80 py-3 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white/60">Academic Offerings</span>
            <span className="text-white/30">/</span>
            <span className="text-emerald-400 font-medium">
              {activeCatalogTab === 'vocational'
                ? 'Vocational IT Diploma Frameworks'
                : 'UGC-Approved University Degree Programs'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Direct Admissions Open • Session 2026–2027</span>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="w-full bg-[#00163d] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase border border-white/15">
              <span>ISO 9001:2015 Certified Curriculum</span>
              <span className="text-white/40">•</span>
              <span>Govt. Aligned Standards</span>
            </div>
            <h1 className="font-['Fraunces'] text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
              Course Catalog & Academic Syllabi
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Industry-calibrated computer IT diplomas with hands-on lab training, paired with UGC-recognized
              Online & Distance University degree programs for civil examination readiness and employment.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/student-portal')}
              className="h-11 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">how_to_reg</span>
              <span>Student Sign Up / Admission</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Controls Card: Catalog Tabs & Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Segmented Catalog Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveCatalogTab('vocational');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeCatalogTab === 'vocational'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base text-slate-700">terminal</span>
              <span>Vocational & IT Diplomas</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700">
                {courses.length || 9}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCatalogTab('university');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeCatalogTab === 'university'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base text-slate-700">school</span>
              <span>University Degrees</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                UGC Approved
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder={
                activeCatalogTab === 'vocational'
                  ? 'Search by code, title, or topic...'
                  : 'Search by degree (BCA, MBA, BA)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: VOCATIONAL & IT DIPLOMAS */}
        {/* ============================================================== */}
        {activeCatalogTab === 'vocational' && (
          <div className="space-y-6">
            {/* Duration Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-slate-500 font-medium mr-1 text-xs">Duration:</span>
                {[
                  { id: 'all', label: 'All Durations' },
                  { id: '12m', label: '12 Months (ADCA)' },
                  { id: '6m', label: '6 Months (CCA, DCPA, DTP)' },
                  { id: '3m', label: '3 Months (CCC, Tally, COA, CHW)' },
                  { id: '2m', label: '2 Months (BCC)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterDuration(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      filterDuration === f.id
                        ? 'bg-[#00163d] text-white font-semibold shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Showing <strong>{filteredVocationalCourses.length}</strong> of {courses.length || 9} Programs
              </span>
            </div>

            {/* Course Grid */}
            {isLoading ? (
              <div className="py-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                Loading academic syllabus catalog...
              </div>
            ) : filteredVocationalCourses.length === 0 ? (
              <div className="py-16 text-center space-y-2 bg-white rounded-xl border border-dashed border-slate-300">
                <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
                <p className="text-sm font-semibold text-slate-700">No matching vocational courses found</p>
                <p className="text-xs text-slate-500">Try modifying your search keywords or duration filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVocationalCourses.map((course) => {
                  const feeText = formatFee(course);
                  const modulesList = Array.isArray(course.modules) ? course.modules : [];

                  return (
                    <div
                      key={course.id || course.code}
                      className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-4">
                        {/* Card Top: Code, Duration, Track */}
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#00163d] border border-slate-200">
                              {course.code}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                              <span className="material-symbols-outlined text-sm text-slate-400">schedule</span>
                              <span>{course.duration}</span>
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-500 font-medium">
                            Eligibility: <strong className="text-slate-800">{course.eligibility || '10th / 12th'}</strong>
                          </span>
                        </div>

                        {/* Title & Bundle formula */}
                        <div>
                          <h3 className="font-['Fraunces'] text-lg font-semibold text-slate-900 leading-snug">
                            {course.name}
                          </h3>
                          {course.formula && (
                            <p className="text-[11px] text-emerald-800 font-medium mt-1 font-mono">
                              Framework Bundle: {course.formula}
                            </p>
                          )}
                        </div>

                        {/* Structured Curriculum Outline (No generic green checkmark icons) */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                            Key Curriculum Outline:
                          </span>
                          <div className="space-y-1.5">
                            {modulesList.slice(0, 4).map((mod, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
                              >
                                <span className="font-mono text-[10px] text-slate-400 font-semibold w-4 shrink-0 pt-0.5">
                                  0{i + 1}
                                </span>
                                <span className="line-clamp-1">{mod}</span>
                              </div>
                            ))}
                            {modulesList.length > 4 && (
                              <div className="text-[11px] text-slate-500 font-medium pl-6 pt-0.5">
                                + {modulesList.length - 4} additional technical units
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Fee & Action Buttons */}
                      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold tracking-wider">
                            Course Fee
                          </span>
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {feeText}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCourseModal(course)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            Syllabus
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate('/student-portal')}
                            className="px-3.5 py-1.5 rounded-lg bg-[#00163d] hover:bg-[#072a6b] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: UNIVERSITY DEGREE PROGRAMS */}
        {/* ============================================================== */}
        {activeCatalogTab === 'university' && (
          <div className="space-y-6">
            {/* Accreditation Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                    UGC • DEB • AICTE Aligned
                  </span>
                  <span className="text-xs text-slate-500">Recognized Central & State Partner Universities</span>
                </div>
                <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-semibold text-slate-900">
                  Online & Distance University Degree Programs
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  HIT Foundation provides admission counseling, digital learning support, and document verification for
                  accredited undergraduate and postgraduate degree courses. Valid for all Union and State public
                  examination boards.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="font-mono text-base font-bold text-slate-900 block">100%</span>
                  <span className="text-[10px] text-slate-500 font-medium">Govt. Job Valid</span>
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="font-mono text-base font-bold text-emerald-700 block">LMS</span>
                  <span className="text-[10px] text-slate-500 font-medium">Digital Study Material</span>
                </div>
              </div>
            </div>

            {/* University Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredUnivPrograms.map((univ) => (
                <div
                  key={univ.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#00163d] border border-slate-200">
                        {univ.code}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{univ.duration}</span>
                    </div>

                    <h3 className="font-['Fraunces'] text-base font-semibold text-slate-900 leading-snug">
                      {univ.name}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Eligibility</span>
                        <span className="font-medium text-slate-800">{univ.eligibility}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Program Level</span>
                        <span className="font-medium text-slate-800">{univ.type}</span>
                      </div>
                    </div>

                    {univ.streams && (
                      <div className="pt-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Available Streams / Specializations:
                        </span>
                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-medium">
                          {univ.streams}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Mode</span>
                      <span className="text-xs font-medium text-slate-800">Online & Distance</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnivModal(univ);
                        setInquiryData({ ...inquiryData, program: univ.name });
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#00163d] hover:bg-[#072a6b] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>Inquire</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL 1: DETAILED COURSE SYLLABUS */}
      {/* ============================================================== */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 animate-scale-up">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                  {selectedCourseModal.code} • {selectedCourseModal.duration}
                </span>
                <h3 className="font-['Fraunces'] text-xl font-semibold text-slate-900 mt-1">
                  {selectedCourseModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourseModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Program Duration:</span>
                  <span className="font-semibold text-slate-800">{selectedCourseModal.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Entry Eligibility:</span>
                  <span className="font-semibold text-slate-800">{selectedCourseModal.eligibility}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Fee Schedule:</span>
                  <span className="font-bold text-slate-900 font-mono">{formatFee(selectedCourseModal)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Certification Standard:</span>
                  <span className="font-semibold text-slate-800">ISO 9001:2015 QR-Verifiable</span>
                </div>
              </div>

              {selectedCourseModal.formula && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Syllabus Formulation:
                  </span>
                  <p className="font-mono text-xs font-medium text-slate-800">{selectedCourseModal.formula}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wider mb-2">
                  Complete Curriculum Modules & Topics:
                </h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {selectedCourseModal.modules &&
                    selectedCourseModal.modules.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800"
                      >
                        <span className="font-mono text-[10px] font-bold text-slate-500 w-5 text-center shrink-0">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <span className="font-medium">{m}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedCourseModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCourseModal(null);
                  navigate('/student-portal');
                }}
                className="px-5 py-2 rounded-lg bg-[#00163d] hover:bg-[#072a6b] text-white text-xs font-medium shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Proceed to Student Registration</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: UNIVERSITY PROGRAM INQUIRY */}
      {/* ============================================================== */}
      {selectedUnivModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 animate-scale-up">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {selectedUnivModal.code} • {selectedUnivModal.duration}
                </span>
                <h3 className="font-['Fraunces'] text-lg font-semibold text-slate-900 mt-0.5">
                  {selectedUnivModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUnivModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                  <span className="material-symbols-outlined text-2xl">check</span>
                </div>
                <h4 className="font-['Fraunces'] text-lg font-semibold text-slate-900">Inquiry Registered</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Our University Admissions Counselor will contact you on <strong>{inquiryData.phone}</strong> with
                  syllabus details and partner university guidelines.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="py-4 space-y-3.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-medium text-slate-900">
                    Selected: {selectedUnivModal.name} ({selectedUnivModal.duration})
                  </p>
                  <p className="text-slate-500 mt-0.5">Eligibility: {selectedUnivModal.eligibility}</p>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter candidate full name"
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">WhatsApp / Contact No. *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Highest Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. 12th Pass, BA, B.Sc"
                      value={inquiryData.qualification}
                      onChange={(e) => setInquiryData({ ...inquiryData, qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedUnivModal(null)}
                    className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#00163d] hover:bg-[#072a6b] text-white font-medium shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Request Academic Counseling</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
