import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudent } from '../store/hooks';
import { NAV_LINKS } from '../routes/routesConfig';
import logo2 from '../assets/images/logo2.jpeg';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { student, isLoggedIn } = useStudent();

  const handleNavClick = (link) => {
    if (setActiveTab) {
      setActiveTab(link.id);
    }
    navigate(link.path);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (link) => {
    if (location.pathname === link.path) return true;
    if (link.path !== '/' && location.pathname.startsWith(link.path)) return true;
    if (activeTab && activeTab === link.id) return true;
    return false;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      {/* Top Notification Strip */}
      <div className="bg-primary text-on-primary px-margin-sm lg:px-margin-lg py-1.5 flex items-center justify-between text-label-sm font-label-sm">
        <div className="flex items-center gap-space-md flex-wrap">
          <span className="flex items-center gap-space-xs text-secondary-fixed">
            <span className="material-symbols-outlined text-sm">verified</span>
            Govt. Registered Skill Initiative | NITI Aayog & MCA Approved
          </span>
          <span className="hidden md:inline text-outline-variant">|</span>
          <span className="hidden md:flex items-center gap-space-xs text-surface-container-high">
            <span className="material-symbols-outlined text-sm">pin_drop</span>
            Kasba Khas, Ghosi, Mau, UP - 275105
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <a
            href="tel:1800HITSKILL"
            className="flex items-center gap-space-xs text-on-primary hover:text-secondary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            Toll-Free: 1800-HIT-SKILL
          </a>
          <span className="hidden sm:inline text-outline-variant">|</span>
          <span className="hidden sm:inline text-surface-container-high">Direct: +91 94520-78192</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin-lg w-full flex items-center justify-between py-2.5">
        {/* Brand Crest */}
        <div 
          onClick={() => handleNavClick({ path: '/', id: 'home' })}
          className="flex items-center gap-space-sm cursor-pointer select-none group shrink-0"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform shrink-0 border-2 border-secondary/20 bg-white p-0.5">
            <img
              src={logo2}
              alt="H.I.T India Skill Development Foundation Official Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-sm sm:text-base font-extrabold tracking-tight text-primary leading-tight">
              HIT COMPUTER EDUCATION
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium hidden sm:inline">
              Academic Wing of H.I.T India Skill Development Foundation
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (The 8 Exact Nav Items) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-primary text-on-primary shadow-sm'
                    : link.highlight
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed/80'
                    : link.admin
                    ? 'text-primary bg-primary/5 hover:bg-primary/10'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Student Profile / Login Button & Mobile Toggle */}
        <div className="flex items-center gap-space-sm">
          {isLoggedIn ? (
            <button
              onClick={() => handleNavClick({ path: '/student-portal', id: 'student_portal' })}
              className="hidden sm:flex items-center gap-2 bg-surface-container-low px-2.5 py-1 rounded-xl shadow-xs hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/30"
              title="Open Student Portal"
            >
              <img
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-primary/20"
                src={student.photoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC7w1t1k4oE5UqY7CjyUR9wr4ds1UGeSFZ3ypw5-HptD0EkF58K5E_vmI_bA_f-uvoCN_b5QE-r2mxd-Qkmddhft6wn7PXH7whtkiBb1dTJDjJVOyAKIo7zA0yQzmr4PUxGNfinra069nOa3zmuRri1yPodaLmd6-OIFQGJKZaRvAf485ZePcjl6rZon7kqfgLE1uKxMG6GpvCoyemhXKNm4PSZixEqRPRApUwBqT4PhqUJoBZ3PrTiSQ"}
              />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-primary leading-none">
                  {student.fullName ? student.fullName.split(' ')[0] : 'Rahul'}
                </span>
                <span className="text-[9px] text-on-surface-variant leading-none mt-0.5">
                  {student.rollNo || 'HIT-STU'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick({ path: '/student-portal', id: 'student_portal' })}
              className="hidden sm:flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-primary/20"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span>Student Login</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary cursor-pointer"
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
        <div className="lg:hidden bg-surface-container-lowest border-t border-outline-variant/30 px-4 py-3 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`p-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
