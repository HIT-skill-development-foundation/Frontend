import React, { useState } from 'react';

// Static Imports for all 17 Local Image Assets
import imgLogo from '../assets/images/logo.jpeg';
import imgLogo2 from '../assets/images/logo2.jpeg';
import imgMain from '../assets/images/main.jpeg';
import imgAward from '../assets/images/award.jpeg';
import imgGift from '../assets/images/gift.jpeg';
import imgGift2 from '../assets/images/gift2.jpeg';
import imgDirector from '../assets/images/director.jpeg';
import imgHeadOffice from '../assets/images/headoffice.jpeg';
import imgClass from '../assets/images/class.jpeg';
import imgClass2 from '../assets/images/class2.jpeg';
import imgClass3 from '../assets/images/class3.jpeg';
import imgCake from '../assets/images/cake.jpeg';
import imgCake1 from '../assets/images/cake1.jpeg';
import imgCake2 from '../assets/images/cake2.jpeg';
import imgCake3 from '../assets/images/cake3.jpeg';
import imgCake4 from '../assets/images/cake4.jpeg';
import imgCake5 from '../assets/images/cake5.jpeg';
import { useSelector } from 'react-redux';
import { selectGalleryItems } from '../store/slices/gallerySlice';

export default function GalleryPage() {
  const reduxGallery = useSelector(selectGalleryItems);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalImg, setActiveModalImg] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'HIT Computer Education Official Course Portfolio & Signboard',
      category: 'infrastructure',
      location: 'Near Post Office Jamal Mirzapur, Kasba Khas, Ghosi, Mau - 275105',
      date: 'Session 2025–2026',
      badge: 'Main Prospectus',
      img: imgLogo,
      desc: 'Official outdoor prospectus and affiliated course directory at Jamal Mirzapur Krishna Market, Ghosi, Mau. Offering recognized certifications in CCC, DTP, DCA, ADCA, PGDCA, Tally Prime + GST.',
      gps: 'Lat 26.103858° / Long 83.544569°',
    },
    {
      id: 2,
      title: 'H.I.T India Skill Development Foundation Official Seal',
      category: 'badges',
      location: 'Central Registry & Governance Unit',
      date: 'Permanent Emblems',
      badge: 'ISO 9001:2015',
      img: imgLogo2,
      desc: 'The official certified insignia of H.I.T India Skill Development Foundation, registered under Ministry of Corporate Affairs (MCA) and verified on NITI Aayog Darpan portal.',
      gps: 'U85300UP2021NPL142981',
    },
    {
      id: 3,
      title: 'Main Academic Center & Skill Campus Entrance',
      category: 'infrastructure',
      location: 'Kasba Khas, Ghosi, Mau, Uttar Pradesh - 275105',
      date: 'Audited Campus',
      badge: 'GPS Verified',
      img: imgMain,
      desc: 'Ground-level verified facility hosting multimedia computer workstations, faculty consultation suites, and high-speed optical fiber connectivity.',
      gps: 'Kasba Khas, Ghosi, Mau',
    },
    {
      id: 4,
      title: 'Annual Student Achievement & Course Completion Award',
      category: 'felicitations',
      location: 'Ghosi Main Campus Auditorium',
      date: 'Convocation 2026',
      badge: 'Merit Award',
      img: imgAward,
      desc: 'Female scholar receiving certificate of merit and honors award hamper from the Centre Director in front of the institutional backdrop.',
      gps: 'Ghosi Lab A Venue',
    },
    {
      id: 5,
      title: 'Merit Diploma & Study Kit Distribution',
      category: 'felicitations',
      location: 'Counseling & Award Bay, Ghosi',
      date: 'Honor Roll 2026',
      badge: 'ADCA Distinction',
      img: imgGift,
      desc: 'Distribution of curriculum courseware, special merit packages, and advanced computer application certifications to qualifying high-score students.',
      gps: 'Academic Hall',
    },
    {
      id: 6,
      title: 'Faculty & Student Mentorship Floral Tribute',
      category: 'felicitations',
      location: 'Main Conference Hall, Ghosi',
      date: 'Guru Samman Session',
      badge: 'Mentorship Tribute',
      img: imgGift2,
      desc: 'Students presenting floral bouquet tribute to the Centre Director honoring vocational mentorship, placement guidance, and digital literacy.',
      gps: 'Faculty Suite',
    },
    {
      id: 7,
      title: 'Centre Director in Administrative Session & Student Counseling',
      category: 'leadership',
      location: 'Executive Desk, Ghosi Central Office',
      date: 'Active Administration',
      badge: 'Managing Trustee',
      img: imgDirector,
      desc: 'Centre Director / Managing Trustee presiding over candidate registration files, roll credentials, and examination schedules.',
      gps: 'Administrative Bay',
    },
    {
      id: 8,
      title: 'Head Office Executive Suite & Operations Center',
      category: 'infrastructure',
      location: 'Ghosi Central Head Office',
      date: 'Executive Office',
      badge: 'Head Office',
      img: imgHeadOffice,
      desc: 'Central administrative and records verification office coordinating PMKVY, CSC skill hubs, and academic franchise centers.',
      gps: 'Ghosi Head Office',
    },
    {
      id: 9,
      title: 'General Duty Assistant (GDA) Healthcare Training Batch',
      category: 'classroom',
      location: 'Healthcare Lab 01',
      date: 'Practical Batch 2026',
      badge: 'GDA Certified',
      img: imgClass,
      desc: 'Vocational trainees undertaking specialized health assistance and clinical support training modules under vocational skill standards.',
      gps: 'Practical Lab 1',
    },
    {
      id: 10,
      title: 'Computer Lab Practical Classroom Session (Ghosi Campus)',
      category: 'classroom',
      location: 'Computer Workstations Lab Room',
      date: 'Daily Practical Labs',
      badge: '1:1 Lab Ratio',
      img: imgClass2,
      desc: 'Hands-on training session in financial accounting with Tally Prime, desktop publishing (DTP), and software fundamentals.',
      gps: 'Lab Workstations',
    },
    {
      id: 11,
      title: 'Vocational Trainees Workshop & Skill Assembly',
      category: 'classroom',
      location: 'Technical Training Hall',
      date: 'Vocational Batch',
      badge: 'Skill Mission',
      img: imgClass3,
      desc: 'Batch trainees participating in interactive classroom problem-solving, digital typing tests, and office automation exercises.',
      gps: 'Hall B Training',
    },
    {
      id: 12,
      title: 'PMKVY RPL & Teachers Day Milestone Celebration Cake Ceremony',
      category: 'pmkvy',
      location: 'Central Assembly Hall, Ghosi',
      date: 'Teachers Day & Skill Day',
      badge: 'PMKVY RPL',
      img: imgCake,
      desc: 'Students, faculty, and leadership gathering around the official celebration cake under the PMKVY Recognition of Prior Learning through CSCs banner.',
      gps: 'Celebration Stage',
    },
    {
      id: 13,
      title: 'Teachers Day Festive Classroom Ambiance & Decorations',
      category: 'pmkvy',
      location: 'Ghosi Main Skill Training Lab',
      date: 'Annual Celebration',
      badge: 'Festive Moment',
      img: imgCake1,
      desc: 'Classroom celebration with festive balloon decorations and enthusiastic participation from diploma candidates.',
      gps: 'Classroom 02',
    },
    {
      id: 14,
      title: 'Faculty Recognition & Instructor Honors Gathering',
      category: 'pmkvy',
      location: 'Central Stage, Ghosi',
      date: 'Faculty Samman',
      badge: 'Instructor Honor',
      img: imgCake2,
      desc: 'Computer instructors and trainers receiving appreciation and garlands from batches for dedication to technical training.',
      gps: 'Main Lab Stage',
    },
    {
      id: 15,
      title: 'Ceremonial Sweet Sharing & Fellowship',
      category: 'pmkvy',
      location: 'Student Fellowship Common',
      date: 'Fellowship Day',
      badge: 'Sweet Distribution',
      img: imgCake3,
      desc: 'Sharing festive refreshments and congratulatory sweets following the successful conclusion of the examination cycle.',
      gps: 'Common Area',
    },
    {
      id: 16,
      title: 'Batch Solidarity Group Snapshot (Session 2025–26)',
      category: 'pmkvy',
      location: 'HIT Computer Center Courtyard',
      date: 'Batch Portrait',
      badge: 'Batch Solidarity',
      img: imgCake4,
      desc: 'Complete batch snapshot commemorating mutual support, IT proficiencies gained, and readiness for national workforce placements.',
      gps: 'Ghosi Campus',
    },
    {
      id: 17,
      title: 'PMKVY Trainees Convocation & Milestone Gathering',
      category: 'pmkvy',
      location: 'Ghosi Training Facility',
      date: 'Milestone Conclave',
      badge: 'Convocation',
      img: imgCake5,
      desc: 'Grand commemorative group gathering celebrating completion of skill certification standards under national skill ecosystem guidelines.',
      gps: 'Main Campus Hall',
    },
  ];

  const categories = [
    { id: 'all', label: 'All 17 Events & Portfolios' },
    { id: 'infrastructure', label: 'Campus & Infrastructure' },
    { id: 'felicitations', label: 'Ceremonies & Felicitations' },
    { id: 'pmkvy', label: 'PMKVY & Teachers Day' },
    { id: 'classroom', label: 'Classroom & Labs' },
    { id: 'leadership', label: 'Leadership & Administration' },
    { id: 'badges', label: 'Seals & Badges' },
  ];

  const allItems = reduxGallery && reduxGallery.length > 0 ? reduxGallery : galleryItems;
  const filteredItems = allItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Breadcrumb & Metadata Strip */}
      <div className="w-full bg-surface-container-low py-space-sm px-margin sm:px-margin-lg border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-xs text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span>Home</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Official Activities & Events Gallery</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant text-xs">
            <span className="inline-flex items-center gap-1.5 text-secondary font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Live Public Records Archive
            </span>
            <span className="hidden sm:inline text-outline-variant">|</span>
            <span className="hidden sm:inline">District Mau (Eastern UP) Regional Chapter</span>
          </div>
        </div>
      </div>

      {/* Hero Header & Filter Ecosystem */}
      <section className="w-full py-10 sm:py-14 px-margin sm:px-margin-lg bg-surface">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Institutional Photographic Ledger • Sec. 8 MCA / NITI Aayog Verified
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary font-extrabold tracking-tight">
                Life & Milestones at H.I.T India
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Documenting our grassroots vocational training, PMKVY / CSC skill initiatives, academic celebrations, student diploma felicitation ceremonies, and centre expansion across Mau & Eastern Uttar Pradesh.
              </p>
            </div>

            {/* Impact Ticker Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="p-2">
                <div className="font-headline text-2xl font-bold text-primary">14+</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Active Batches</div>
              </div>
              <div className="p-2">
                <div className="font-headline text-2xl font-bold text-secondary">3,850+</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Certified Youths</div>
              </div>
              <div className="p-2">
                <div className="font-headline text-2xl font-bold text-on-tertiary-container">120+</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Events Held</div>
              </div>
              <div className="p-2">
                <div className="font-headline text-2xl font-bold text-emerald-600">100%</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Verified Records</div>
              </div>
            </div>
          </div>

          {/* Interactive Controls Toolbar */}
          <div className="bg-surface-container p-4 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gallery events, batches, or programmes..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-primary font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Export Dossier</span>
                </button>
              </div>
            </div>

            {/* Filter Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 shadow-xs ${
                    selectedCategory === c.id
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Cards Grid */}
      <section className="max-w-7xl mx-auto w-full px-margin sm:px-margin-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-outline-variant/30 flex flex-col justify-between group"
            >
              <div>
                {/* Photo Display */}
                <div className="relative w-full aspect-[16/10] bg-primary-container overflow-hidden">
                  <img
                    alt={item.title}
                    src={item.img}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 text-white backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-tertiary-fixed">verified</span>
                    <span>{item.badge}</span>
                  </div>
                  <button
                    onClick={() => setActiveModalImg(item)}
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-primary p-1.5 rounded-lg shadow-sm transition-transform active:scale-95"
                    title="Zoom Canvas"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_full</span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-secondary">calendar_today</span>
                      <span>{item.date}</span>
                    </span>
                    <span className="font-mono text-emerald-700 font-semibold">{item.gps}</span>
                  </div>

                  <h3 className="font-headline text-base font-bold text-primary group-hover:text-secondary transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Address Strip */}
              <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="text-[11px] text-on-surface-variant truncate max-w-[220px]">
                  {item.location}
                </span>
                <button
                  onClick={() => setActiveModalImg(item)}
                  className="text-secondary font-bold text-xs hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Details</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zoom Modal */}
      {activeModalImg && (
        <div className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-outline-variant/40 space-y-4">
            <div className="relative aspect-video bg-primary">
              <img
                alt={activeModalImg.title}
                src={activeModalImg.img}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalImg(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold uppercase tracking-wider">
                {activeModalImg.badge}
              </span>
              <h3 className="font-headline text-xl font-bold text-primary">
                {activeModalImg.title}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {activeModalImg.desc}
              </p>
              <div className="pt-2 text-xs text-primary font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-secondary">pin_drop</span>
                <span>{activeModalImg.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
