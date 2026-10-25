import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from '../assets/images/logo2.jpeg';
import imgDirector from '../assets/images/director.jpeg';
import imgHeadOffice from '../assets/images/headoffice.jpeg';
import certificateImg from '../assets/images/certificate.jpeg';
import isoImg from '../assets/images/iso.jpeg';

export default function AboutUsPage() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="flex flex-col w-full pb-space-xl">
      
      <div className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] to-[#0d4499] text-white py-space-sm px-margin-sm lg:px-margin-lg shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
          <div className="flex items-center gap-space-xs">
            <span className="text-white/70">Institutional Profile</span>
            <span className="text-white/40">/</span>
            <span className="text-secondary-fixed font-semibold">About H.I.T India Skill Development Foundation</span>
          </div>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="material-symbols-outlined text-sm">verified</span>
            Section 8 Non-Profit Registered Entity • ISO 9001:2015
          </span>
        </div>
      </div>

      
      <section className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] via-[#0d4499] to-[#1a62c6] text-white py-16 px-margin-sm lg:px-margin-lg shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-secondary-fixed text-xs font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">account_balance</span>
              MCA Reg. CIN: U85500UP2026NPL250943
            </div>
            <h1 className="font-headline text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Empowering Purvanchal & Uttar Pradesh With Technical Competence
            </h1>
            <p className="font-body-lg text-base sm:text-lg text-surface-container-high mt-4 leading-relaxed">
              H.I.T India Skill Development Foundation (Academic Wing: <strong>HIT Computer Education</strong>) is a government-registered Section 8 non-profit organisation established to bridge the rural-urban digital divide by providing industry-certified computer education, vocational training, and employment-linked skills.
            </p>
            <div className="pt-6 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/courses')}
                className="btn-accent h-11 px-6"
              >
                Explore Courses
              </button>
              <button
                onClick={() => navigate('/donation')}
                className="btn-outline-dark h-11 px-6"
              >
                Donate for Student Kits
              </button>
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0 bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-white p-1 border-2 border-secondary/40 shadow-lg mb-4">
              <img src={logo2} alt="Foundation Seal" className="w-full h-full object-contain rounded-full" />
            </div>
            <h3 className="font-headline text-lg font-bold text-white">Central Registrar Office</h3>
            <p className="text-xs text-surface-container-high mt-1">
              Kasba Khas, Ward 4, Near Post Office, Ghosi, Mau, Uttar Pradesh - 275105
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-surface-container-high">
                <span>MCA Govt. CIN:</span>
                <strong className="text-white">U85500UP2026NPL250943</strong>
              </div>
              <div className="flex items-center justify-between text-surface-container-high">
                <span>NITI Aayog Darpan:</span>
                <strong className="text-white">UP/2021/0284729</strong>
              </div>
              <div className="flex items-center justify-between text-surface-container-high">
                <span>Income Tax 80G:</span>
                <strong className="text-emerald-300">50% Exemption</strong>
              </div>
              <div className="flex items-center justify-between text-surface-container-high">
                <span>Quality Standard:</span>
                <strong className="text-secondary-fixed">ISO 9001:2015 QMS</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="w-full bg-surface-container-low py-16 px-margin-sm lg:px-margin-lg border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block">
              Official Government & Quality Accreditations
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
              Statutory Incorporation & ISO 9001:2015 Certified
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              H.I.T India Skill Development Foundation operates under legal incorporation granted by the Ministry of Corporate Affairs, Government of India, and is audited under ISO 9001:2015 Quality Management standards.
            </p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            
            <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-all group">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">account_balance</span>
                    <span>Ministry of Corporate Affairs • Govt. of India</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">zoom_in</span>
                    Click to inspect
                  </span>
                </div>
                
                <h3 className="font-headline text-xl font-bold text-primary">
                  Certificate of Incorporation
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 mb-4">
                  Section 8 of the Companies Act, 2013 • CIN: <strong>U85500UP2026NPL250943</strong>
                </p>
                
                
                <div 
                  onClick={() => setActiveModal({
                    title: "Government of India — Ministry of Corporate Affairs",
                    subtitle: "Certificate of Incorporation (Section 8 Non-Profit Company) • CIN: U85500UP2026NPL250943",
                    image: certificateImg,
                  })}
                  className="relative rounded-2xl overflow-hidden border border-outline-variant/40 shadow-inner bg-black/5 cursor-pointer group-hover:border-primary/50 transition-colors"
                >
                  <img
                    src={certificateImg}
                    alt="Ministry of Corporate Affairs Official Certificate of Incorporation"
                    className="w-full h-72 sm:h-80 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                      <span className="material-symbols-outlined text-base text-secondary-fixed">fullscreen</span>
                      Click to View Full Resolution MCA Document
                    </span>
                    <span className="text-[10px] text-white/80">Govt. Seal, Central Registration Stamp & Digital Registrar Signature</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
                <span className="font-semibold text-primary">Status: Active & Registered</span>
                <button
                  type="button"
                  onClick={() => setActiveModal({
                    title: "Government of India — Ministry of Corporate Affairs",
                    subtitle: "Certificate of Incorporation (Section 8 Non-Profit Company) • CIN: U85500UP2026NPL250943",
                    image: certificateImg,
                  })}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Inspect Full Certificate</span>
                  <span className="material-symbols-outlined text-sm">open_in_full</span>
                </button>
              </div>
            </div>

            
            <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-all group">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span>International Quality Accreditation</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">zoom_in</span>
                    Click to inspect
                  </span>
                </div>

                <h3 className="font-headline text-xl font-bold text-primary">
                  ISO 9001:2015 Quality System
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 mb-4">
                  Accreditation: <strong>Vocational, Professional Skill & Educational Training</strong>
                </p>

                
                <div 
                  onClick={() => setActiveModal({
                    title: "ISO 9001:2015 Quality Management System Certificate",
                    subtitle: "Accredited for Vocational, Professional Skill & Educational Training",
                    image: isoImg,
                  })}
                  className="relative rounded-2xl overflow-hidden border border-outline-variant/40 shadow-inner bg-black/5 cursor-pointer group-hover:border-primary/50 transition-colors"
                >
                  <img
                    src={isoImg}
                    alt="ISO 9001:2015 Quality Management System Certification Seal"
                    className="w-full h-72 sm:h-80 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                      <span className="material-symbols-outlined text-base text-secondary-fixed">fullscreen</span>
                      Click to View Full Resolution ISO Seal
                    </span>
                    <span className="text-[10px] text-white/80">Accredited Scope: Educational Training & Skill Development</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
                <span className="font-semibold text-emerald-700">Verified Quality Management</span>
                <button
                  type="button"
                  onClick={() => setActiveModal({
                    title: "ISO 9001:2015 Quality Management System Certificate",
                    subtitle: "Accredited for Vocational, Professional Skill & Educational Training",
                    image: isoImg,
                  })}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Inspect Full Certificate</span>
                  <span className="material-symbols-outlined text-sm">open_in_full</span>
                </button>
              </div>
            </div>

          </div>

          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 text-center shadow-xs">
              <span className="text-lg font-extrabold text-primary block">Govt. of India</span>
              <span className="text-[11px] text-on-surface-variant font-medium">MCA Section 8 Reg.</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 text-center shadow-xs">
              <span className="text-lg font-extrabold text-primary block">NITI Aayog</span>
              <span className="text-[11px] text-on-surface-variant font-medium">NGO Darpan Verified</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 text-center shadow-xs">
              <span className="text-lg font-extrabold text-emerald-700 block">Section 80G</span>
              <span className="text-[11px] text-on-surface-variant font-medium">50% Tax Exemption</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 text-center shadow-xs">
              <span className="text-lg font-extrabold text-secondary block">ISO 9001:2015</span>
              <span className="text-[11px] text-on-surface-variant font-medium">Quality Certified</span>
            </div>
          </div>

        </div>
      </section>

      
      <section className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-36 h-48 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-primary/20 bg-primary">
              <img src={imgDirector} alt="Centre Director" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block mb-1">
                From the Centre Director's Desk
              </span>
              <h3 className="font-headline text-xl font-bold text-primary">Er. Anand Kumar Singh</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Director & Founder Trustee, HIT India Skill Development Foundation
              </p>
              <p className="text-xs text-on-surface mt-3 leading-relaxed">
                "Our guiding philosophy is that no aspiring student in Purvanchal should be denied modern technical literacy due to financial constraints. By maintaining a flat ₹100 registration fee and affordable monthly slabs, we have democratized computer education for thousands of rural youths."
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                <span>Authorized Signatory & Academic Dean</span>
              </div>
            </div>
          </div>

          
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-36 h-48 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-primary/20 bg-primary">
              <img src={imgHeadOffice} alt="Central Secretariat" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block mb-1">
                Central Headquarters
              </span>
              <h3 className="font-headline text-xl font-bold text-primary">Ghosi Secretariat</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Jamal Mirzapur, Kasba Khas, Mau Hub
              </p>
              <p className="text-xs text-on-surface mt-3 leading-relaxed">
                The administrative and examination hub overseeing affiliated skill centers across Purvanchal, managing centralized curriculum standardization, student dossier verification, and examination schedules.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-sm text-secondary">location_city</span>
                <span>Central Academic Secretariat</span>
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">visibility</span>
            </div>
            <h4 className="font-headline text-base font-bold text-primary mb-2">Our Vision</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To establish a self-sustaining ecosystem where every rural youth in Uttar Pradesh is equipped with verified IT competency, computational reasoning, and career-readiness.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-white flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">flag</span>
            </div>
            <h4 className="font-headline text-base font-bold text-primary mb-2">Our Mission</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To deliver practical vocational curriculum aligned with National Skill Qualification Framework (NSQF) standards, emphasizing accounting software, typing accuracy, and digital literacy.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container text-white flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">workspace_premium</span>
            </div>
            <h4 className="font-headline text-base font-bold text-primary mb-2">Government Compliance</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Incorporated under Section 8 of the Companies Act 2013 by the Ministry of Corporate Affairs (MCA), registered on NGO Darpan (NITI Aayog), and granted Income Tax 80G tax exemptions.
            </p>
          </div>
        </div>
      </section>

      
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-surface rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 px-6 border-b border-outline-variant/20 bg-surface-container-low">
              <div>
                <h3 className="text-base font-bold text-primary font-headline">
                  {activeModal.title}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {activeModal.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-error/10 hover:text-error text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                title="Close Certificate Viewer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            <div className="p-4 overflow-auto flex items-center justify-center bg-black/5 max-h-[75vh]">
              <img
                src={activeModal.image}
                alt={activeModal.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md border border-outline-variant/20"
              />
            </div>
            
            <div className="p-3 px-6 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
              <span>H.I.T India Skill Development Foundation • Official Document</span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
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
