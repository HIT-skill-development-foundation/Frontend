import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import mainBanner from '../assets/images/main.jpeg';
import main2Banner from '../assets/images/main2.jpeg';
import directorImg from '../assets/images/director.jpeg';
import certificateImg from '../assets/images/certificate.jpeg';
import isoImg from '../assets/images/iso.jpeg';

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

  const handleFranchiseSubmit = (e) => {
    e.preventDefault();
    if (!franchiseForm.name || !franchiseForm.phone) {
      alert('Please provide your name and contact phone number.');
      return;
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
              className="h-10 px-4 rounded-xl bg-tertiary-container hover:bg-primary text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">how_to_reg</span>
              <span>Apply Online (₹100 Fee)</span>
            </button>
            <button
              onClick={() => handleNavigate('/student-portal', 'student_portal')}
              className="h-10 px-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-base">badge</span>
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => handleNavigate('/verification', 'verification')}
              className="h-10 px-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-secondary font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-base">verified</span>
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

      {/* Director's Master Training & Specialized Wings (Split 2-Column with Framer Motion) */}
      <section className="w-full bg-gradient-to-b from-surface via-surface-container-lowest to-surface-container-low py-16 px-margin-sm lg:px-margin-lg border-b border-outline-variant/20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* LEFT HALF: Content on Hardware Training, PGDCA Teacher Training & Director's Mentorship */}
            <motion.div
              className="lg:col-span-7 flex flex-col justify-center space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-60px' }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider w-fit shadow-xs">
                <span className="material-symbols-outlined text-base">engineering</span>
                <span>Director's Desk & Master Training Wing</span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-primary leading-tight">
                  Master-Led <span className="text-secondary">Computer Hardware</span> &{' '}
                  <span className="text-tertiary-container">PGDCA Teacher Training</span>
                </h2>
                <p className="text-xs sm:text-sm text-secondary font-bold uppercase tracking-wide">
                  Direct Practical Mentorship Under the Leadership of the Institute Director
                </p>
              </div>

              {/* Narrative / Context */}
              <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
                At HIT Computer Education, our Director actively leads specialized practical training sessions.
                Rather than relying solely on theoretical slides, students work on live diagnostic benches under his
                direct personal guidance—mastering chip-level PC hardware and training to become certified computer
                teachers and institutional faculty.
              </p>

              {/* 2 Focused Training Modules (Hardware & PGDCA Teacher Training) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Module 1: Computer Hardware Training */}
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">build</span>
                  </div>
                  <div>
                    <h3 className="font-headline text-sm font-bold text-primary">
                      Computer Hardware Training (CHW)
                    </h3>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Complete motherboard diagnostics, PC assembling, SMPS power supplies, CPU/RAM installation,
                      BIOS/CMOS setup, OS installation, and real-time troubleshooting.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] font-bold text-secondary">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>100% Practical Lab Bench Training</span>
                  </div>
                </motion.div>

                {/* Module 2: PGDCA & Teacher Training */}
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">school</span>
                  </div>
                  <div>
                    <h3 className="font-headline text-sm font-bold text-primary">
                      PGDCA & Teacher Training (CTT)
                    </h3>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Advanced diploma curriculum preparing professional educators. Covers pedagogical methodology,
                      IT syllabus delivery, lab coordination, and faculty certification.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>Prepares Certified Computer Faculty</span>
                  </div>
                </motion.div>
              </div>

              {/* Direct Mentor Highlights */}
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 space-y-2 text-xs">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
                  <span>Why Train Directly Under the Director?</span>
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-on-surface font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                    <span>Live component testing & multimeters</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                    <span>State-level computer teacher credentials</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                    <span>Industry internship & repair guidance</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                    <span>Personalized career mentorship</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleNavigate('/courses', 'courses')}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#072a6b] to-[#1a62c6] hover:from-[#0a3582] hover:to-[#2563eb] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">menu_book</span>
                  <span>Explore Hardware & PGDCA Syllabi</span>
                </button>
                <button
                  onClick={() => handleNavigate('/student-portal', 'student_portal')}
                  className="h-11 px-5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-bold text-xs sm:text-sm shadow-xs border border-outline-variant/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">how_to_reg</span>
                  <span>Apply for Training</span>
                </button>
              </div>
            </motion.div>

            {/* RIGHT HALF: Director Image with Framer Motion Animation & Floating Badges */}
            <motion.div
              className="lg:col-span-5 relative flex justify-center items-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className="relative w-full max-w-md">
                {/* Background Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-secondary/20 via-primary/10 to-tertiary-container/20 blur-xl opacity-70"></div>

                {/* Director Photo Card Frame */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-outline-variant/30 shadow-2xl bg-surface-container-lowest group">
                  <img
                    src={directorImg}
                    alt="Institute Director conducting training and institutional oversight"
                    className="w-full h-[400px] sm:h-[480px] object-cover object-top block transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Bottom Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-fixed block">
                      Leadership & Master Mentorship
                    </span>
                    <h3 className="font-headline text-lg sm:text-xl font-extrabold text-white">
                      Institute Director
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5 font-medium">
                      HIT Computer Education • H.I.T India Skill Development Foundation
                    </p>
                  </div>
                </div>

                {/* Floating Top Badge */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -top-4 -left-4 sm:-left-6 px-4 py-2 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md shadow-xl border border-outline-variant/30 flex items-center gap-2.5 z-20"
                >
                  <div className="w-8 h-8 rounded-xl bg-secondary text-white flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">workspace_premium</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Specialist</span>
                    <span className="text-xs font-extrabold text-primary">Hardware & PGDCA</span>
                  </div>
                </motion.div>

                {/* Floating Bottom Badge */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [4, -4, 4] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -right-4 sm:-right-6 px-4 py-2.5 rounded-2xl bg-primary text-white shadow-xl border border-white/20 flex items-center gap-2.5 z-20"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/70 uppercase font-bold block">Mentorship</span>
                    <span className="text-xs font-extrabold text-secondary-fixed">12,500+ Students</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Franchise Purchase & Center Affiliation Contact Section */}
      <section id="franchise-contact" className="w-full bg-surface-container-low py-16 px-margin-sm lg:px-margin-lg border-b border-outline-variant/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="material-symbols-outlined text-base">domain_add</span>
              <span>Authorized Training Centre (ATC) Franchise</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
              Start Your Own Computer Center — <span className="text-secondary">Get HIT Franchise</span>
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Partner with <strong>H.I.T India Skill Development Foundation</strong> (Registered under Ministry of Corporate Affairs, Govt. of India • ISO 9001:2015 Certified). Launch a prestigious computer training & university counseling centre in your district or town with low investment.
            </p>
          </div>

          {/* 2-Column Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Interactive Franchise Application Form */}
            <motion.div
              className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-md border border-outline-variant/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-6">
                <div>
                  <h3 className="font-headline text-xl font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">assignment</span>
                    <span>Franchise Purchase & Affiliation Form</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Fill out the form below. Our Franchise Onboarding Director will contact you within 24 hours.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold hidden sm:inline-block">
                  Session 2026–2027
                </span>
              </div>

              {franchiseSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-headline text-2xl font-bold text-primary">
                      Franchise Application Submitted!
                    </h4>
                    <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                      Thank you <strong>{franchiseForm.name}</strong>. Our Head Office Franchise Coordinator will call you shortly on <strong>{franchiseForm.phone}</strong> with the complete affiliation kit, fee structure, and MoU terms.
                    </p>
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFranchiseSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                    <a
                      href={`https://wa.me/919616764675?text=Hello%20HIT%20Franchise%20Team%2C%20I%20have%20submitted%20my%20application%20for%20${encodeURIComponent(franchiseForm.city || 'Center')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Connect on WhatsApp</span>
                      <span className="material-symbols-outlined text-sm">chat</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFranchiseSubmit} className="space-y-4 text-xs">
                  {/* Row 1: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-on-surface-variant block mb-1">
                        Director / Centre Owner Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar Singh"
                        value={franchiseForm.name}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20 text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant block mb-1">
                        Mobile Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9616764675 / 8115507046"
                        value={franchiseForm.phone}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20 text-on-surface"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & District/City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-on-surface-variant block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="centre@email.com"
                        value={franchiseForm.email}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20 text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant block mb-1">
                        Proposed City / Town & District *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ghosi / Mau / Azamgarh"
                        value={franchiseForm.city}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20 text-on-surface"
                      />
                    </div>
                  </div>

                  {/* Row 3: Centre Status & Infrastructure */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-on-surface-variant block mb-1">
                        Current Setup Status
                      </label>
                      <select
                        value={franchiseForm.centerType}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, centerType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option>New Computer Center</option>
                        <option>Already Running Center</option>
                        <option>School / College Lab</option>
                        <option>Coaching Institute</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-on-surface-variant block mb-1">
                        Computer Systems
                      </label>
                      <select
                        value={franchiseForm.pcCount}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, pcCount: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option>5 to 10 Computers</option>
                        <option>10 to 20 Computers</option>
                        <option>20+ Computers</option>
                        <option>Planning to Purchase</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-on-surface-variant block mb-1">
                        Lab Space Available
                      </label>
                      <select
                        value={franchiseForm.spaceAvailable}
                        onChange={(e) => setFranchiseForm({ ...franchiseForm, spaceAvailable: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option>300 to 500 Sq. Ft.</option>
                        <option>500 to 1,000 Sq. Ft.</option>
                        <option>1,000+ Sq. Ft.</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="font-bold text-on-surface-variant block mb-1">
                      Location Details / Any Specific Query
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter exact address, landmark, or your query about franchise fees, kit, and student exams..."
                      value={franchiseForm.message}
                      onChange={(e) => setFranchiseForm({ ...franchiseForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20 text-on-surface resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-emerald-600">lock</span>
                      <span>No Hidden Fees • Direct Head Office Affiliation</span>
                    </span>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#072a6b] to-[#1a62c6] hover:from-[#0a3582] hover:to-[#2563eb] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Submit Franchise Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* RIGHT COLUMN: Official Credentials & Direct Helpdesk Dossier */}
            <motion.div
              className="lg:col-span-5 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Franchise Support Hotlines Card */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/20">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#072a6b] to-[#1a62c6] text-white flex items-center justify-center font-bold shadow-md">
                    <span className="material-symbols-outlined text-2xl">support_agent</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                      Direct Franchise Desk
                    </span>
                    <h3 className="font-headline text-lg font-bold text-primary">Head Office Contacts</h3>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">call</span>
                    <div>
                      <span className="font-bold text-primary block">Calling & WhatsApp Support:</span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-semibold text-secondary">
                        <a href="tel:+919616764675" className="hover:underline flex items-center gap-1">
                          <span className="text-emerald-600 font-bold">●</span>
                          <span>+91 96167-64675</span>
                        </a>
                        <a href="tel:+918115507046" className="hover:underline flex items-center gap-1">
                          <span className="text-emerald-600 font-bold">●</span>
                          <span>+91 81155-07046</span>
                        </a>
                        <a href="tel:+919452078192" className="text-on-surface-variant hover:underline flex items-center gap-1">
                          <span>+91 94520-78192</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">pin_drop</span>
                    <div>
                      <span className="font-bold text-primary block">Registered HQ Address:</span>
                      <p className="text-on-surface-variant text-[11px] mt-0.5 leading-relaxed">
                        H.No.-117A, Malik Tola, Ward-11, Kasba Khas, Ghosi, Jamal Mirja Pur, Mau, Uttar Pradesh - 275105
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">mail</span>
                    <div className="w-full">
                      <span className="font-bold text-primary block">Official Franchise & Affiliation Emails:</span>
                      <div className="flex flex-col gap-1 mt-1 font-semibold text-secondary text-[11px] sm:text-xs">
                        <a href="mailto:hitindia.ghosi@gmail.com" className="hover:underline flex items-center gap-1.5 break-all">
                          <span className="material-symbols-outlined text-xs text-primary">send</span>
                          <span>hitindia.ghosi@gmail.com</span>
                        </a>
                        <a href="mailto:hitcomputer.ghosi@gmail.com" className="hover:underline flex items-center gap-1.5 break-all">
                          <span className="material-symbols-outlined text-xs text-primary">send</span>
                          <span>hitcomputer.ghosi@gmail.com</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://wa.me/919616764675?text=Hello%20HIT%20Team%2C%20I%20want%20to%20open%20a%20new%20Franchise%20Center."
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp: 9616764675</span>
                  </a>
                  <a
                    href="https://wa.me/918115507046?text=Hello%20HIT%20Team%2C%20I%20want%20to%20open%20a%20new%20Franchise%20Center."
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp: 8115507046</span>
                  </a>
                </div>
              </div>

              {/* Official Verification & Registration Certificates Preview */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                    <span>Govt. Registration & Accreditation</span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium">Click to inspect</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Certificate 1: MCA Govt. of India */}
                  <div
                    onClick={() => setActiveCertificateModal({
                      title: "Government of India — Ministry of Corporate Affairs",
                      subtitle: "Certificate of Incorporation • CIN: U85500UP2026NPL250943",
                      image: certificateImg,
                    })}
                    className="group relative rounded-2xl overflow-hidden border border-outline-variant/30 shadow-xs hover:shadow-lg transition-all cursor-pointer bg-black/5"
                  >
                    <img
                      src={certificateImg}
                      alt="Ministry of Corporate Affairs Certificate of Incorporation"
                      className="w-full h-32 object-cover object-top group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                      <span className="text-[10px] font-bold leading-tight line-clamp-1">Govt. MCA Certificate</span>
                      <span className="text-[9px] text-secondary-fixed">Click to view full</span>
                    </div>
                  </div>

                  {/* Certificate 2: ISO 9001:2015 */}
                  <div
                    onClick={() => setActiveCertificateModal({
                      title: "ISO 9001:2015 Certified Quality Management System",
                      subtitle: "Accredited for Vocational, Professional Skill & Educational Training",
                      image: isoImg,
                    })}
                    className="group relative rounded-2xl overflow-hidden border border-outline-variant/30 shadow-xs hover:shadow-lg transition-all cursor-pointer bg-black/5"
                  >
                    <img
                      src={isoImg}
                      alt="ISO 9001:2015 Quality Management System Certificate"
                      className="w-full h-32 object-cover object-top group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                      <span className="text-[10px] font-bold leading-tight line-clamp-1">ISO 9001:2015 Seal</span>
                      <span className="text-[9px] text-secondary-fixed">Click to view full</span>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* Giving & Donation Callout */}
      <section className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg py-16">
        <div className="bg-gradient-to-r from-[#000d29] via-[#072a6b] via-[#0d4499] to-[#1a62c6] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-tertiary-fixed text-xs font-bold mb-3">
              <span className="material-symbols-outlined text-sm">volunteer_activism</span>
              Section 8 Non-Profit • 50% Tax Exemption
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold leading-tight">
              Support Digital Literacy for Underprivileged Girls & Rural Youths
            </h2>
            <p className="text-on-primary-container text-sm sm:text-base mt-2 leading-relaxed">
              Your donation to H.I.T India Skill Development Foundation is eligible for 50% tax exemption under Section 80G(5)(iv) of the Income Tax Act. Every rupee directly funds computer hardware and lab infrastructure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => handleNavigate('/donation', 'donation')}
              className="h-12 px-6 rounded-xl bg-tertiary-container hover:bg-tertiary-container/90 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">volunteer_activism</span>
              <span>Donate Online (80G)</span>
            </button>
            <button
              onClick={() => handleNavigate('/receipt', 'receipt')}
              className="h-12 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">receipt_long</span>
              <span>View 80G Voucher</span>
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
                className="px-4 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-xs cursor-pointer"
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

