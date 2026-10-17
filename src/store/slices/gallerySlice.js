import { createSlice } from '@reduxjs/toolkit';
import imgMain from '../../assets/images/main.jpeg';
import imgAward from '../../assets/images/award.jpeg';
import imgGift from '../../assets/images/gift.jpeg';
import imgGift2 from '../../assets/images/gift2.jpeg';
import imgDirector from '../../assets/images/director.jpeg';
import imgHeadOffice from '../../assets/images/headoffice.jpeg';
import imgClass from '../../assets/images/class.jpeg';
import imgClass2 from '../../assets/images/class2.jpeg';
import imgClass3 from '../../assets/images/class3.jpeg';
import imgCake from '../../assets/images/cake.jpeg';
import imgCake1 from '../../assets/images/cake1.jpeg';
import imgCake2 from '../../assets/images/cake2.jpeg';
import imgCake3 from '../../assets/images/cake3.jpeg';
import imgCake4 from '../../assets/images/cake4.jpeg';
import imgCake5 from '../../assets/images/cake5.jpeg';

const initialGalleryItems = [
  {
    id: 1,
    title: 'HIT Computer Education Official Course Portfolio & Signboard',
    category: 'infrastructure',
    location: 'Ghosi Central Campus',
    date: 'Academic Session 2026-2027',
    badge: 'Master Portfolio',
    img: imgMain,
    desc: 'Panoramic master banner showcasing comprehensive diploma courses including CCC, DTP, DCA, ADCA, PGDCA, Tally Prime, MCA, MBA, BCA, and B.COM.',
  },
  {
    id: 2,
    title: 'Director Desk: Academic Counseling & Student Guidance',
    category: 'leadership',
    location: 'Central Executive Suite',
    date: 'Daily Operational Session',
    badge: 'Director Desk',
    img: imgDirector,
    desc: 'Centre Director conducting one-on-one student career counseling, scholarship evaluations, and vocational curriculum alignment.',
  },
  {
    id: 3,
    title: 'Foundation Institutional Head Office & Administrative Wing',
    category: 'infrastructure',
    location: 'Kasba Khas, Ghosi, Mau',
    date: 'Central Secretariat',
    badge: 'Central Secretariat',
    img: imgHeadOffice,
    desc: 'Official administrative center of H.I.T India Skill Development Foundation handling student registration, NITI Aayog reporting, and affiliations.',
  },
  {
    id: 4,
    title: 'State Excellence Award & Vocational Skill Recognition',
    category: 'felicitations',
    location: 'Purvanchal Skill Conclave',
    date: 'Annual Awards Gala',
    badge: 'Excellence Trophy',
    img: imgAward,
    desc: 'Foundation leadership receiving prestigious regional award for exemplary service in rural digital literacy and technical training empowerment.',
  },
  {
    id: 5,
    title: 'Computer Lab Practical Training Session & Workstations',
    category: 'classroom',
    location: 'Central IT Lab 1',
    date: 'Batch 2026 Practical',
    badge: 'Hands-on Lab',
    img: imgClass,
    desc: 'Students actively engaged in hands-on computer lab sessions with high-speed workstations, MS Office productivity drills, and typing master modules.',
  },
  {
    id: 6,
    title: 'Coding, Database & Advanced Application Lab',
    category: 'classroom',
    location: 'Advanced IT Lab 2',
    date: 'ADCA Advanced Lab',
    badge: 'Coding Suite',
    img: imgClass2,
    desc: 'Senior batch students working on programming assignments, database connectivity with SQL, and practical web design projects.',
  },
  {
    id: 7,
    title: 'Faculty & Student Mentorship Floral Tribute',
    category: 'felicitations',
    location: 'Main Conference Hall',
    date: 'Guru Samman Session',
    badge: 'Mentorship Tribute',
    img: imgGift2,
    desc: 'Students presenting floral bouquet tribute to the Centre Director honoring vocational mentorship, placement guidance, and digital literacy.',
  },
  {
    id: 8,
    title: 'Annual Foundation Day & Student Milestone Celebration',
    category: 'felicitations',
    location: 'Auditorium Hall',
    date: 'Foundation Day 2026',
    badge: 'Milestone Jubilee',
    img: imgCake,
    desc: 'Celebration of institutional achievements, course completions, and felicitation of high-performing vocational diploma holders.',
  },
];

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    items: initialGalleryItems,
    selectedCategory: 'all',
  },
  reducers: {
    setGalleryCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    addGalleryItem: (state, action) => {
      state.items.unshift(action.payload);
    },
    deleteGalleryItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setGalleryCategory, addGalleryItem, deleteGalleryItem } = gallerySlice.actions;

export const selectGalleryItems = (state) => state.gallery.items;
export const selectGalleryCategory = (state) => state.gallery.selectedCategory;

export default gallerySlice.reducer;
