/**
 * Route Configuration conforming to the Open/Closed Principle (OCP).
 * Configured specifically for the requested navigation layout:
 * Home, Gallery, Course Offer, About Us, Student Portal, Admin Portal, Donate Now, Become Member
 */
export const ROUTES_CONFIG = [
  {
    path: '/',
    id: 'home',
    label: 'Home',
    icon: 'home',
    title: 'HIT Computer Education - Skill Mission Portal',
    navOrder: 1,
    isNav: true,
  },
  {
    path: '/gallery',
    id: 'gallery',
    label: 'Gallery',
    icon: 'photo_library',
    title: 'Institutional Gallery - HIT Computer Education',
    navOrder: 2,
    isNav: true,
  },
  {
    path: '/courses',
    id: 'courses',
    label: 'Course Offer',
    icon: 'school',
    title: 'Academic Course Offerings & NSQF Diplomas',
    navOrder: 3,
    isNav: true,
  },
  {
    path: '/about',
    id: 'about',
    label: 'About Us',
    icon: 'info',
    title: 'About H.I.T India Skill Development Foundation',
    navOrder: 4,
    isNav: true,
  },
  {
    path: '/student-portal',
    id: 'student_portal',
    label: 'Student Portal',
    icon: 'badge',
    title: 'Student Authentication & Dossier Portal',
    navOrder: 5,
    isNav: true,
  },
  {
    path: '/admin',
    id: 'admin',
    label: 'Admin Portal',
    icon: 'admin_panel_settings',
    title: 'Super Admin Command Console',
    admin: true,
    navOrder: 6,
    isNav: true,
  },
  {
    path: '/donation',
    id: 'donation',
    label: 'Donate Now',
    icon: 'volunteer_activism',
    title: 'Official Giving & 80G Tax Exemption Portal',
    highlight: true,
    navOrder: 7,
    isNav: true,
  },
  {
    path: '/become-member',
    id: 'member',
    label: 'Member',
    icon: 'group',
    title: 'Membership & Franchise Network',
    navOrder: 8,
    isNav: true,
    hasDropdown: true,
    children: [
      {
        path: '/become-member',
        id: 'become_member',
        label: 'Become a Member',
        icon: 'card_membership',
        desc: 'Join Foundation as Patron / Life Member',
      },
      {
        path: '/#franchise-contact',
        id: 'get_franchise',
        label: 'Get Franchise',
        icon: 'storefront',
        desc: 'Affiliate or open an authorized HIT Centre',
      },
    ],
  },
  // Sub-routes & supplementary pages
  {
    path: '/admission',
    id: 'admission',
    label: 'Admission Form',
    isNav: false,
  },
  {
    path: '/receipt',
    id: 'receipt',
    label: '80G Voucher',
    isNav: false,
  },
  {
    path: '/verification',
    id: 'verification',
    label: 'Roll Verification',
    isNav: false,
  },
];

export const NAV_LINKS = ROUTES_CONFIG.filter((r) => r.isNav).sort((a, b) => a.navOrder - b.navOrder);

export default ROUTES_CONFIG;
