import React, { useState } from 'react';

// Static Imports for Local Campus & Event Image Assets
import imgAward from '../assets/images/award.jpeg';
import imgGift from '../assets/images/gift.jpeg';
import imgGift2 from '../assets/images/gift2.jpeg';
import imgDirector from '../assets/images/director.jpeg';
import imgHeadOffice from '../assets/images/headoffice.jpeg';
import imgClass from '../assets/images/class.jpeg';
import imgClass2 from '../assets/images/class2.jpeg';
import imgClass3 from '../assets/images/class3.jpeg';
import imgClass4 from '../assets/images/class4.jpeg';
import imgClass5 from '../assets/images/class5.jpeg';
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
      id: 18,
      title: 'Computer Hardware & Practical Workstations Lab (Room 01)',
      category: 'classroom',
      location: 'Ghosi Central Training Lab, Mau',
      date: 'Daily Hands-on Practical',
      badge: 'Hardware Lab',
      img: imgClass4,
      desc: 'Hands-on IT laboratory equipped with dedicated desktop terminals, motherboards, high-speed networking, and practical hardware maintenance stations for diploma scholars.',
      gps: 'Central Lab Wing A',
    },
    {
      id: 19,
      title: 'PMKVY RPL & IT Lab Practical Training Hall',
      category: 'classroom',
      location: 'Kasba Khas Central Lab, Ghosi, Mau',
      date: 'Vocational Training Session',
      badge: 'PMKVY Lab',
      img: imgClass5,
      desc: 'Accredited practical classroom facility hosting PMKVY Recognition of Prior Learning programs, domestic data entry operator modules, and digital office automation.',
      gps: 'Practical Wing 02',
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
    { id: 'all', label: 'All 16 Campus Moments & Sessions' },
    { id: 'classroom', label: 'Classroom & Labs' },
    { id: 'pmkvy', label: 'PMKVY & Teachers Day' },
    { id: 'felicitations', label: 'Ceremonies & Felicitations' },
    { id: 'infrastructure', label: 'Campus & Infrastructure' },
    { id: 'leadership', label: 'Leadership & Administration' },
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
      <div className="w-full bg-gradient-to-r from-[#000d29] via-[#072a6b] to-[#0d4499] text-white py-space-sm px-margin sm:px-margin-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-xs text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-white/80">
            <span>Home</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary-fixed font-bold">Official Activities & Events Gallery</span>
          </div>
          <div className="flex items-center gap-3 text-white/80 text-xs">
            <span className="inline-flex items-center gap-1.5 text-secondary-fixed font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Public Records Archive
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline">District Mau (Eastern UP) Regional Chapter</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <section className="w-full py-6 sm:py-8 px-margin sm:px-margin-lg bg-surface">
        <div className="max-w-7xl mx-auto">
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
              onClick={() => setActiveModalImg(item)}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/11] bg-surface-container-high border border-outline-variant/30 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer select-none"
            >
              {/* Rectangular Image */}
              <img
                alt={item.title}
                src={item.img}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Default Subtle Top Badge (Visible before hover) */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1 shadow-sm transition-opacity duration-300 group-hover:opacity-0">
                <span className="material-symbols-outlined text-[13px] text-secondary-fixed">verified</span>
                <span>{item.badge}</span>
              </div>

              {/* Glassy Black Hover Overlay with Full Content */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out p-5 sm:p-6 flex flex-col justify-between text-white border border-white/10">
                
                {/* Top Meta Strip */}
                <div className="flex items-center justify-between gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-white/80 font-mono">
                    <span className="material-symbols-outlined text-[14px] text-secondary-fixed">calendar_today</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Center Content */}
                <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-headline text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-secondary-fixed pt-1 truncate">
                    <span className="material-symbols-outlined text-sm shrink-0">pin_drop</span>
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-full py-2 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold backdrop-blur-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-base text-secondary-fixed">open_in_full</span>
                    <span>Click to View Full Size</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zoom Modal */}
      {activeModalImg && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-outline-variant/40 space-y-4 max-h-[92vh] flex flex-col"
          >
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                alt={activeModalImg.title}
                src={activeModalImg.img}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setActiveModalImg(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                title="Close Viewer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-2 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold uppercase tracking-wider">
                  {activeModalImg.badge}
                </span>
                <span className="text-xs text-on-surface-variant font-mono">
                  {activeModalImg.date} • {activeModalImg.gps}
                </span>
              </div>
              <h3 className="font-headline text-xl font-bold text-primary">
                {activeModalImg.title}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
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
