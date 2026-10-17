import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import mainBanner from '../assets/images/main.jpeg';
import main2Banner from '../assets/images/main2.jpeg';
import directorImg from '../assets/images/director.jpeg';

export default function HomePage({ setActiveTab }) {
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col w-full">
      {/* Session Header Banner */}
      <div className="w-full bg-primary text-on-primary py-space-sm px-margin-sm lg:px-margin-lg shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-label-sm font-label-sm">
            <span className="text-on-primary/70">HIT Computer Education</span>
            <span className="text-on-primary/40">/</span>
            <span className="text-secondary-fixed font-semibold">Student Admissions Session 2026-2027</span>
          </div>
          <div className="flex items-center gap-space-xs bg-primary-container px-space-sm py-1 rounded-full text-label-sm font-label-sm text-secondary-fixed">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Admissions Open • Direct Enrollment Portal (Flat ₹100)</span>
          </div>
        </div>
      </div>

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm">
              <span className="font-headline text-3xl font-extrabold text-primary block">12,500+</span>
              <span className="font-label-md text-xs text-on-surface-variant font-medium mt-1 block">Certified Students</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm">
              <span className="font-headline text-3xl font-extrabold text-secondary block">48+</span>
              <span className="font-label-md text-xs text-on-surface-variant font-medium mt-1 block">Affiliated Centres</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm">
              <span className="font-headline text-3xl font-extrabold text-on-tertiary-container block">98.4%</span>
              <span className="font-label-md text-xs text-on-surface-variant font-medium mt-1 block">Course Completion</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm">
              <span className="font-headline text-3xl font-extrabold text-emerald-600 block">100%</span>
              <span className="font-label-md text-xs text-on-surface-variant font-medium mt-1 block">QR Verified Diplomas</span>
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
                  className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
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

      {/* Giving & Donation Callout */}
      <section className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg py-16">
        <div className="bg-gradient-to-r from-primary-container via-primary to-primary-container text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
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
    </div>
  );
}
