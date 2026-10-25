import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from '../assets/images/logo2.jpeg';

export default function Footer({ setActiveTab }) {
  const navigate = useNavigate();

  const handleNav = (path, tabId) => {
    if (setActiveTab && tabId) {
      setActiveTab(tabId);
    }
    navigate(path);
  };

  return (
    <footer className="w-full bg-[#001338]/95 backdrop-blur-xl text-slate-300 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => handleNav('/', 'home')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <img
                src={logo2}
                alt="HIT India"
                className="w-10 h-10 rounded-lg object-contain bg-white p-0.5"
              />
              <div>
                <span className="text-base font-bold text-white tracking-tight block">
                  H.I.T INDIA
                </span>
                <span className="text-xs text-secondary-fixed font-mono block">
                  Skill Development Foundation
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300/90 leading-relaxed max-w-sm">
              Empowering rural and semi-urban youths with certified IT literacy, vocational training, and recognized technical diplomas.
            </p>

            <div className="space-y-1 text-xs text-slate-300/80 pt-2 font-mono">
              <p className="font-sans text-slate-300">Kasba Khas, Ghosi, Mau, Uttar Pradesh — 275105</p>
              <p>
                <a href="tel:+919616764675" className="hover:text-white transition-colors text-white/90">
                  +91 96167-64675
                </a>
                <span className="mx-2 text-white/40">/</span>
                <a href="tel:+918115507046" className="hover:text-white transition-colors text-white/90">
                  +91 81155-07046
                </a>
              </p>
              <p>
                <a href="mailto:hitindia.ghosi@gmail.com" className="hover:text-white transition-colors underline decoration-white/20 text-white/90 font-sans">
                  hitindia.ghosi@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Academic Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary-fixed">
              Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button onClick={() => handleNav('/student-portal', 'student_portal')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Student Sign In
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/student-portal', 'student_portal')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Digital ID Card
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/verification', 'verification')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Certificate Verification
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/become-member', 'become_member')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Center Affiliation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/admin', 'admin')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary-fixed">
              Programs
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer text-left">
                  ADCA (12 Months)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer text-left">
                  DCA (12 Months)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer text-left">
                  PGDCA (1 Year)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer text-left">
                  CCC (3 Months)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Tally Prime with GST
                </button>
              </li>
            </ul>
          </div>

          {/* Foundation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary-fixed">
              Foundation
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button onClick={() => handleNav('/about', 'about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer text-left">
                  All Courses
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/gallery', 'gallery')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/donation', 'donation')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Donate Online (80G)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/receipt', 'receipt')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Download 80G Receipt
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Simple Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 H.I.T India Skill Development Foundation. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>MCA CIN: U85300UP2021NPL148821</span>
            <span>•</span>
            <span>Sec 8 Non-Profit</span>
            <span>•</span>
            <span>80G(5)(iv)</span>
            <span>•</span>
            <span>ISO 9001:2015</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
