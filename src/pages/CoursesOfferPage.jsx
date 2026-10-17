import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCourses, selectUniversityPrograms } from '../store/slices/coursesSlice';
import { coursesList, universityProgramsList } from '../data/mockData';

export default function CoursesOfferPage() {
  const navigate = useNavigate();
  const reduxCourses = useSelector(selectCourses);
  const reduxUniversityPrograms = useSelector(selectUniversityPrograms);

  const courses = reduxCourses && reduxCourses.length > 0 ? reduxCourses : coursesList;
  const universityPrograms =
    reduxUniversityPrograms && reduxUniversityPrograms.length > 0
      ? reduxUniversityPrograms
      : universityProgramsList;

  // Primary Tab: 'vocational' | 'university'
  const [activeCatalogTab, setActiveCatalogTab] = useState('vocational');

  // Vocational Filter & Search
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

  const filteredVocationalCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.formula && c.formula.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.modules && c.modules.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;
    if (filterDuration === 'all') return true;
    if (filterDuration === '12m') return c.duration.includes('12');
    if (filterDuration === '6m') return c.duration.includes('6');
    if (filterDuration === '3m') return c.duration.includes('3');
    if (filterDuration === '2m') return c.duration.includes('2');
    return true;
  });

  const filteredUnivPrograms = universityPrograms.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.streams && p.streams.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setSelectedUnivModal(null);
      setInquiryData({ name: '', phone: '', program: '', qualification: '' });
    }, 2800);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Breadcrumb & Trust Banner */}
      <div className="w-full bg-primary text-on-primary py-space-sm px-margin-sm lg:px-margin-lg shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
          <div className="flex items-center gap-space-xs">
            <span className="text-on-primary/70">Academic Catalog</span>
            <span className="text-on-primary/40">/</span>
            <span className="text-secondary-fixed font-semibold">
              {activeCatalogTab === 'vocational'
                ? 'Vocational & Computer IT Diploma Programs'
                : 'University Programs (Online & Distance Mode)'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-container text-secondary-fixed text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Direct Admissions Open • Session 2026–2027
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="w-full bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary py-12 px-margin-sm lg:px-margin-lg shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-secondary-fixed text-xs font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-sm">school</span>
              Comprehensive Academic Offerings
            </div>
            <h1 className="font-headline text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Course Catalog & Syllabi
            </h1>
            <p className="font-body-lg text-sm sm:text-base text-surface-container-high mt-3 leading-relaxed">
              Explore our certified vocational IT diplomas with hands-on lab projects, along with recognized
              UGC-approved University Online & Distance degree programs for career acceleration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => navigate('/student-portal')}
              className="h-12 px-6 rounded-xl bg-tertiary-container hover:bg-primary text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">how_to_reg</span>
              <span>Enroll / Student Sign Up</span>
            </button>
          </div>
        </div>
      </section>

      {/* Primary Section Switcher Tabs */}
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg -mt-6">
        <div className="bg-surface-container-lowest p-2 rounded-2xl shadow-lg border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveCatalogTab('vocational');
                setSearchQuery('');
              }}
              className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeCatalogTab === 'vocational'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">terminal</span>
              <span>Vocational & IT Courses (9 Programs)</span>
            </button>

            <button
              onClick={() => {
                setActiveCatalogTab('university');
                setSearchQuery('');
              }}
              className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeCatalogTab === 'university'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">history_edu</span>
              <span>University Program (Online & Distance)</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-primary text-[10px] font-extrabold uppercase">
                UGC Approved
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              placeholder={
                activeCatalogTab === 'vocational'
                  ? 'Search course (e.g. BCC, ADCA, Tally)...'
                  : 'Search degree (e.g. BCA, MBA, BA)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: VOCATIONAL & IT COMPUTER COURSES                  */}
      {/* ======================================================== */}
      {activeCatalogTab === 'vocational' && (
        <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-6">
          {/* Duration Filters */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-outline-variant/20">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-on-surface-variant mr-1">Duration Filter:</span>
              {[
                { id: 'all', label: 'All (9 Programs)' },
                { id: '12m', label: '12 Month (ADCA)' },
                { id: '6m', label: '6 Month (CCA, DCPA, DTP)' },
                { id: '3m', label: '3 Month (CCC, CHW, Tally, COA)' },
                { id: '2m', label: '2 Month (BCC)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterDuration(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterDuration === f.id
                      ? 'bg-secondary text-white shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-on-surface-variant font-medium">
              Showing <strong>{filteredVocationalCourses.length}</strong> Vocational Programs
            </span>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {filteredVocationalCourses.map((course) => (
              <div
                key={course.id}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-outline-variant/30 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top strip for formula-based bundle courses like ADCA, DCPA, DTP */}
                {course.formula && (
                  <div className="absolute top-0 inset-x-0 bg-primary/5 py-1 px-4 border-b border-outline-variant/20">
                    <span className="text-[10px] font-bold text-primary truncate block">
                      Bundle: {course.formula}
                    </span>
                  </div>
                )}

                <div className={course.formula ? 'pt-3' : ''}>
                  {/* Top Badge & Icon */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-2xl">{course.icon || 'terminal'}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {course.popular && (
                        <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">
                          Popular Choice
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                        {course.fee}
                      </span>
                    </div>
                  </div>

                  {/* Course Code & Duration */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-surface-container text-secondary">
                      {course.code}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      Duration: <strong className="text-on-surface">{course.duration}</strong>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-headline text-lg font-bold text-primary group-hover:text-secondary transition-colors mb-1.5 leading-snug">
                    {course.name}
                  </h3>

                  {/* Eligibility */}
                  <p className="text-xs text-on-surface-variant font-medium mb-3">
                    Eligibility: <span className="text-on-surface font-semibold">{course.eligibility}</span>
                  </p>

                  {/* Modules list */}
                  <div className="space-y-1.5 pt-3 border-t border-outline-variant/20 mb-4">
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                      Curriculum Modules:
                    </span>
                    <ul className="text-xs space-y-1 text-on-surface">
                      {course.modules &&
                        course.modules.slice(0, 5).map((mod, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0">
                              check_circle
                            </span>
                            <span className="truncate">{mod}</span>
                          </li>
                        ))}
                      {course.modules && course.modules.length > 5 && (
                        <li className="text-[11px] text-primary font-semibold pl-6">
                          + {course.modules.length - 5} more topics included
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions & Fee */}
                <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                      Total Course Fee
                    </span>
                    <span className="text-sm font-extrabold text-primary">{course.fee}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedCourseModal(course)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>Syllabus</span>
                    </button>
                    <button
                      onClick={() => navigate('/student-portal')}
                      className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <span>Apply</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: UNIVERSITY PROGRAMS (ONLINE & DISTANCE)          */}
      {/* ======================================================== */}
      {activeCatalogTab === 'university' && (
        <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-6">
          {/* Recognition Banner */}
          <div className="bg-gradient-to-r from-secondary/15 via-primary/10 to-secondary/15 p-6 rounded-3xl border border-secondary/30 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-white text-[11px] font-bold uppercase tracking-wider">
                  Accredited Program
                </span>
                <span className="text-xs font-semibold text-primary">UGC • DEB • AICTE Aligned Universities</span>
              </div>
              <h2 className="font-headline text-xl sm:text-2xl font-extrabold text-primary">
                University Programs (Online and Distance Mode)
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                HIT Computer Education provides academic counseling and admission support for recognized Online & Distance
                degree courses: <strong>BA, B.Com, BCA, MCA, MBA, PGDCA, MA, and Other Courses</strong>. Ideal for students, working
                professionals, and civil services aspirants.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-center px-4 py-2 bg-white rounded-xl shadow-xs border border-outline-variant/30">
                <span className="font-headline text-lg font-bold text-primary block">100%</span>
                <span className="text-[10px] text-on-surface-variant font-medium">Valid for Govt. Jobs</span>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-xl shadow-xs border border-outline-variant/30">
                <span className="font-headline text-lg font-bold text-secondary block">Digital</span>
                <span className="text-[10px] text-on-surface-variant font-medium">LMS & E-Content</span>
              </div>
            </div>
          </div>

          {/* University Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredUnivPrograms.map((univ) => (
              <div
                key={univ.id}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-outline-variant/30 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-2xl">{univ.icon || 'history_edu'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-bold">
                      {univ.mode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                      {univ.code}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">{univ.duration}</span>
                  </div>

                  <h3 className="font-headline text-lg font-bold text-primary group-hover:text-secondary transition-colors mb-2 leading-snug">
                    {univ.name}
                  </h3>

                  <div className="space-y-2 text-xs text-on-surface-variant pb-3 border-b border-outline-variant/20 mb-3">
                    <p>
                      <strong className="text-on-surface">Eligibility:</strong> {univ.eligibility}
                    </p>
                    <p>
                      <strong className="text-on-surface">Type:</strong> {univ.type}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                      Key Streams / Subjects:
                    </span>
                    <p className="text-xs text-on-surface font-medium leading-relaxed bg-surface-container-low p-2.5 rounded-xl">
                      {univ.streams}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 mt-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">Mode</span>
                    <span className="text-xs font-bold text-primary">Distance / Online</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUnivModal(univ);
                      setInquiryData({ ...inquiryData, program: univ.name });
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-secondary hover:bg-secondary/90 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Inquire Now</span>
                    <span className="material-symbols-outlined text-sm">contact_support</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DETAILED VOCATIONAL COURSE SYLLABUS MODAL                */}
      {/* ======================================================== */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up">
            <div className="flex items-start justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">{selectedCourseModal.icon || 'terminal'}</span>
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-secondary">{selectedCourseModal.code}</span>
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-primary">
                    {selectedCourseModal.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3.5 rounded-xl text-xs">
                <div>
                  <span className="text-on-surface-variant block">Course Duration:</span>
                  <span className="font-bold text-primary">{selectedCourseModal.duration}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Entry Eligibility:</span>
                  <span className="font-bold text-on-surface">{selectedCourseModal.eligibility}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Fee Schedule:</span>
                  <span className="font-bold text-emerald-700">{selectedCourseModal.fee}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Certification:</span>
                  <span className="font-bold text-primary">QR-Verifiable ISO 9001:2015</span>
                </div>
              </div>

              {selectedCourseModal.formula && (
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs">
                  <span className="text-[10px] font-bold text-primary block uppercase tracking-wider mb-0.5">
                    Syllabus Formulation:
                  </span>
                  <p className="font-semibold text-primary">{selectedCourseModal.formula}</p>
                </div>
              )}

              <div>
                <h4 className="font-headline text-sm font-bold text-primary mb-2">Detailed Syllabus & Modules:</h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {selectedCourseModal.modules &&
                    selectedCourseModal.modules.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-surface-container text-xs">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-on-surface">{m}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedCourseModal(null);
                  navigate('/student-portal');
                }}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Proceed to Student Registration</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* UNIVERSITY PROGRAM ADMISSION COUNSELING MODAL           */}
      {/* ======================================================== */}
      {selectedUnivModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up">
            <div className="flex items-start justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">{selectedUnivModal.icon || 'history_edu'}</span>
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-secondary">
                    {selectedUnivModal.code} • {selectedUnivModal.mode}
                  </span>
                  <h3 className="font-headline text-lg font-bold text-primary">{selectedUnivModal.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedUnivModal(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h4 className="font-headline text-lg font-bold text-primary">Inquiry Received Successfully!</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  Our University Admissions Counselor will contact you on <strong>{inquiryData.phone}</strong> with
                  syllabus, partner university details, and fee structures.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="py-4 space-y-3.5 text-xs">
                <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                  <p className="text-secondary font-bold">
                    University Program: {selectedUnivModal.name} ({selectedUnivModal.duration})
                  </p>
                  <p className="text-on-surface-variant mt-0.5">Eligibility: {selectedUnivModal.eligibility}</p>
                </div>

                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-secondary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-1">WhatsApp / Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-secondary/20"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-1">Highest Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. 12th Pass, BA, B.Sc"
                      value={inquiryData.qualification}
                      onChange={(e) => setInquiryData({ ...inquiryData, qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-secondary/20"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedUnivModal(null)}
                    className="px-4 py-2 rounded-xl text-on-surface font-semibold hover:bg-surface-container cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Request Free Counseling Call</span>
                    <span className="material-symbols-outlined text-sm">call</span>
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
