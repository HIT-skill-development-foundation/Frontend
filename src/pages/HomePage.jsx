import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import mainBanner from '../assets/images/main.jpeg';
import main2Banner from '../assets/images/main2.jpeg';
import directorImg from '../assets/images/director.jpeg';
import certificateImg from '../assets/images/certificate.jpeg';
import isoImg from '../assets/images/iso.jpeg';
import { centreService } from '../services/hitApi';

// Animated count-up counter with easing and IntersectionObserver support
function CountUp({ end, duration = 2000, decimals = 0, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    } else {
      setHasStarted(true);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    let animationFrameId = null;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCount(easedProgress * end);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hasStarted, end, duration]);

  const formatted = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default function HomePage({ setActiveTab }) {
  const navigate = useNavigate();

  // Franchise Form State
  const [franchiseForm, setFranchiseForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    state: 'Uttar Pradesh',
    centerType: 'New Computer Center',
    pcCount: '10 to 20 Computers',
    spaceAvailable: '500 to 1,000 Sq. Ft.',
    message: '',
  });
  const [franchiseSubmitted, setFranchiseSubmitted] = useState(false);
  const [activeCertificateModal, setActiveCertificateModal] = useState(null);

  // Banner Carousel State
  const slides = [
    {
      id: 1,
      image: mainBanner,
      alt: 'HIT Computer Education Official Course Portfolio & Prospectus Banner',
    },
    {
      id: 2,
      image: main2Banner,
      alt: 'H.I.T India Skill Development Foundation & University Programs Banner',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play swipe interval with particular delay (4.5s)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  };

  const handleNavigate = (path, tabId) => {
    if (setActiveTab && tabId) {
      setActiveTab(tabId);
    }
    navigate(path);
  };

  const handleFranchiseSubmit = async (e) => {
    e.preventDefault();
    if (!franchiseForm.name || !franchiseForm.phone) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    try {
      await centreService.applyFranchise({
        name: franchiseForm.name,
        phone: franchiseForm.phone,
        email: franchiseForm.email,
        city: franchiseForm.city || 'Mau, Uttar Pradesh',
        centerType: franchiseForm.centerType,
        pcCount: franchiseForm.pcCount,
        spaceAvailable: franchiseForm.spaceAvailable,
      });
    } catch (err) {
      console.warn('Franchise application submission notice:', err.message);
    }

    setFranchiseSubmitted(true);
    try {
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Full-Bleed Animated Carousel (main.jpeg & main2.jpeg) */}
      <section
        className="w-full p-0 m-0 bg-primary overflow-hidden shadow-md relative group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Animated Swipe Track */}
        <div
          className="flex w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-[230px] sm:h-[320px] md:h-[400px] lg:h-[450px] block object-fill mx-auto"
              />
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-xl cursor-pointer z-20"
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">chevron_left</span>
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-xl cursor-pointer z-20"
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">chevron_right</span>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-secondary shadow-md'
                  : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-mono font-bold tracking-wider z-20 border border-white/20">
          {currentSlide + 1} / {slides.length}
        </div>
      </section>

      {/* Action & Quick Access Bar */}
      <div className="w-full bg-surface-container-low py-3.5 px-margin-sm lg:px-margin-lg border-b border-outline-variant/20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="font-headline text-xs sm:text-sm font-bold text-primary block leading-tight">
                Session 2026–2027 Direct Online Enrollment Open
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium hidden sm:inline">
                Govt. Registered Skill Mission • NITI Aayog & MCA Approved • Kasba Khas, Ghosi, Mau
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleNavigate('/student-portal', 'student_portal')}
              className="btn-primary h-10 px-4"
            >
              <span>Apply Online (₹100 Fee)</span>
            </button>
            <button
              onClick={() => handleNavigate('/student-portal', 'student_portal')}
              className="btn-secondary h-10 px-4"
            >
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => handleNavigate('/verification', 'verification')}
              className="btn-secondary h-10 px-4"
            >
              <span>Verify Roll</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Impact Counters */}
      <section className="w-full bg-surface-container-low py-8 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <span className="font-headline text-3xl sm:text-4xl font-extrabold text-primary block">
                <CountUp end={12500} suffix="+" duration={2200} />
              </span>
              <span className="font-label-md text-xs sm:text-sm text-on-surface-variant font-semibold mt-1.5 block">
                Certified Students
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <span className="font-headline text-3xl sm:text-4xl font-extrabold text-secondary block">
                <CountUp end={98.4} decimals={1} suffix="%" duration={2000} />
              </span>
              <span className="font-label-md text-xs sm:text-sm text-on-surface-variant font-semibold mt-1.5 block">
                Course Completion
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
              <span className="font-headline text-3xl sm:text-4xl font-extrabold text-emerald-600 block">
                <CountUp end={100} suffix="%" duration={1900} />
              </span>
              <span className="font-label-md text-xs sm:text-sm text-on-surface-variant font-semibold mt-1.5 block">
                QR Verified Diplomas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Director's Master Training & Specialized Wings Section */}
      <section className="w-full bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT HALF: Content on Hardware Training, PGDCA Teacher Training & Director's Mentorship */}
            <motion.div
              className="lg:col-span-7 flex flex-col justify-center space-y-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-40px' }}
            >
              {/* Institutional Section Header */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  DIRECTOR'S DESK / MASTER TRAINING WING
                </p>
                <h2 className="font-headline text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 leading-[1.15] tracking-tight">
                  Master-Led Computer Hardware & PGDCA Teacher Training
                </h2>
                <p className="text-sm font-semibold text-secondary uppercase tracking-wider">
                  Direct Practical Mentorship Under the Leadership of the Institute Director
                </p>
              </div>

              {/* Narrative Context */}
              <p className="font-body-md text-base text-slate-600 leading-relaxed max-w-2xl">
                At HIT Computer Education, our Director actively leads specialized practical training sessions.
                Rather than relying on abstract slides, trainees work on live diagnostic benches under direct
                one-on-one guidance—mastering chip-level motherboard servicing, system architecture, and pedagogical methods to qualify as certified IT faculty.
              </p>

              {/* 2 Focused Training Modules (Clean Editorial Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                {/* Module 1: Computer Hardware Training */}
                <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 space-y-3 group cursor-default">
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-secondary uppercase tracking-wider block transition-colors">
                    MODULE 01
                  </span>
                  <h3 className="font-headline text-base font-bold text-slate-900">
                    Computer Hardware Training (CHW)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Complete motherboard diagnostics, PC assembling, SMPS power supplies, CPU/RAM installation, BIOS setup, and live hardware troubleshooting.
                  </p>
                  <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-secondary tracking-wide uppercase">
                    100% Practical Lab Bench Training
                  </div>
                </div>

                {/* Module 2: PGDCA & Teacher Training */}
                <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 space-y-3 group cursor-default">
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-emerald-700 uppercase tracking-wider block transition-colors">
                    MODULE 02
                  </span>
                  <h3 className="font-headline text-base font-bold text-slate-900">
                    PGDCA & Teacher Training (CTT)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Advanced diploma curriculum preparing professional educators. Covers pedagogical methodology, IT syllabus delivery, and faculty certification.
                  </p>
                  <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
                    Prepares Certified Computer Faculty
                  </div>
                </div>
              </div>

              {/* Direct Mentor Highlights */}
              <div className="p-5 rounded-xl bg-slate-100/80 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Why Train Directly Under the Director?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                    <span>Live component testing & multimeters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                    <span>State-level computer teacher credentials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                    <span>Industry internship & repair guidance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                    <span>Personalized career mentorship</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleNavigate('/courses', 'courses')}
                  className="btn-primary h-11 px-6"
                >
                  Explore Hardware & PGDCA Syllabi
                </button>
                <button
                  onClick={() => handleNavigate('/student-portal', 'student_portal')}
                  className="btn-secondary h-11 px-6"
                >
                  Apply for Training
                </button>
              </div>
            </motion.div>

            {/* RIGHT HALF: Director Image Frame */}
            <motion.div
              className="lg:col-span-5 flex justify-center items-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <div className="w-full max-w-md bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group">
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100">
                  {/* Photo with subtle zoom on card hover */}
                  <img
                    src={directorImg}
                    alt="Institute Director conducting training and institutional oversight"
                    className="w-full h-full object-cover object-top block transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Atmospheric Tint Layer (Refined Navy/Slate photographic glaze) */}
                  <div className="absolute inset-0 bg-[#001338]/15 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-40 pointer-events-none"></div>

                  {/* Subtle Top-Right Ambient Specular Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Glass Frost Caption Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-[#001030]/80 backdrop-blur-md p-4 text-white border-t border-white/10 transition-colors duration-300 group-hover:bg-[#001030]/90">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 block">
                        LEADERSHIP & MENTORSHIP
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </div>
                    <h3 className="font-headline text-base font-bold text-white mt-1">
                      Institute Director
                    </h3>
                    <p className="text-[11px] text-slate-300/90 mt-0.5">
                      HIT Computer Education • H.I.T India Skill Development Foundation
                    </p>
                  </div>
                </div>

                {/* Bottom Spec Matrix with Hover Lift */}
                <div className="grid grid-cols-2 gap-3 pt-3 px-1 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 transition-colors duration-200 group-hover:bg-slate-100/70">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">SPECIALIZATION</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">Hardware & PGDCA</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 transition-colors duration-200 group-hover:bg-slate-100/70">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">STUDENT BASE</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">12,500+ Mentored</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Franchise Purchase & Center Affiliation Contact Section */}
      <section id="franchise-contact" className="w-full bg-[#f1f4f9] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-[11px] font-mono font-bold text-secondary uppercase tracking-widest">
              AUTHORIZED TRAINING CENTRE (ATC) FRANCHISE
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 leading-tight tracking-tight">
              Start Your Own Computer Center — <span className="text-secondary">Get HIT Franchise</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Partner with <strong>H.I.T India Skill Development Foundation</strong> (Incorporated under MCA, Govt. of India • ISO 9001:2015 Audited). Establish an authorized skill & university counseling centre in your district with turnkey curriculum and student examination software.
            </p>
          </div>

          {/* 2-Column Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT COLUMN: Clean Editorial Franchise Form */}
            <motion.div
              className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.05)] flex flex-col justify-between h-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
                <div>
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-900">
                    Franchise Purchase & Affiliation Application
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submit institutional details below. Our Head Office onboarding desk responds within 24 hours.
                  </p>
                </div>
                <span className="text-[10.5px] font-mono font-semibold text-secondary px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 hidden sm:inline-block">
                  SESSION 2026–2027
                </span>
              </div>

              {franchiseSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest block">
                      APPLICATION RECEIVED
                    </span>
                    <h4 className="font-headline text-2xl font-bold text-slate-900">
                      Franchise Inquiry Submitted Successfully
                    </h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong>{franchiseForm.name}</strong>. Our Head Office Coordinator will connect on <strong>{franchiseForm.phone}</strong> with the prospectus, fee schedule, and draft MoU.
                    </p>
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFranchiseSubmitted(false)}
                      className="btn-secondary h-10 px-5"
                    >
                      Submit Another Inquiry
                    </button>
                    <a
                      href={`https://wa.me/919616764675?text=Hello%20HIT%20Franchise%20Team%2C%20I%20have%20submitted%20my%20application%20for%20${encodeURIComponent(franchiseForm.city || 'Center')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary h-10 px-5"
                    >
                      Instant WhatsApp Desk
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFranchiseSubmit} className="space-y-5 text-xs">
                  {/* Row 1: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">
                        Director / Centre Owner Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar Singh"
                        value={franchiseForm.name}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50/80 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">
                        Mobile Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9616764675"
                        value={franchiseForm.phone}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50/80 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & District/City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="centre@email.com"
                        value={franchiseForm.email}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50/80 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">
                        Proposed City / Town & District *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ghosi, Mau"
                        value={franchiseForm.city}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50/80 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Row 3: Centre Status & Infrastructure */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">
                        Current Setup Status
                      </label>
                      <select
                        value={franchiseForm.centerType}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, centerType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-50/80 border border-slate-300 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary cursor-pointer transition-all"
                      >
                        <option>New Computer Center</option>
                        <option>Already Running Center</option>
                        <option>School / College Lab</option>
                        <option>Coaching Institute</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">
                        Computer Systems
                      </label>
                      <select
                        value={franchiseForm.pcCount}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, pcCount: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-50/80 border border-slate-300 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary cursor-pointer transition-all"
                      >
                        <option>5 to 10 Computers</option>
                        <option>10 to 20 Computers</option>
                        <option>20+ Computers</option>
                        <option>Planning to Purchase</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">
                        Lab Space Available
                      </label>
                      <select
                        value={franchiseForm.spaceAvailable}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, spaceAvailable: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-50/80 border border-slate-300 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary cursor-pointer transition-all"
                      >
                        <option>300 to 500 Sq. Ft.</option>
                        <option>500 to 1,000 Sq. Ft.</option>
                        <option>1,000+ Sq. Ft.</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      Specific Requirements / Premises Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter exact locality, commercial frontage, or query regarding syllabus, examination portal, and certificates..."
                      value={franchiseForm.message}
                      onChange={(e) => setFranchiseForm({ ...franchiseForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50/80 border border-slate-300 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 resize-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Submit Button & Assurance */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    <span className="text-[11px] font-mono text-slate-500">
                      Zero royalty on student fees • Direct Head Office affiliation
                    </span>
                    <button
                      type="submit"
                      className="btn-primary h-11 px-7 w-full sm:w-auto"
                    >
                      Submit Franchise Inquiry
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* RIGHT COLUMN: Official Credentials & Direct Helpdesk Dossier */}
            <motion.div
              className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col justify-between h-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-widest block">
                      CENTRAL AFFILIATION WING
                    </span>
                    <span className="text-[10.5px] font-mono font-semibold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      LIVE DESK
                    </span>
                  </div>
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    Head Office Desk
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Central franchise dispatch, documentation & direct telephone onboarding.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Telephone Support */}
                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      TELEPHONE & WHATSAPP DESK
                    </span>
                    <div className="flex flex-col gap-1.5 text-slate-800 font-semibold">
                      <a href="tel:+919616764675" className="hover:text-secondary transition-colors flex items-center justify-between">
                        <span>+91 96167-64675</span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">Primary Desk</span>
                      </a>
                      <a href="tel:+918115507046" className="hover:text-secondary transition-colors flex items-center justify-between">
                        <span>+91 81155-07046</span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">Coordination</span>
                      </a>
                      <a href="tel:+919452078192" className="hover:text-secondary transition-colors flex items-center justify-between">
                        <span>+91 94520-78192</span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">General Inquiry</span>
                      </a>
                    </div>
                  </div>

                  {/* Registered Address */}
                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      REGISTERED HEADQUARTERS
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11.5px]">
                      H.No.-117A, Malik Tola, Ward-11, Kasba Khas, Ghosi, Jamal Mirja Pur, Mau, Uttar Pradesh - 275105
                    </p>
                  </div>

                  {/* Affiliation Emails */}
                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      OFFICIAL INQUIRY EMAILS
                    </span>
                    <div className="flex flex-col gap-1 text-secondary font-medium">
                      <a href="mailto:hitindia.ghosi@gmail.com" className="hover:underline">
                        hitindia.ghosi@gmail.com
                      </a>
                      <a href="mailto:hitcomputer.ghosi@gmail.com" className="hover:underline">
                        hitcomputer.ghosi@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Actions (Bottom aligned, matching the left card's button height) */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-4">
                <a
                  href="https://wa.me/919616764675?text=Hello%20HIT%20Team%2C%20I%20want%20to%20open%20a%20new%20Franchise%20Center."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary h-11 px-3 text-[11px] uppercase tracking-wider text-center"
                >
                  WhatsApp Desk 1
                </a>
                <a
                  href="https://wa.me/918115507046?text=Hello%20HIT%20Team%2C%20I%20want%20to%20open%20a%20new%20Franchise%20Center."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary h-11 px-3 text-[11px] uppercase tracking-wider text-center"
                >
                  WhatsApp Desk 2
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Giving & Donation Callout */}
      <section className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg py-16">
        <div className="bg-[#001338] border border-white/10 text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle architectural background accent */}
          <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-secondary-fixed">
                Section 8 Non-Profit • 50% Tax Exemption
              </span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Support Digital Literacy for Underprivileged Girls & Rural Youths
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Your donation to H.I.T India Skill Development Foundation is eligible for 50% tax exemption under Section 80G(5)(iv) of the Income Tax Act. Every contribution directly funds computer hardware, rural lab setups, and certified technical training.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Income Tax Sec 80G(5)(iv)
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Instant Digital 80G Receipt
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> NITI Aayog Darpan Verified
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => handleNavigate('/donation', 'donation')}
              className="btn-accent h-11 px-6 w-full sm:w-auto"
            >
              Donate Online (80G)
            </button>
            <button
              onClick={() => handleNavigate('/receipt', 'receipt')}
              className="btn-outline-dark h-11 px-5 w-full sm:w-auto"
            >
              View 80G Voucher
            </button>
          </div>
        </div>
      </section>

      {/* Certificate Lightbox Modal */}
      {activeCertificateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveCertificateModal(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-surface rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 px-6 border-b border-outline-variant/20 bg-surface-container-low">
              <div>
                <h3 className="text-base font-bold text-primary font-headline">
                  {activeCertificateModal.title}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {activeCertificateModal.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCertificateModal(null)}
                className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-error/10 hover:text-error text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                title="Close Certificate Viewer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-black/5 max-h-[75vh]">
              <img
                src={activeCertificateModal.image}
                alt={activeCertificateModal.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md border border-outline-variant/20"
              />
            </div>
            <div className="p-3 px-6 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
              <span>H.I.T India Skill Development Foundation • Official Document</span>
              <button
                type="button"
                onClick={() => setActiveCertificateModal(null)}
                className="btn-primary h-8 px-4 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

