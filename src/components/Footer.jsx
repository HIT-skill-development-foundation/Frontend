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
    <footer className="w-full bg-primary text-on-primary">
      {/* Top Credentials Ribbon */}
      <div className="bg-primary-container/80 border-b border-outline-variant/20 py-space-md px-margin-sm lg:px-margin-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-md text-label-sm font-label-sm">
          <div className="flex items-center gap-space-sm flex-wrap text-surface-container-high">
            <span className="flex items-center gap-1 text-secondary-fixed font-semibold">
              <span className="material-symbols-outlined text-base">policy</span>
              Section 8 Non-Profit
            </span>
            <span>•</span>
            <span>MCA CIN: U85300UP2021NPL148821</span>
            <span>•</span>
            <span>NITI Aayog NGO Darpan: UP/2021/0284729</span>
            <span>•</span>
            <span>Income Tax 80G(5)(iv) Registered</span>
          </div>
          <div className="flex items-center gap-space-md text-surface-container-high">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="material-symbols-outlined text-base">security</span>
              ISO 9001:2015 Certified
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin-lg">
        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-lg py-space-xl">
          {/* Col 1: About */}
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <div 
              onClick={() => handleNav('/', 'home')}
              className="flex items-center gap-space-sm cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shrink-0 border border-secondary/30 group-hover:scale-105 transition-transform">
                <img
                  src={logo2}
                  alt="H.I.T India Skill Development Foundation"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <span className="font-headline text-lg font-bold text-white block">H.I.T INDIA</span>
                <span className="text-xs text-secondary-fixed block">Skill Development Foundation</span>
              </div>
            </div>
            <p className="font-body-md text-sm text-on-primary-container leading-relaxed">
              Academic Wing: <strong className="text-white">HIT Computer Education</strong>. Providing rural and semi-urban youths across Purvanchal and Uttar Pradesh with verified technical literacy, vocational competence, and government-recognized diplomas.
            </p>
            <div className="flex items-center gap-2 text-xs text-surface-container-highest pt-2">
              <span className="material-symbols-outlined text-sm text-tertiary-fixed">location_on</span>
              <span>Jamal Mirzapur, Kasba Khas, Ghosi, Mau, Uttar Pradesh - 275105</span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-surface-container-highest pt-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-tertiary-fixed">call</span>
                <div className="flex flex-wrap gap-2">
                  <a href="tel:+919616764675" className="hover:text-white transition-colors font-medium">+91 96167-64675</a>
                  <span>•</span>
                  <a href="tel:+918115507046" className="hover:text-white transition-colors font-medium">+91 81155-07046</a>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="material-symbols-outlined text-sm text-tertiary-fixed">mail</span>
                <a href="mailto:hitindia.ghosi@gmail.com" className="hover:text-white transition-colors underline decoration-white/30">hitindia.ghosi@gmail.com</a>
                <span>•</span>
                <a href="mailto:hitcomputer.ghosi@gmail.com" className="hover:text-white transition-colors underline decoration-white/30">hitcomputer.ghosi@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Col 2: Academic Portals */}
          <div>
            <h4 className="font-headline text-sm font-bold text-secondary-fixed uppercase tracking-wider mb-space-sm">
              Academic Portals
            </h4>
            <ul className="space-y-2 text-sm text-on-primary-container">
              <li>
                <button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer">
                  Course Offerings
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/student-portal', 'student_portal')} className="hover:text-white transition-colors cursor-pointer">
                  Student Sign In / Sign Up
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/student-portal', 'student_portal')} className="hover:text-white transition-colors cursor-pointer">
                  Digital PVC ID Card
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/verification', 'verification')} className="hover:text-white transition-colors cursor-pointer">
                  Certificate Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Courses */}
          <div>
            <h4 className="font-headline text-sm font-bold text-secondary-fixed uppercase tracking-wider mb-space-sm">
              Programs
            </h4>
            <ul className="space-y-2 text-sm text-on-primary-container">
              <li><button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer">ADCA (12 Months - ₹12,000)</button></li>
              <li><button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer">DCA (12 Months - ₹12,000)</button></li>
              <li><button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer">PGDCA (12 Months - ₹22,000)</button></li>
              <li><button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer">CCC (3 Months - ₹3,500)</button></li>
              <li><button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer">Tally 9 ERP (3 Months - ₹3,500)</button></li>
              <li><button onClick={() => handleNav('/courses', 'courses')} className="hover:text-white transition-colors cursor-pointer">DTP (6 Months - ₹6,000)</button></li>
            </ul>
          </div>

          {/* Col 4: Foundation Giving & Portals */}
          <div>
            <h4 className="font-headline text-sm font-bold text-secondary-fixed uppercase tracking-wider mb-space-sm">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-on-primary-container">
              <li>
                <button onClick={() => handleNav('/about', 'about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/gallery', 'gallery')} className="hover:text-white transition-colors cursor-pointer">
                  Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/donation', 'donation')} className="hover:text-white transition-colors cursor-pointer">
                  Donate Online (80G)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/become-member', 'become_member')} className="hover:text-white transition-colors cursor-pointer">
                  Become a Member
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/admin', 'admin')} className="hover:text-white transition-colors cursor-pointer text-secondary-fixed font-bold">
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline-variant/20 py-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-label-sm font-label-sm text-surface-container-high">
          <p>© 2026 H.I.T India Skill Development Foundation. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-space-md">
            <span>Kasba Khas, Ghosi, Mau Central Campus</span>
            <span>•</span>
            <a href="tel:+919616764675" className="hover:text-white transition-colors">+91 96167-64675</a>
            <span>•</span>
            <a href="tel:+918115507046" className="hover:text-white transition-colors">+91 81155-07046</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
