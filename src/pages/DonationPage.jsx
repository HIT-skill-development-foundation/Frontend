import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useDonation, useLoader } from '../store/hooks';
import donationService from '../services/donationService';

export default function DonationPage({ setActiveTab, setDonationData }) {
  const navigate = useNavigate();
  const { recordDonation } = useDonation();
  const { withLoader, notify } = useLoader();

  const [amount, setAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: 'Arunav Sengupta',
    pan: 'ABCPS8291M',
    email: 'arunav.sengupta@techindia.org',
    phone: '+91 98301-54321',
    address: 'Sector 62, Noida, Uttar Pradesh - 201301',
    purpose: 'Vocational & Digital Skill Sponsorship for Underprivileged Girls',
    citizenAgree: true,
  });

  const presetAmounts = [
    { value: 500, label: '₹500', desc: '1 Student Learning Kit' },
    { value: 1000, label: '₹1,000', desc: '1 Month Lab Fund' },
    { value: 2500, label: '₹2,500', desc: '3-Month CCC Sponsor' },
    { value: 5000, label: '₹5,000', desc: '1-Year ADCA Sponsor', popular: true },
  ];

  const currentAmount = customAmount ? Number(customAmount) || 0 : amount;
  const taxExemptSavings = Math.round(currentAmount * 0.5);

  const handlePresetClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAmount || currentAmount < 100) {
      alert('Please enter a valid donation amount of at least ₹100.');
      return;
    }

    await withLoader(async () => {
      const res = await donationService.processDonation({
        amount: currentAmount,
        donorInfo,
      });

      if (res.success) {
        recordDonation(res.data);
        if (setDonationData) {
          setDonationData(res.data);
        }

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }

        notify('success', `Payment of ₹${currentAmount.toLocaleString('en-IN')} confirmed! Official 80G receipt generated.`);
        if (setActiveTab) {
          setActiveTab('receipt');
        }
        navigate('/receipt');
      }
    }, 'Connecting Razorpay Webhook & Cryptographically Ledgering 80G Tax Exemption...');
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Subtle Trust Indicator Banner */}
      <div className="w-full bg-primary-container text-on-primary py-2 px-margin sm:px-margin-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-xs font-label-md text-xs sm:text-sm">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="inline-flex items-center gap-1 bg-surface-container-lowest/15 px-2.5 py-0.5 rounded-full text-surface-bright">
              <span className="material-symbols-outlined text-[14px] text-tertiary-fixed">verified</span>
              Section 8 Non-Profit • MCA Reg. U85300UP2021NPL142981
            </span>
            <span className="hidden md:inline text-on-primary-container">|</span>
            <span className="text-surface-container-high">Statutory 50% Tax Exemption Under Sec 80G(5)(iv)</span>
          </div>
          <div className="flex items-center gap-space-md text-surface-container-high">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-tertiary-fixed">lock</span>
              256-Bit Bank Grade SSL Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Hero Header & Mission Callout Area */}
      <section className="relative w-full bg-gradient-to-b from-surface-container-low to-surface py-12 sm:py-16 overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-tertiary-fixed/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-margin sm:px-margin-lg relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-surface-container-lowest shadow-sm px-3.5 py-1.5 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-label-md text-xs text-primary tracking-wide uppercase font-bold">
                  Official Giving & Donor Tax Exemption Portal
                </span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary font-extrabold tracking-tight max-w-3xl leading-tight">
                Support Rural & Semi-Urban Youths Through Computer Literacy
              </h1>
              <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Support <strong className="text-on-surface font-semibold">H.I.T India Skill Development Foundation</strong>, a Section 8 Non-Profit Organisation based in Kasba Khas, Ghosi, Mau, Uttar Pradesh. Your donation directly equips underprivileged youth with high-demand digital skills and verified industry diplomas.
              </p>

              {/* Badges Strip */}
              <div className="pt-2 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-surface-container-lowest shadow-sm rounded-xl px-3.5 py-2 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-2xl">account_balance</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Govt of India</p>
                    <p className="text-xs text-primary font-bold">NITI Aayog: UP/2021/0284729</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest shadow-sm rounded-xl px-3.5 py-2 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-2xl">receipt_long</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">IT Act 1961</p>
                    <p className="text-xs text-primary font-bold">80G & 12A Compliant Exemption</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest shadow-sm rounded-xl px-3.5 py-2 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-emerald-600 text-2xl">task_alt</span>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Transparency</p>
                    <p className="text-xs text-primary font-bold">100% Program Allocation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Accent Mini-Card */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-md border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-secondary font-bold">Purvanchal Impact 2026</span>
                <span className="text-[11px] bg-surface-container-high px-2.5 py-0.5 rounded-full text-secondary font-bold">
                  Audited
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-surface-container-low">
                  <div className="font-headline text-2xl font-bold text-primary">3,850+</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Rural Girls Certified</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low">
                  <div className="font-headline text-2xl font-bold text-primary">14</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">High-Tech Labs</div>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Registered non-profit entity dedicated to bridging the digital divide across eastern Uttar Pradesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Donation Form Section */}
      <div className="max-w-5xl mx-auto w-full px-margin-sm lg:px-margin-lg py-12">
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-xl border border-outline-variant/30 space-y-8">
          <div>
            <h2 className="font-headline text-2xl font-bold text-primary">
              Select Your Contribution Amount
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              All contributions qualify for 50% deduction under Section 80G. An official Form 10BD certificate is generated instantly.
            </p>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presetAmounts.map((p) => {
              const isSelected = !customAmount && amount === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handlePresetClick(p.value)}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-secondary bg-primary text-white shadow-md'
                      : 'border-outline-variant/60 bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[9px] font-bold uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                  <span className={`font-headline text-xl font-bold block ${isSelected ? 'text-white' : 'text-primary'}`}>
                    {p.label}
                  </span>
                  <span className={`text-xs block mt-1 ${isSelected ? 'text-surface-container-high' : 'text-on-surface-variant'}`}>
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Amount Field */}
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">
              Or Enter Custom Contribution Amount (₹)
            </label>
            <div className="relative max-w-sm">
              <span className="absolute left-3.5 top-3 text-lg font-bold text-on-surface-variant">₹</span>
              <input
                type="number"
                min="100"
                step="50"
                value={customAmount}
                onChange={handleCustomChange}
                placeholder="e.g. 10000"
                className="h-12 w-full pl-8 pr-4 rounded-xl bg-surface-container-low border border-outline-variant text-base font-bold text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>
          </div>

          {/* Live Section 80G Benefit Indicator */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-secondary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">calculate</span>
              </div>
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Statutory 80G Tax Benefit Summary
                </span>
                <p className="text-xs text-on-surface-variant">
                  Donation: <strong className="text-primary font-bold">₹{currentAmount.toLocaleString('en-IN')}</strong> | 50% Tax Exemption: <strong className="text-emerald-700 font-bold">₹{taxExemptSavings.toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
              Instant 80G Receipt Included
            </span>
          </div>

          {/* Donor Identification Form */}
          <div className="pt-4 border-t border-outline-variant/20 space-y-4">
            <h3 className="font-headline text-lg font-bold text-primary">
              Donor Information (Required for CBDT Form 10BD & 80G Certificate)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">
                  Donor Full Name (As per PAN) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                  className="h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:bg-white focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">
                  PAN Number (Mandatory for 80G Tax Benefit) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength="10"
                  value={donorInfo.pan}
                  onChange={(e) => setDonorInfo({ ...donorInfo, pan: e.target.value.toUpperCase() })}
                  className="h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm font-mono uppercase focus:bg-white focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">
                  Email Address (For Tax Receipt Dispatch) <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                  className="h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:bg-white focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">
                  Mobile Number <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                  className="h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:bg-white focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">
                  Address (For Official Tax Certificate Generation) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={donorInfo.address}
                  onChange={(e) => setDonorInfo({ ...donorInfo, address: e.target.value })}
                  className="h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:bg-white focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="citizenCheck"
                checked={donorInfo.citizenAgree}
                onChange={(e) => setDonorInfo({ ...donorInfo, citizenAgree: e.target.checked })}
                className="mt-1 rounded text-secondary focus:ring-secondary"
              />
              <label htmlFor="citizenCheck" className="text-xs text-on-surface-variant leading-relaxed">
                I confirm that I am a Citizen of India making this contribution from an Indian bank account. I understand this donation will be utilized exclusively for non-profit vocational training programs.
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-on-surface-variant block">Total Contribution:</span>
              <span className="font-headline text-3xl font-extrabold text-primary">
                ₹{currentAmount.toLocaleString('en-IN')}.00
              </span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-tertiary-container hover:bg-primary text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
              <span>Proceed to Donate & Generate 80G Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
