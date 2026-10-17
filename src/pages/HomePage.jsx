import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { centresList } from '../data/mockData';
import mainBanner from '../assets/images/main.jpeg';
import main2Banner from '../assets/images/main2.jpeg';

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

      {/* Network of Training Centres */}
      <section className="w-full bg-surface-container-low py-16">
        <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin-lg">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-xs">
              Purvanchal & Uttar Pradesh Network
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary mt-2">
              Authorized Training Centres
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">
              Equipped with modern computer hardware, high-speed fiber internet, and certified instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {centresList.map((centre) => (
              <div
                key={centre.id}
                className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/30 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">location_city</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-secondary font-bold">{centre.id}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {centre.status}
                    </span>
                  </div>
                  <h4 className="font-headline text-sm font-bold text-primary truncate mt-0.5">{centre.name}</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-snug">{centre.address}</p>
                </div>
              </div>
            ))}
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
