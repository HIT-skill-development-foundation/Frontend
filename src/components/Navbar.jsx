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
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#001338]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,14,40,0.35)] border-b border-white/15 py-1' 
        : 'bg-[#001338] border-b border-white/10 py-0'
    } text-white`}>
      
      <div className={`transition-all duration-300 overflow-hidden ${
        scrolled ? 'max-h-0 opacity-0 py-0 border-transparent' : 'max-h-12 opacity-100 py-1.5 bg-[#000e26] border-b border-white/10'
      } text-white/90 px-margin-sm lg:px-margin-lg flex items-center justify-between text-[11px] font-medium tracking-wide`}>
        <div className="flex items-center gap-space-md flex-wrap">
          <span className="text-secondary-fixed font-semibold text-[11px] uppercase tracking-wider">
            Govt. Registered Skill Initiative | NITI Aayog & MCA Approved
          </span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline text-white/70">
            Kasba Khas, Ghosi, Mau, UP - 275105
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="tel:1800HITSKILL"
            className="text-white/85 hover:text-white transition-colors"
          >
            <span className="font-semibold">Toll-Free: 1800-HIT-SKILL</span>
          </a>
          <span className="hidden sm:inline text-white/20">|</span>
          <a href="tel:+919616764675" className="hidden sm:inline text-white/70 hover:text-white transition-colors">
            Direct: +91 96167-64675
          </a>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between py-2.5">
        
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

        
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 ml-auto">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);

            if (link.hasDropdown) {
              return (
                <div key={link.id} className="relative group">
                  <button
                    onClick={() => handleNavClick(link.children[0])}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'text-white border-b-2 border-secondary-fixed font-bold'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                  </button>

                  
                  <div className="absolute right-0 top-full pt-2 w-60 z-50 pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
                    <div className="bg-[#001030]/95 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl p-1.5 flex flex-col gap-1 ring-1 ring-black/40">
                      {link.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleNavClick(child)}
                          className="w-full text-left p-2.5 rounded hover:bg-white/10 transition-all flex flex-col group/item cursor-pointer text-white"
                        >
                          <span className="text-xs font-semibold leading-tight group-hover/item:text-secondary-fixed transition-colors">
                            {child.label}
                          </span>
                          <span className="text-[10.5px] text-white/60 leading-tight mt-0.5">
                            {child.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            if (link.highlight) {
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className="btn-accent h-8 px-3.5 text-xs ml-1"
                >
                  <span>{link.label}</span>
                </button>
              );
            }

            if (link.admin) {
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className="btn-outline-dark h-8 px-3.5 text-xs"
                >
                  <span>{link.label}</span>
                </button>
              );
            }

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

      
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#001030]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => {
              if (link.hasDropdown) {
                return link.children.map((child) => {
                  const activeChild = location.pathname === child.path;
                  return (
                    <button
                      key={child.id}
                      onClick={() => handleNavClick(child)}
                      className={`p-2.5 rounded-lg text-left text-xs sm:text-sm font-semibold flex flex-col cursor-pointer transition-colors ${
                        activeChild
                          ? 'bg-secondary text-white font-bold shadow-md'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
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
                  className={`p-2.5 rounded-lg text-left text-xs sm:text-sm font-semibold flex flex-col cursor-pointer transition-colors ${
                    active
                      ? 'bg-secondary text-white font-bold shadow-md'
                      : link.highlight
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
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
