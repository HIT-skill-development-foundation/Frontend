import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../routes/routesConfig';
import logo from '../assets/images/logo.jpeg';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (link) => {
    if (setActiveTab && link.id) {
      setActiveTab(link.id);
    }
    if (link.path.startsWith('/#')) {
      const hash = link.path.substring(2);
      if (location.pathname === '/') {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } else {
      navigate(link.path);
    }
    setMobileMenuOpen(false);
  };

  const isLinkActive = (link) => {
    if (location.pathname === link.path) return true;
    if (link.path !== '/' && !link.path.startsWith('/#') && location.pathname.startsWith(link.path)) return true;
    if (link.hasDropdown && link.children?.some((c) => location.pathname === c.path)) return true;
    if (activeTab && activeTab === link.id) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#001338]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,14,40,0.35)] border-b border-white/15 py-1'
          : 'bg-[#001338] border-b border-white/10 py-0'
      } text-white`}
    >
      {/* Top Utility Bar: Foundation Giving, Helpline & Accreditation */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          scrolled ? 'max-h-0 opacity-0 py-0 border-transparent' : 'max-h-12 opacity-100 py-1.5 bg-[#000e26] border-b border-white/10'
        } text-white/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-medium tracking-wide`}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-secondary-fixed font-semibold text-[11px] uppercase tracking-wider">
            Govt. Registered Skill Mission | NITI Aayog & MCA Approved
          </span>
          <span className="hidden xl:inline text-white/20">|</span>
          <span className="hidden xl:inline text-white/70">
            Kasba Khas, Ghosi, Mau (U.P.) - 275105
          </span>
        </div>

        {/* Top-Bar Right: Giving & Support Links (Shifted from main nav) */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => handleNavClick({ path: '/donation', id: 'donation' })}
            className="text-white/75 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[13px] text-emerald-400">volunteer_activism</span>
            <span>Support / Donate (80G)</span>
          </button>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={() => handleNavClick({ path: '/become-member', id: 'become_member' })}
            className="text-white/75 hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[13px] text-secondary-fixed">group</span>
            <span>Become Member</span>
          </button>
          <span className="text-white/20 hidden sm:inline">|</span>
          <a
            href="tel:1800HITSKILL"
            className="text-white/85 hover:text-white transition-colors hidden sm:inline"
          >
            <span className="font-semibold">Toll-Free: 1800-HIT-SKILL</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between py-2.5">
        {/* Brand / Logo */}
        <div
          onClick={() => handleNavClick({ path: '/', id: 'home' })}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden p-0.5 bg-white/10 ring-1 ring-white/20 shadow-sm group-hover:scale-105 transition-all shrink-0 flex items-center justify-center">
            <img
              src={logo}
              alt="HIT Computer Education Official Logo"
              className="w-full h-full object-cover rounded-[10px] block"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                HIT COMPUTER EDUCATION
              </span>
              <span className="text-[10px] font-semibold text-secondary-fixed tracking-wider">
                ISO 9001
              </span>
            </div>
            <span className="text-[10.5px] text-white/60 font-normal tracking-wide hidden sm:inline">
              Academic Wing of H.I.T India Skill Development Foundation
            </span>
          </div>
        </div>

        {/* Desktop Nav Links (Option 2: Home, Course Offer, Gallery, About Us, Franchise) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 ml-auto">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'text-white border-b-2 border-secondary-fixed font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action CTA Buttons: Student Portal + Register Now */}
        <div className="hidden lg:flex items-center gap-2.5 ml-4 pl-4 border-l border-white/15">
          <button
            type="button"
            onClick={() => handleNavClick({ path: '/student-portal', id: 'student_portal' })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              location.pathname === '/student-portal'
                ? 'bg-white/15 border-white/40 text-white font-semibold'
                : 'border-white/20 text-white/90 hover:text-white hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-secondary-fixed">badge</span>
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick({ path: '/admission', id: 'admission' })}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
            <span>Register Now</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer border border-white/20"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#001030]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-4 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
          {/* Main Links */}
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`p-2.5 rounded-lg text-left text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    active
                      ? 'bg-secondary text-white font-bold shadow-md'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-secondary-fixed">
                    {link.icon || 'arrow_forward'}
                  </span>
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Student CTA Area */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => handleNavClick({ path: '/admission', id: 'admission' })}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">how_to_reg</span>
              <span>Register Now / Online Admission</span>
            </button>

            <button
              onClick={() => handleNavClick({ path: '/student-portal', id: 'student_portal' })}
              className="w-full py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-secondary-fixed">badge</span>
              <span>Student Portal Login</span>
            </button>
          </div>

          {/* Foundation & Giving Links */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
            <button
              onClick={() => handleNavClick({ path: '/donation', id: 'donation' })}
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-emerald-400">volunteer_activism</span>
              <span>Donate (80G)</span>
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => handleNavClick({ path: '/become-member', id: 'become_member' })}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-secondary-fixed">group</span>
              <span>Become Member</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
