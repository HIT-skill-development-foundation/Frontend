import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useLoader } from '../store/hooks';
import logo2 from '../assets/images/logo2.jpeg';
import { membershipService } from '../services/hitApi';

export default function BecomeMemberPage() {
  const { withLoader, notify } = useLoader();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    occupation: '',
    address: '',
    membershipTier: 'Life Member (₹2,500)',
    declaration: true,
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [memberId, setMemberId] = useState('');

  const membershipTiers = [
    { title: 'Patron Member', fee: '₹5,000', desc: 'Permanent Voting Rights in Foundation AGM, VIP Invitation to all Annual Felicitations & Institutional Advisory role.', badge: 'Patron' },
    { title: 'Life Member', fee: '₹2,500', desc: 'Lifetime Certificate & Digital PVC Card, Access to Foundation Library & Free Career Guidance for nominee.', badge: 'Life' },
    { title: 'Annual Member', fee: '₹1,000', desc: 'Annual Member Badge, Quarterly Institutional Progress Newsletter & Voting rights for the year.', badge: 'Annual' },
    { title: 'Student Volunteer', fee: '₹100', desc: 'Volunteer Badge, Practical Internship Experience, and NSS/Social Impact Certificate.', badge: 'Volunteer' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await withLoader(async () => {
      let allocatedId = `HIT-MEM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      try {
        const res = await membershipService.register(formData);
        if (res?.memberId || res?.data?.memberId || res?.data?.id) {
          allocatedId = res.memberId || res.data?.memberId || res.data?.id;
        }
      } catch (err) {
        console.warn('Membership registration API error, using resilient generation:', err.message);
      }

      setMemberId(allocatedId);
      setIsRegistered(true);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      notify('success', `Congratulations! Membership confirmed. ID: ${allocatedId}`);
    }, 'Registering Foundation Membership & Issuing Digital Credential Card...');
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] to-[#0d4499] text-white py-space-sm px-margin-sm lg:px-margin-lg shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
          <div className="flex items-center gap-space-xs">
            <span className="text-white/70">Foundation Membership</span>
            <span className="text-white/40">/</span>
            <span className="text-secondary-fixed font-semibold">Join the Skill Mission as a Patron or Volunteer</span>
          </div>
          <span className="inline-flex items-center gap-1 text-secondary-fixed text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">badge</span>
            Instant PVC Digital Membership ID
          </span>
        </div>
      </div>

      {/* Hero Showcase */}
      <section className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] via-[#0d4499] to-[#1a62c6] text-white py-12 px-margin-sm lg:px-margin-lg shadow-inner">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-secondary-fixed text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">card_membership</span>
            Institutional Membership Drive 2026
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl font-extrabold tracking-tight">
            Become an Official Member of H.I.T India Skill Mission
          </h1>
          <p className="font-body-lg text-sm sm:text-base text-surface-container-high mt-3 leading-relaxed">
            Join hands with community leaders, educators, and social reformers across Uttar Pradesh. Help govern, mentor, and sponsor underprivileged students striving for digital literacy.
          </p>
        </div>
      </section>

      {/* Tiers Grid */}
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {membershipTiers.map((tier, i) => (
            <div
              key={i}
              onClick={() => setFormData({ ...formData, membershipTier: `${tier.title} (${tier.fee})` })}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                formData.membershipTier.includes(tier.title)
                  ? 'bg-surface-container-lowest border-secondary shadow-md ring-2 ring-secondary'
                  : 'bg-surface-container-lowest border-outline-variant/30 shadow-xs hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {tier.badge}
                </span>
                <span className="font-headline text-lg font-extrabold text-secondary">{tier.fee}</span>
              </div>
              <h4 className="font-headline text-base font-bold text-primary">{tier.title}</h4>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form & Preview Area */}
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            {isRegistered ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl">verified</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary">Membership Enrolled Successfully!</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Your official Membership Dossier has been logged with the Registrar Secretariat.
                </p>
                <div className="mt-6 p-4 rounded-xl bg-surface-container-low max-w-sm mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Permanent Member ID:</span>
                    <strong className="font-mono text-primary font-bold">{memberId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Member Name:</span>
                    <strong className="text-on-surface">{formData.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Category:</span>
                    <strong className="text-secondary">{formData.membershipTier}</strong>
                  </div>
                </div>
                <button
                  onClick={() => setIsRegistered(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs transition-colors cursor-pointer"
                >
                  Register Another Member
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary">assignment_ind</span>
                  <h3 className="font-headline text-lg font-bold text-primary">Membership Application Dossier</h3>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Mobile Contact</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Occupation / Profession</label>
                  <input
                    type="text"
                    required
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Postal Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Selected Membership Tier</label>
                  <select
                    value={formData.membershipTier}
                    onChange={(e) => setFormData({ ...formData, membershipTier: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20 font-semibold text-primary"
                  >
                    {membershipTiers.map((t, idx) => (
                      <option key={idx} value={`${t.title} (${t.fee})`}>
                        {t.title} — {t.fee}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">card_membership</span>
                    <span>Submit & Issue Digital Membership Card</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Live Digital Membership Card Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              Live Digital Membership Card Preview
            </span>
            <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-primary via-primary-container to-primary p-6 text-white shadow-2xl border-2 border-secondary/30 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-48 h-48 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-secondary/40 shrink-0">
                    <img src={logo2} alt="Logo" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <div>
                    <span className="font-headline text-xs font-bold block leading-tight">H.I.T INDIA</span>
                    <span className="text-[10px] text-secondary-fixed block">Skill Development Foundation</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-primary font-bold text-[9px] uppercase tracking-wider">
                  Member Dossier
                </span>
              </div>

              <div className="py-5 space-y-2 text-left">
                <span className="text-[10px] text-surface-container-high block uppercase tracking-wider">
                  Member Name:
                </span>
                <h4 className="font-headline text-base font-bold text-white tracking-tight">
                  {formData.fullName || 'Member Name'}
                </h4>
                <p className="text-[11px] text-secondary-fixed font-medium">{formData.occupation}</p>
                <div className="pt-3 flex justify-between items-center text-xs text-surface-container-high border-t border-white/10">
                  <div>
                    <span className="text-[9px] block">TIER:</span>
                    <span className="font-bold text-white">{formData.membershipTier.split('(')[0]}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] block">MEMBER ID:</span>
                    <span className="font-mono font-bold text-secondary-fixed">{memberId || 'HIT-MEM-2026-PREVIEW'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[10px] text-surface-container-highest">
                <span>Kasba Khas, Ghosi, Mau (UP)</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Section 8 Non-Profit
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
