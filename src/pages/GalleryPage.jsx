import React, { useState, useEffect } from 'react';
import { galleryService } from '../services/hitApi';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalImg, setActiveModalImg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const categoryParam = selectedCategory === 'all' ? '' : selectedCategory;
    galleryService.getItems(categoryParam)
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
          setItems(list);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Gallery API load error:', err.message);
          setItems([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Campus Moments & Events' },
    { id: 'classroom', label: 'Classroom & Labs' },
    { id: 'pmkvy', label: 'PMKVY & Workshops' },
    { id: 'felicitations', label: 'Ceremonies & Felicitations' },
    { id: 'infrastructure', label: 'Campus & Infrastructure' },
    { id: 'leadership', label: 'Leadership & Administration' },
    { id: 'events', label: 'Community Events' },
  ];

  const filteredItems = items.filter((item) => {
    if (!item) return false;
    const title = item.title || '';
    const desc = item.desc || '';
    const location = item.location || '';
    const q = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q) ||
      location.toLowerCase().includes(q)
    );
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 shadow-xs cursor-pointer ${
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
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold">Loading media gallery records from central ledger...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">photo_library</span>
            <h3 className="font-headline text-lg font-bold text-primary">No Photographs Found</h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              There are currently no public event photographs recorded in this category on the central server.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id || item._id}
                onClick={() => setActiveModalImg(item)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/11] bg-surface-container-high border border-outline-variant/30 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer select-none"
              >
                {/* Image */}
                <img
                  alt={item.title}
                  src={item.img || item.photoUrl}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Default Subtle Top Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1 shadow-sm transition-opacity duration-300 group-hover:opacity-0">
                  <span className="material-symbols-outlined text-[13px] text-secondary-fixed">verified</span>
                  <span>{item.badge || item.category || 'Event'}</span>
                </div>

                {/* Glassy Black Hover Overlay */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out p-5 sm:p-6 flex flex-col justify-between text-white border border-white/10">
                  {/* Top Meta Strip */}
                  <div className="flex items-center justify-between gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      {item.badge || item.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-white/80 font-mono">
                      <span className="material-symbols-outlined text-[14px] text-secondary-fixed">calendar_today</span>
                      <span>{item.date || 'Active Session'}</span>
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
                      <span className="truncate">{item.location || 'Central Campus'}</span>
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
        )}
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
                src={activeModalImg.img || activeModalImg.photoUrl}
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
                  {activeModalImg.badge || activeModalImg.category}
                </span>
                <span className="text-xs text-on-surface-variant font-mono">
                  {activeModalImg.date} • {activeModalImg.gps || activeModalImg.location}
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
