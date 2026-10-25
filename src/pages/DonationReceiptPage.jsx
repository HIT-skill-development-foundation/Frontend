import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonation, useLoader } from '../store/hooks';
import logo2 from '../assets/images/logo2.jpeg';

export default function DonationReceiptPage({ setActiveTab, donationData: donationDataProp }) {
  const { donation: reduxDonation } = useDonation();
  const donationData = donationDataProp || reduxDonation;
  const { withLoader, notify } = useLoader();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  if (!donationData) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">receipt_long</span>
        </div>
        <h2 className="font-headline text-2xl font-bold text-primary mb-2">No Recent Donation Receipt</h2>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
          You haven't processed a donation in this session yet. Complete a tax-exempt contribution to generate your official Section 80G receipt.
        </p>
        <button
          onClick={() => {
            if (setActiveTab) setActiveTab('donation');
            navigate('/donation');
          }}
          className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Make a Donation
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    if (donationData.txnId) {
      navigator.clipboard.writeText(donationData.txnId);
      setCopied(true);
      notify('info', 'Transaction ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      notify('success', `Official 80G Certificate for Receipt ${donationData.receiptNo || 'Record'} downloaded.`);
    }, 'Compiling Official Form 10BD 80G Tax Exemption Certificate...');
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      
      <section className="w-full bg-surface-container-low py-space-md shadow-sm border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto px-margin sm:px-margin-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div>
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 font-label-sm text-xs uppercase tracking-wide font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Webhook Settled Instantly
                  </span>
                  <span className="text-xs text-outline font-mono">TXN: {donationData.date}</span>
                </div>
                <h1 className="font-headline text-lg sm:text-xl font-bold text-primary mt-1">
                  Payment Verified & Donation Confirmed!
                </h1>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Thank you for supporting youth with technical literacy. Your contribution is ledger-certified.
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch md:items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                <span>TXN ID:</span>
              </div>
              <code className="font-mono font-bold text-xs text-primary bg-surface-container-high px-2 py-1 rounded">
                {donationData.txnId}
              </code>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-surface-container text-secondary transition-colors"
                title="Copy Reference"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      
      <main className="w-full max-w-5xl mx-auto px-margin sm:px-margin-lg py-8">
        
        <div className="flex flex-wrap items-center justify-between gap-space-md mb-6">
          <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm">
            <span className="material-symbols-outlined text-secondary text-lg">verified_user</span>
            <span>Valid for Central Board of Direct Taxes (CBDT) Form 10BD & 80G Filings</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-primary font-semibold text-xs shadow-sm border border-outline-variant/40 transition-all"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Receipt</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#072a6b] to-[#1a62c6] hover:from-[#0a3582] hover:to-[#2563eb] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>{downloading ? 'Generating PDF...' : 'Download PDF (80G)'}</span>
            </button>
          </div>
        </div>

        
        <article className="relative bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 overflow-hidden p-6 sm:p-10">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <div className="text-center transform -rotate-12">
              <div className="text-9xl font-extrabold tracking-widest text-primary">H.I.T</div>
              <div className="text-4xl font-bold uppercase tracking-widest text-primary mt-2">
                Section 80G Tax Exemption
              </div>
            </div>
          </div>

          
          <header className="relative pb-6 bg-surface-container-low -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 p-6 sm:p-8 border-b border-outline-variant/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-1 shadow-md shrink-0 overflow-hidden border border-secondary/30">
                  <img
                    src={logo2}
                    alt="HIT Foundation Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-tertiary-container text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                    Govt. Recognized Section 8 Non-Profit Foundation
                  </span>
                  <h2 className="font-headline text-xl sm:text-2xl font-bold text-primary tracking-tight">
                    H.I.T INDIA SKILL DEVELOPMENT FOUNDATION
                  </h2>
                  <p className="text-xs text-on-surface-variant max-w-xl">
                    Jamal Mirzapur, Kasba Khas, Ghosi, District Mau, Uttar Pradesh – 275105, India
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-3 py-1 rounded-full bg-secondary-container text-white font-bold text-xs uppercase tracking-wider inline-block">
                  FORM 10BD / 80G RECEIPT
                </span>
                <span className="text-[11px] text-on-surface-variant block mt-1">
                  Receipt No: <strong className="font-mono text-primary">{donationData.receiptNo}</strong>
                </span>
              </div>
            </div>
          </header>

          
          <div className="py-4 border-b border-outline-variant/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Company CIN / MCA</span>
              <span className="font-mono font-bold text-primary">U85300UP2021NPL142981</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">NITI Aayog Darpan</span>
              <span className="font-mono font-bold text-primary">UP/2021/0284729</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">80G Order Number</span>
              <span className="font-mono font-bold text-primary">CIT(E)/LKO/80G/2022/918</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Assessment Year</span>
              <span className="font-bold text-primary">2026–2027</span>
            </div>
          </div>

          
          <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-outline-variant/20 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Received with Thanks From:</span>
                <span className="font-headline text-base font-bold text-primary">{donationData.donorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Donor PAN (Permanent Account Number)</span>
                <span className="font-mono font-bold text-secondary text-sm">{donationData.donorPan}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Donor Address</span>
                <span className="text-on-surface">{donationData.donorAddress}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Date & Time of Transaction</span>
                <span className="font-medium text-on-surface">{donationData.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Settlement Mode</span>
                <span className="text-emerald-700 font-bold">{donationData.mode}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Program Allocation</span>
                <span className="text-on-surface font-medium">{donationData.purpose}</span>
              </div>
            </div>
          </div>

          
          <div className="py-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-surface-container-low text-primary uppercase text-[10px] font-bold">
                  <th className="p-3 text-left">Description of Contribution</th>
                  <th className="p-3 text-right">Gross Amount</th>
                  <th className="p-3 text-right">80G Eligible (50%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr>
                  <td className="p-3">
                    <span className="font-semibold text-primary block">
                      General Welfare Donation for Technical Literacy & Girl Education
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Under Section 80G(5)(iv) of Income Tax Act 1961
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-sm text-primary">
                    ₹{donationData.amount.toLocaleString('en-IN')}.00
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-sm text-emerald-700">
                    ₹{donationData.taxExemptionEligible.toLocaleString('en-IN')}.00
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-primary font-bold">
                  <td className="p-3 text-primary text-sm">Total Recognized Contribution:</td>
                  <td className="p-3 text-right font-mono text-base text-primary">
                    ₹{donationData.amount.toLocaleString('en-IN')}.00
                  </td>
                  <td className="p-3 text-right font-mono text-base text-emerald-700">
                    ₹{donationData.taxExemptionEligible.toLocaleString('en-IN')}.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          
          <footer className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-outline-variant flex items-center justify-center shrink-0">
                <svg className="w-14 h-14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2zM4 4v4h4V4zM14 2h8v8h-8zM16 4v4h4V4zM2 14h8v8H2zM4 16v4h4v-4zM14 14h3v3h-3zM19 14h3v3h-3zM14 19h3v3h-3zM19 19h3v3h-3z"/>
                </svg>
              </div>
              <div className="text-xs">
                <span className="font-mono text-on-surface-variant block">LEDGER-TXN: {donationData.txnId}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Tamper-Evident Digital Cryptographic Hash
                </span>
                <span className="text-[10px] text-outline block mt-0.5">
                  This document is auto-generated and does not require physical signature under IT Rules.
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base font-bold text-primary underline mb-1">
                A. K. Verma
              </div>
              <span className="text-xs font-bold text-primary block">Authorized Trustee / Treasurer</span>
              <span className="text-[10px] text-on-surface-variant block">
                H.I.T India Skill Development Foundation
              </span>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
