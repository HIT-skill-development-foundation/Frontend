import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../routes/routesConfig';
import logo from '../assets/images/logo.jpeg';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (link) => {
    if (setActiveTab) {
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
    if (link.hasDropdown && link.children?.some(c => location.pathname === c.path)) return true;
    if (activeTab && activeTab === link.id) return true;
    return false;
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-gradient-to-r from-[#001438] via-[#092252] to-[#153478] text-white shadow-[0_4px_25px_rgba(0,18,51,0.25)] border-b border-white/10 backdrop-blur-md">
      {/* Top Notification Strip */}
      <div className="bg-black/25 text-white/90 px-margin-sm lg:px-margin-lg py-1.5 flex items-center justify-between text-label-sm font-label-sm border-b border-white/10">
        <div className="flex items-center gap-space-md flex-wrap">
          <span className="flex items-center gap-space-xs text-secondary-fixed font-semibold">
            <span className="material-symbols-outlined text-sm">verified</span>
            Govt. Registered Skill Initiative | NITI Aayog & MCA Approved
          </span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:flex items-center gap-space-xs text-white/80">
            <span className="material-symbols-outlined text-sm">pin_drop</span>
            Kasba Khas, Ghosi, Mau, UP - 275105
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <a
            href="tel:1800HITSKILL"
            className="flex items-center gap-space-xs text-white hover:text-secondary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            Toll-Free: 1800-HIT-SKILL
          </a>
          <span className="hidden sm:inline text-white/30">|</span>
          <a href="tel:+919616764675" className="hidden sm:inline text-white/80 hover:text-secondary-fixed transition-colors">
            Direct: +91 96167-64675 / 81155-07046
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-margin-sm lg:px-margin-lg w-full flex items-center justify-between py-2.5">
        {/* Brand Crest */}
        <div 
          onClick={() => handleNavClick({ path: '/', id: 'home' })}
          className="flex items-center gap-3.5 sm:gap-4 mr-6 lg:mr-10 xl:mr-12 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0 border-2 border-secondary-fixed/70 bg-white flex items-center justify-center">
            <img
              src={logo}
              alt="HIT Computer Education Official Logo"
              className="w-full h-full object-cover scale-[1.12] block"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight drop-shadow-xs">
              HIT COMPUTER EDUCATION
            </span>
            <span className="text-[10px] text-secondary-fixed/90 font-medium hidden sm:inline">
              Academic Wing of H.I.T India Skill Development Foundation
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 ml-auto lg:ml-6 xl:ml-10">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);

            if (link.hasDropdown) {
              return (
                <div key={link.id} className="relative group">
                  <button
                    onClick={() => handleNavClick(link.children[0])}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-secondary text-white shadow-md ring-1 ring-white/30'
                        : 'text-white/85 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                    <span>{link.label}</span>
                    <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:rotate-180 text-white/70">
                      expand_more
                    </span>
                  </button>

                  {/* Dropdown Menu on Hover */}
                  <div className="absolute right-0 top-full pt-2 w-64 z-50 pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
                    <div className="bg-[#092252]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 ring-1 ring-black/20">
                      {link.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleNavClick(child)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-white/15 transition-all flex items-center gap-3 group/item cursor-pointer text-white"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/10 group-hover/item:bg-secondary flex items-center justify-center shrink-0 transition-colors text-white">
                            <span className="material-symbols-outlined text-base">{child.icon}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold leading-tight group-hover/item:text-secondary-fixed transition-colors">
                              {child.label}
                            </span>
                            <span className="text-[10px] text-white/70 leading-tight mt-0.5">
                              {child.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-secondary text-white shadow-md ring-1 ring-white/30'
                    : link.highlight
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs font-extrabold'
                    : link.admin
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'text-white/85 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Toggle Button (Visible on smaller screens) */}
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

      {/* Mobile Drawer Menu with Matching Gradient */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-[#092252] to-[#001438] border-t border-white/15 px-4 py-3 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => {
              if (link.hasDropdown) {
                return link.children.map((child) => {
                  const activeChild = location.pathname === child.path;
                  return (
                    <button
                      key={child.id}
                      onClick={() => handleNavClick(child)}
                      className={`p-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                        activeChild
                          ? 'bg-secondary text-white font-bold shadow-md ring-1 ring-white/30'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{child.icon}</span>
                      <span className="truncate">{child.label}</span>
                    </button>
                  );
                });
              }
              const active = isLinkActive(link);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`p-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    active
                      ? 'bg-secondary text-white font-bold shadow-md ring-1 ring-white/30'
                      : link.highlight
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
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
