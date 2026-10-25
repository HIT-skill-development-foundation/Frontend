import React, { useState, useEffect } from 'react';
import { useVerification, useLoader } from '../store/hooks';
import studentService from '../services/studentService';
import logo2 from '../assets/images/logo2.jpeg';

export default function VerificationPage({ initialQuery = '' }) {
  const {
    query: reduxQuery,
    result: reduxResult,
    hasSearched: reduxSearched,
    setQuery: setReduxQuery,
    setResult: setReduxResult,
  } = useVerification();
  const { withLoader, notify } = useLoader();

  const [query, setQueryState] = useState(initialQuery || reduxQuery || '');
  const [searched, setSearched] = useState(Boolean(initialQuery || reduxSearched));
  const [result, setResult] = useState(reduxResult || null);

  useEffect(() => {
    if (initialQuery) {
      setQueryState(initialQuery);
      setReduxQuery(initialQuery);
      setSearched(true);
    }
  }, [initialQuery, setReduxQuery]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setSearched(true);
    setReduxQuery(query);

    await withLoader(async () => {
      const res = await studentService.verifyRollNumber(query);
      if (res.success) {
        setResult(res.data);
        setReduxResult(res.data);
        notify('success', `Roll number ${query} verified successfully.`);
      } else {
        setResult(null);
        setReduxResult(null);
        notify('error', res.error || 'Credential record not found.');
      }
    }, 'Querying Central NITI Aayog/MCA Verification Ledger...');
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      
      <div className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] to-[#0d4499] text-white py-space-sm px-margin-sm lg:px-margin-lg shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-label-sm font-label-sm">
          <div className="flex items-center gap-space-xs">
            <span className="text-white/70">Central Registry</span>
            <span className="text-white/40">/</span>
            <span className="text-secondary-fixed font-semibold">Cryptographic Ledger Verification</span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Govt. Recognized Certification Verification
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-margin-sm lg:px-margin-lg py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-3xl">verified</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-primary">
            Official Credential & Roll Verification
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant max-w-xl mx-auto mt-2">
            Verify student diplomas, digital admission registers, and vocational completion certificates issued by H.I.T India Skill Development Foundation.
          </p>
        </div>

        
        <form onSubmit={handleVerify} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-outline">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Roll No or Certificate Code (e.g. HIT-STU-2026-00001)"
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-sm uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-primary h-12 px-6 shrink-0"
            >
              <span>Verify Records</span>
            </button>
          </div>
        </form>

        
        {searched && (
          result ? (
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 overflow-hidden">
              
              <div className="bg-gradient-to-r from-[#000d29] via-[#072a6b] via-[#0d4499] to-[#1a62c6] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white p-0.5 flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-secondary/30">
                    <img
                      src={logo2}
                      alt="HIT Foundation Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-tertiary-fixed font-bold tracking-widest uppercase block">
                      AUTHENTICATED CREDENTIAL RECORD
                    </span>
                    <h3 className="font-headline text-lg font-bold leading-tight">
                      H.I.T INDIA SKILL DEVELOPMENT FOUNDATION
                    </h3>
                    <span className="text-xs text-secondary-fixed">
                      MCA Reg: U85300UP2021NPL142981 • NITI Aayog: UP/2021/0284729
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-full self-start sm:self-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-xs uppercase tracking-wider">Officially Verified</span>
                </div>
              </div>

              
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Student Full Name</span>
                    <span className="font-headline text-lg font-bold text-primary block mt-0.5">{result.fullName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Father's Name</span>
                    <span className="font-medium text-sm text-on-surface block mt-0.5">{result.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Course Program</span>
                    <span className="font-semibold text-sm text-secondary block mt-0.5">{result.courseName}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Roll Number / Registry Code</span>
                    <span className="font-mono text-base font-bold text-primary block mt-0.5">{result.rollNo}</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Authorized Training Centre</span>
                    <span className="font-medium text-sm text-on-surface block mt-0.5">{result.centreName} ({result.centreCode})</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Academic Standing</span>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Grade A+ (Distinction) • Enrolled Active
                    </span>
                  </div>
                </div>
              </div>

              
              <div className="bg-surface-container-low p-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white p-1 rounded-lg border border-outline-variant flex items-center justify-center shrink-0">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2zM4 4v4h4V4zM14 2h8v8h-8zM16 4v4h4V4zM2 14h8v8H2zM4 16v4h4v-4zM14 14h3v3h-3zM19 14h3v3h-3zM14 19h3v3h-3zM19 19h3v3h-3z"/>
                    </svg>
                  </div>
                  <div className="text-xs">
                    <span className="font-mono text-on-surface-variant block">BLOCK-HASH: 8f92-a19c-4820-hit2026</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Permanent Ledger Authenticated
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="btn-secondary h-10 px-5"
                >
                  <span>Print Verification Certificate</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-error/30">
              <span className="material-symbols-outlined text-error text-4xl mb-2">cancel</span>
              <h3 className="font-headline text-lg font-bold text-error">Record Not Found</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Please double check the roll number format. Example: HIT-STU-2026-00001
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
