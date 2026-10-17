import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from '../assets/images/logo2.jpeg';
import imgDirector from '../assets/images/director.jpeg';
import imgHeadOffice from '../assets/images/headoffice.jpeg';
import imgAward from '../assets/images/award.jpeg';
import imgClass from '../assets/images/class.jpeg';

export default function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Header Banner */}
      <div className="w-full bg-primary text-on-primary py-space-sm px-margin-sm lg:px-margin-lg shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
          <div className="flex items-center gap-space-xs">
            <span className="text-on-primary/70">Institutional Profile</span>
            <span className="text-on-primary/40">/</span>
            <span className="text-secondary-fixed font-semibold">About H.I.T India Skill Development Foundation</span>
          </div>
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <span className="material-symbols-outlined text-sm">verified</span>
            Section 8 Non-Profit Registered Entity
          </span>
        </div>
      </div>

      {/* Hero Showcase */}
      <section className="w-full bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary py-16 px-margin-sm lg:px-margin-lg shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-secondary-fixed text-xs font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">account_balance</span>
              MCA Reg. CIN: U85300UP2021NPL148821
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
                className="h-11 px-6 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Explore Courses
              </button>
              <button
                onClick={() => navigate('/donation')}
                className="h-11 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20 cursor-pointer"
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
                <span>NITI Aayog Darpan:</span>
                <strong className="text-white">UP/2021/0284729</strong>
              </div>
              <div className="flex items-center justify-between text-surface-container-high">
                <span>Income Tax 80G:</span>
                <strong className="text-emerald-300">50% Exemption</strong>
              </div>
              <div className="flex items-center justify-between text-surface-container-high">
                <span>Certification:</span>
                <strong className="text-white">ISO 9001:2015 Quality</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Institutional Infrastructure Grid */}
      <section className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Director Desk */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-36 h-48 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-primary/20 bg-primary">
              <img src={imgDirector} alt="Centre Director" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block mb-1">
                From the Centre Director's Desk
              </span>
              <h3 className="font-headline text-xl font-bold text-primary">Er. A. K. Verma</h3>
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

          {/* Central Headquarters & Secretariat */}
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
                The administrative and examination hub overseeing 48+ affiliated skill centers across Purvanchal, managing centralized curriculum standardization, student dossier verification, and examination schedules.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-sm text-secondary">location_city</span>
                <span>Central Academic Secretariat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Pillars */}
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
    </div>
  );
}
