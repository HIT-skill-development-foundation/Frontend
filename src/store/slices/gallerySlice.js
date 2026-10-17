import { createSlice } from '@reduxjs/toolkit';
import imgAward from '../../assets/images/award.jpeg';
import imgGift from '../../assets/images/gift.jpeg';
import imgGift2 from '../../assets/images/gift2.jpeg';
import imgDirector from '../../assets/images/director.jpeg';
import imgHeadOffice from '../../assets/images/headoffice.jpeg';
import imgClass from '../../assets/images/class.jpeg';
import imgClass2 from '../../assets/images/class2.jpeg';
import imgClass3 from '../../assets/images/class3.jpeg';
import imgClass4 from '../../assets/images/class4.jpeg';
import imgClass5 from '../../assets/images/class5.jpeg';
import imgCake from '../../assets/images/cake.jpeg';
import imgCake1 from '../../assets/images/cake1.jpeg';
import imgCake2 from '../../assets/images/cake2.jpeg';
import imgCake3 from '../../assets/images/cake3.jpeg';
import imgCake4 from '../../assets/images/cake4.jpeg';
import imgCake5 from '../../assets/images/cake5.jpeg';

const initialGalleryItems = [
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
    id: 13,
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
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
