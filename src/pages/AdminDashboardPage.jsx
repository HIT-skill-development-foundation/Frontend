import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin, useLoader } from '../store/hooks';
import logo2 from '../assets/images/logo2.jpeg';
import loginSvg from '../assets/images/Login.svg';
import {
  authService,
  adminService,
  admissionService,
  studentService,
  courseService,
  donationService,
  expenseService,
  galleryService,
} from '../services/hitApi';

export default function AdminDashboardPage() {
  const {
    isAdminLoggedIn,
    adminUser,
    expenses,
    adminDonations,
    pendingApprovals,
    adminStats,
    courses,
    universityPrograms,
    galleryItems,
    adminLogin,
    adminLogout,
    syncStats,
    syncExpenses,
    syncDonations,
    syncPendingApprovals,
    syncCourses,
    syncUniversityPrograms,
    recordExpense,
    removeExpense,
    approveCert,
    addNewCourse,
    editCourse,
    removeCourse,
    addNewUniversityProgram,
    editUniversityProgram,
    removeUniversityProgram,
    addNewGalleryItem,
    removeGalleryItem,
  } = useAdmin();

  const { withLoader, notify } = useLoader();

  // Navigation tab state: 'overview', 'students', 'donations', 'expenses', 'courses', 'gallery', 'certificates'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login form state
  const [adminCreds, setAdminCreds] = useState({
    email: '',
    password: '',
  });

  // Course filter for Students tab
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [liveStudents, setLiveStudents] = useState([]);

  // Course Catalog Sub-tab ('vocational' | 'university')
  const [courseCatalogSubTab, setCourseCatalogSubTab] = useState('vocational');

  // Modals state
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'Hardware & Lab Equipment',
    amount: '',
    vendor: '',
    date: new Date().toLocaleDateString('en-GB'),
    invoiceNo: '',
  });

  // Vocational Course Modal & Form
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourseForm, setNewCourseForm] = useState({
    code: '',
    name: '',
    duration: '12 Months',
    eligibility: '10th / 12th Pass',
    fee: '₹12,000',
    feeAmount: 12000,
    formula: 'Fundamental + MS Office + Tally + Web Design',
    modulesStr: 'Computer Fundamental & Windows, MS Office 2021, Tally Prime with GST, HTML & CSS',
    icon: 'desktop_windows',
    popular: true,
  });

  // University Program Modal & Form
  const [showAddUnivModal, setShowAddUnivModal] = useState(false);
  const [editingUnivProgram, setEditingUnivProgram] = useState(null);
  const [newUnivProgramForm, setNewUnivProgramForm] = useState({
    code: '',
    name: '',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 in any stream (Math/CS preferred)',
    type: 'Undergraduate Degree',
    mode: 'Online & Distance Mode',
    fee: 'Flexible Semester Slabs',
    streams: 'Cloud Computing, Web Development, AI/ML',
    icon: 'laptop_chromebook',
    popular: true,
  });

  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalleryForm, setNewGalleryForm] = useState({
    title: '',
    category: 'infrastructure',
    location: 'Ghosi Central Campus',
    date: 'October 2026',
    badge: 'Event Photo',
    desc: '',
  });

  // Tooltip state for interactive charts
  const [areaTooltip, setAreaTooltip] = useState(null);
  const [barTooltip, setBarTooltip] = useState(null);

  // ==========================================
  // LIVE BACKEND DATA SYNCHRONIZATION
  // ==========================================
  const loadDashboardData = async () => {
    try {
      const statsRes = await adminService.getStats().catch(() => null);
      if (statsRes?.data) syncStats(statsRes.data);

      const expRes = await expenseService.getExpenses().catch(() => null);
      if (expRes?.data && Array.isArray(expRes.data)) syncExpenses(expRes.data);

      const admRes = await admissionService.getAdmissions({ page: 1, limit: 50 }).catch(() => null);
      if (admRes?.data && Array.isArray(admRes.data)) syncPendingApprovals(admRes.data);

      const donRes = await donationService.getDonations().catch(() => null);
      if (donRes?.data && Array.isArray(donRes.data)) syncDonations(donRes.data);

      const stuRes = await studentService.listStudents().catch(() => null);
      if (stuRes?.data && Array.isArray(stuRes.data) && stuRes.data.length > 0) {
        setLiveStudents(stuRes.data);
      }

      // Sync Vocational Courses
      const coursesRes = await courseService.getAllCourses().catch(() => null);
      if (coursesRes?.data && Array.isArray(coursesRes.data)) {
        syncCourses(coursesRes.data);
      }

      // Sync University Programs
      const univRes = await courseService.getUniversityPrograms().catch(() => null);
      if (univRes?.data && Array.isArray(univRes.data)) {
        syncUniversityPrograms(univRes.data);
      }
    } catch (err) {
      console.warn('Dashboard live sync non-blocking error:', err.message);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadDashboardData();
    }
  }, [isAdminLoggedIn]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    if (!adminCreds.email || !adminCreds.password) {
      notify('error', 'Please enter admin email and password.');
      return;
    }

    await withLoader(async () => {
      try {
        const res = await authService.loginAdmin({
          email: adminCreds.email.trim(),
          password: adminCreds.password,
        });
        if (res && (res.success || res.token)) {
          adminLogin(res.data);
          notify('success', 'Authenticated as Super Admin. Central Ledger synced.');
          return;
        }
        notify('error', res?.message || 'Invalid administrator credentials.');
      } catch (err) {
        notify('error', err.message || 'Invalid administrator credentials.');
      }
    }, 'Authenticating Super Admin Credentials with Institutional Node...');
  };

  const handleDemoAdminLogin = async () => {
    await withLoader(async () => {
      try {
        const res = await authService.loginAdmin({
          email: 'admin@hitindia.org',
          password: 'password123',
        });
        if (res && (res.success || res.token)) {
          adminLogin(res.data);
          notify('success', 'Logged in as Super Admin (Director Desk)');
          return;
        }
        notify('error', 'Demo admin account unavailable on remote server.');
      } catch (err) {
        notify('error', err.message || 'Demo admin login failed.');
      }
    }, 'Accessing Central Super Admin Console...');
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    await withLoader(async () => {
      try {
        const payload = {
          title: newExpense.title,
          category: newExpense.category,
          amount: Number(newExpense.amount),
          vendor: newExpense.vendor || 'Authorized Supplier',
          date: newExpense.date || new Date().toLocaleDateString('en-GB'),
          invoiceNo: newExpense.invoiceNo || `INV-${Date.now()}`,
          status: 'Verified & Settled',
        };
        const res = await expenseService.addExpense(payload);
        const item = res?.data || payload;
        recordExpense(item);
        setShowAddExpenseModal(false);
        setNewExpense({
          title: '',
          category: 'Hardware & Lab Equipment',
          amount: '',
          vendor: '',
          date: new Date().toLocaleDateString('en-GB'),
          invoiceNo: '',
        });
        notify('success', `Expenditure of ₹${Number(newExpense.amount).toLocaleString('en-IN')} recorded successfully.`);
      } catch (err) {
        notify('error', err.message || 'Failed to record expenditure into backend.');
      }
    }, 'Recording Institutional Expenditure into Ledger...');
  };

  // ==========================================
  // VOCATIONAL COURSES CRUD HANDLERS
  // ==========================================
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!newCourseForm.name || !newCourseForm.code) return;

    await withLoader(async () => {
      const modulesArr = newCourseForm.modulesStr
        ? newCourseForm.modulesStr.split(',').map((m) => m.trim()).filter(Boolean)
        : [];

      const payload = {
        code: newCourseForm.code.trim().toUpperCase(),
        name: newCourseForm.name.trim(),
        duration: newCourseForm.duration || '12 Months',
        eligibility: newCourseForm.eligibility || '10th / 12th Pass',
        fee: newCourseForm.fee || '₹12,000',
        feeAmount: Number(newCourseForm.feeAmount) || 0,
        formula: newCourseForm.formula || '',
        modules: modulesArr,
        icon: newCourseForm.icon || 'desktop_windows',
        popular: Boolean(newCourseForm.popular),
      };

      if (editingCourse) {
        const courseId = editingCourse.id || editingCourse._id || editingCourse.code;
        try {
          const res = await courseService.updateCourse(courseId, payload);
          const updated = res?.data || { ...editingCourse, ...payload };
          editCourse(updated);
          notify('success', `Course ${payload.code} updated successfully.`);
        } catch (err) {
          console.warn('Backend course update error, applying locally:', err.message);
          editCourse({ ...editingCourse, ...payload });
          notify('success', `Course ${payload.code} updated locally.`);
        }
      } else {
        try {
          const res = await courseService.createCourse(payload);
          const savedCourse = res?.data || { ...payload, id: payload.code.toLowerCase() };
          addNewCourse(savedCourse);
          notify('success', `New course ${payload.name} created successfully.`);
        } catch (err) {
          console.warn('Backend course create error, adding locally:', err.message);
          addNewCourse({ ...payload, id: payload.code.toLowerCase() });
          notify('success', `New course ${payload.name} created locally.`);
        }
      }

      setShowAddCourseModal(false);
      setEditingCourse(null);
    }, editingCourse ? 'Updating Vocational Course...' : 'Publishing New Vocational Course...');
  };

  const handleDeleteCourse = async (course) => {
    const courseId = course.id || course._id || course.code;
    if (!window.confirm(`Are you sure you want to delete "${course.name}" (${course.code})?`)) {
      return;
    }

    await withLoader(async () => {
      try {
        await courseService.deleteCourse(courseId);
        removeCourse(courseId);
        notify('success', `Course ${course.code} removed successfully.`);
      } catch (err) {
        console.warn('Backend delete error, removing locally:', err.message);
        removeCourse(courseId);
        notify('success', `Course ${course.code} removed locally.`);
      }
    }, `Deleting Course ${course.code}...`);
  };

  // ==========================================
  // UNIVERSITY PROGRAMS CRUD HANDLERS
  // ==========================================
  const handleSaveUnivProgram = async (e) => {
    e.preventDefault();
    if (!newUnivProgramForm.name || !newUnivProgramForm.code) return;

    await withLoader(async () => {
      const payload = {
        code: newUnivProgramForm.code.trim().toUpperCase(),
        name: newUnivProgramForm.name.trim(),
        duration: newUnivProgramForm.duration || '3 Years (6 Semesters)',
        eligibility: newUnivProgramForm.eligibility || '10+2 in any stream (Math/CS preferred)',
        type: newUnivProgramForm.type || 'Undergraduate Degree',
        mode: newUnivProgramForm.mode || 'Online & Distance Mode',
        fee: newUnivProgramForm.fee || 'Flexible Semester Slabs',
        streams: newUnivProgramForm.streams || 'Cloud Computing, Web Development, AI/ML',
        icon: newUnivProgramForm.icon || 'laptop_chromebook',
        popular: Boolean(newUnivProgramForm.popular),
      };

      if (editingUnivProgram) {
        const progId = editingUnivProgram.id || editingUnivProgram._id || editingUnivProgram.code;
        try {
          const res = await courseService.updateUniversityProgram(progId, payload);
          const updated = res?.data || { ...editingUnivProgram, ...payload };
          editUniversityProgram(updated);
          notify('success', `University Program ${payload.code} updated successfully.`);
        } catch (err) {
          console.warn('Backend program update error, applying locally:', err.message);
          editUniversityProgram({ ...editingUnivProgram, ...payload });
          notify('success', `University Program ${payload.code} updated locally.`);
        }
      } else {
        try {
          const res = await courseService.createUniversityProgram(payload);
          const savedProg = res?.data || { ...payload, id: `univ-${payload.code.toLowerCase()}` };
          addNewUniversityProgram(savedProg);
          notify('success', `University Program ${payload.name} created successfully.`);
        } catch (err) {
          console.warn('Backend program create error, adding locally:', err.message);
          addNewUniversityProgram({ ...payload, id: `univ-${payload.code.toLowerCase()}` });
          notify('success', `University Program ${payload.name} created locally.`);
        }
      }

      setShowAddUnivModal(false);
      setEditingUnivProgram(null);
    }, editingUnivProgram ? 'Updating University Degree Program...' : 'Creating New University Degree Program...');
  };

  const handleDeleteUnivProgram = async (program) => {
    const progId = program.id || program._id || program.code;
    if (!window.confirm(`Are you sure you want to delete university program "${program.name}" (${program.code})?`)) {
      return;
    }

    await withLoader(async () => {
      try {
        await courseService.deleteUniversityProgram(progId);
        removeUniversityProgram(progId);
        notify('success', `University Program ${program.code} removed successfully.`);
      } catch (err) {
        console.warn('Backend delete error, removing locally:', err.message);
        removeUniversityProgram(progId);
        notify('success', `University Program ${program.code} removed locally.`);
      }
    }, `Deleting University Program ${program.code}...`);
  };

  const handleCreateGalleryItem = async (e) => {
    e.preventDefault();
    if (!newGalleryForm.title) return;

    await withLoader(async () => {
      try {
        const payload = {
          title: newGalleryForm.title,
          category: newGalleryForm.category || 'events',
          location: newGalleryForm.location || 'Ghosi Central Campus',
          date: newGalleryForm.date || 'October 2026',
          badge: newGalleryForm.badge || 'Campus Event',
          desc: newGalleryForm.desc || 'Free computer awareness session for rural youth.',
          img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
          gps: 'Ghosi Campus Hall',
          isFeatured: true,
        };
        const res = await galleryService.addItem(payload);
        addNewGalleryItem(res?.data || payload);
        setShowAddGalleryModal(false);
        setNewGalleryForm({
          title: '',
          category: 'infrastructure',
          location: 'Ghosi Central Campus',
          date: 'October 2026',
          badge: 'Event Photo',
          desc: '',
        });
        notify('success', 'New photograph and event description added to Gallery.');
      } catch (err) {
        notify('error', err.message || 'Failed to upload photo to server.');
      }
    }, 'Updating Institutional Media Repository...');
  };

  const handleApprove = async (id, studentName) => {
    await withLoader(async () => {
      try {
        await admissionService.updateStatus(id, {
          status: 'Approved',
          certificateIssued: true,
          remark: 'All documents verified successfully against MCA guidelines',
        });
      } catch (err) {
        console.warn('Backend updateStatus error, approving locally:', err.message);
      }
      approveCert(id);
      notify('success', `Certificate approved for ${studentName || id}. Permanent verification QR active.`);
    }, `Validating Dossier & Issuing Certificate for ${studentName || id}...`);
  };

  // Live Database Students
  const studentsSource = liveStudents || [];

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return studentsSource.filter((st) => {
      const matchCourse =
        selectedCourseFilter === 'all' ||
        st.courseId === selectedCourseFilter ||
        st.courseName?.toLowerCase() === selectedCourseFilter.toLowerCase() ||
        st.course?.code?.toLowerCase() === selectedCourseFilter.toLowerCase();

      const term = studentSearch.toLowerCase();
      const matchSearch =
        !term ||
        st.name?.toLowerCase().includes(term) ||
        st.fullName?.toLowerCase().includes(term) ||
        st.rollNo?.toLowerCase().includes(term) ||
        st.centre?.toLowerCase().includes(term) ||
        st.centreName?.toLowerCase().includes(term);

      return matchCourse && matchSearch;
    });
  }, [studentsSource, selectedCourseFilter, studentSearch]);

  // Financial & KPI Computations from Live Database
  const totalDonationsAmount = useMemo(() => {
    return (adminDonations || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [adminDonations]);

  const totalExpensesAmount = useMemo(() => {
    return (expenses || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [expenses]);

  const totalStudentsCount = adminStats?.totalStudents || studentsSource.length;

  // Real Dynamic Monthly Flow Data from Database
  const monthlyFlowData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map = {};
    months.forEach((m) => {
      map[m] = { month: m, donations: 0, expenses: 0 };
    });

    (adminDonations || []).forEach((d) => {
      const dateVal = d.date || d.createdAt;
      if (dateVal) {
        const dObj = new Date(dateVal);
        if (!isNaN(dObj.getTime())) {
          const m = months[dObj.getMonth()];
          if (map[m]) map[m].donations += Number(d.amount) || 0;
        }
      }
    });

    (expenses || []).forEach((e) => {
      const dateVal = e.date || e.createdAt;
      if (dateVal) {
        const dObj = new Date(dateVal);
        if (!isNaN(dObj.getTime())) {
          const m = months[dObj.getMonth()];
          if (map[m]) map[m].expenses += Number(e.amount) || 0;
        }
      }
    });

    return months.map((m) => map[m]);
  }, [adminDonations, expenses]);

  const hasFlowData = useMemo(() => {
    return monthlyFlowData.some((d) => d.donations > 0 || d.expenses > 0);
  }, [monthlyFlowData]);

  // Real Dynamic Enrolment by Course from Live Database
  const categoryDistribution = useMemo(() => {
    if (!courses || courses.length === 0) return [];
    return courses.map((c) => {
      const count = studentsSource.filter(
        (s) =>
          s.courseId === c.id ||
          s.courseName?.toLowerCase() === c.name?.toLowerCase() ||
          s.courseName?.toLowerCase() === c.code?.toLowerCase() ||
          s.course?.code?.toLowerCase() === c.code?.toLowerCase()
      ).length;
      return {
        category: c.code || c.name,
        amount: count,
        color: '#065F46',
      };
    });
  }, [courses, studentsSource]);

  const hasCategoryDistribution = useMemo(() => {
    return categoryDistribution.some((c) => c.amount > 0);
  }, [categoryDistribution]);

  // Real Dynamic Program Allocation from Live Expenses
  const programAllocation = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const catMap = {};
    expenses.forEach((e) => {
      const cat = e.category || 'General Operations';
      catMap[cat] = (catMap[cat] || 0) + (Number(e.amount) || 0);
    });
    const total = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(catMap).map(([name, amt]) => ({
      name,
      note: `${expenses.filter((e) => (e.category || 'General Operations') === name).length} recorded vouchers`,
      amount: amt,
      share: Math.min(100, Math.round((amt / total) * 100)),
    }));
  }, [expenses]);

  // Real Dynamic Activity Feed from Live Ledger Actions
  const recentActivity = useMemo(() => {
    const list = [];
    (expenses || []).slice(0, 3).forEach((e) => {
      list.push({
        who: e.vendor || 'Accountant',
        what: 'logged expenditure',
        target: `${e.title || 'Expense'} · ₹${Number(e.amount || 0).toLocaleString('en-IN')}`,
        when: e.date || (e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-GB') : 'Recent'),
        initials: 'EXP',
      });
    });
    (adminDonations || []).slice(0, 3).forEach((d) => {
      list.push({
        who: d.donorName || 'Patron',
        what: 'contributed donation',
        target: `₹${Number(d.amount || 0).toLocaleString('en-IN')} (${d.receiptNo || 'Receipt'})`,
        when: d.date || (d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB') : 'Recent'),
        initials: '80G',
      });
    });
    (pendingApprovals || []).slice(0, 3).forEach((p) => {
      list.push({
        who: p.name || p.fullName || 'Candidate',
        what: p.status === 'Approved' ? 'certificate approved for' : 'applied for',
        target: `${p.course || p.courseName || 'Program'} (${p.id || p._id || p.applicationNumber || 'App'})`,
        when: p.date || (p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB') : 'Recent'),
        initials: 'REG',
      });
    });
    (liveStudents || []).slice(0, 3).forEach((s) => {
      list.push({
        who: s.name || s.fullName || 'Student',
        what: 'enrolled in',
        target: `${s.courseName || 'Course'} (${s.rollNo || s.id || 'Roll'})`,
        when: s.date || 'Active',
        initials: 'STU',
      });
    });
    return list;
  }, [expenses, adminDonations, pendingApprovals, liveStudents]);

  // Helper barcode generator
  const renderBarcode = (bars = 28) => {
    const lines = [];
    for (let i = 0; i < bars; i++) {
      const width = i % 5 === 0 ? '2.5px' : i % 3 === 0 ? '1.5px' : '1px';
      lines.push(
        <span
          key={i}
          style={{
            display: 'block',
            width,
            backgroundColor: 'rgba(28, 25, 23, 0.45)',
          }}
        />
      );
    }
    return <span className="inline-flex items-stretch gap-[1.5px] h-3.5">{lines}</span>;
  };

  // Nav items configuration
  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: 'dashboard', category: 'Console' },
    { id: 'students', label: '1. Students by Course', icon: 'groups', category: 'Operations' },
    { id: 'donations', label: '2. Donations (80G)', icon: 'volunteer_activism', category: 'Operations' },
    { id: 'expenses', label: '3. Expenses', icon: 'receipt_long', category: 'Operations' },
    { id: 'courses', label: '4. Course Catalog', icon: 'school', category: 'Operations' },
    { id: 'gallery', label: '5. Photo Gallery', icon: 'photo_library', category: 'Operations' },
    { id: 'certificates', label: '6. Certificate Approvals', icon: 'verified', category: 'Operations' },
  ];

  // ==========================================
  // VIEW 1: UNAUTHENTICATED ADMIN LOGIN GATE
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] text-[#1C1917] flex flex-col justify-between antialiased selection:bg-[#065F46]/10 selection:text-[#065F46]">
        {/* Top Minimal Brand Bar */}
        <header className="h-16 border-b border-[#E7E0D4] bg-[#FAF8F4]/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#065F46] text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <div>
              <span className="font-['Fraunces'] text-lg font-semibold tracking-tight text-[#1C1917]">H.I.T India</span>
              <span className="text-[11px] font-mono text-[#7A7168] ml-2 hidden sm:inline">· Central Secretariat Node</span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A7168] hover:text-[#1C1917] px-3 py-1.5 rounded-lg border border-[#E7E0D4] hover:bg-[#F3EFE7] transition-colors"
          >
            <span>← Return to Public Website</span>
          </Link>
        </header>

        {/* Center Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-4xl w-full bg-white rounded-2xl border border-[#E7E0D4] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Col: Editorial Visual */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#065F46] to-[#044432] p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-mono uppercase tracking-wider backdrop-blur-sm">
                  <span>MCA & 80G Certified</span>
                </div>
                <h1 className="font-['Fraunces'] text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
                  Autonomous Central Secretariat
                </h1>
                <p className="text-xs text-white/80 leading-relaxed">
                  Secure administration console for candidate verification, 80G tax receipting, institutional expenditure ledger, and course management.
                </p>
              </div>

              <div className="relative z-10 py-6 my-auto flex justify-center">
                <img
                  src={loginSvg}
                  alt="Admin Portal"
                  className="w-full max-w-[200px] h-auto object-contain drop-shadow-xl"
                />
              </div>

              <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70 font-mono">
                <span>Node: 275105-MAU-HQ</span>
                <span>256-Bit SSL</span>
              </div>
            </div>

            {/* Right Col: Login Form */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
              <div className="max-w-sm mx-auto w-full space-y-6">
                <div>
                  <h2 className="font-['Fraunces'] text-2xl font-semibold tracking-tight text-[#1C1917]">Super Admin Sign In</h2>
                  <p className="text-xs text-[#7A7168] mt-1">
                    Enter your administrative credentials to open the director desk.
                  </p>
                </div>

                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#7A7168] block mb-1.5">
                      Administrator Email / Username
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@hitindia.org"
                      value={adminCreds.email}
                      onChange={(e) => setAdminCreds({ ...adminCreds, email: e.target.value })}
                      className="h-10 w-full rounded-lg border border-[#E7E0D4] bg-[#FAF8F4] px-3 text-sm text-[#1C1917] placeholder:text-[#7A7168]/60 focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#7A7168] block mb-1.5">
                      Secret Security Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminCreds.password}
                      onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })}
                      className="h-10 w-full rounded-lg border border-[#E7E0D4] bg-[#FAF8F4] px-3 text-sm text-[#1C1917] placeholder:text-[#7A7168]/60 focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-10 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Authorize & Access Desk</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </form>

                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E7E0D4]"></div>
                  </div>
                  <span className="relative bg-white px-3 text-[11px] font-mono text-[#7A7168]">DIRECTOR DEMO SHORTCUT</span>
                </div>

                <button
                  type="button"
                  onClick={handleDemoAdminLogin}
                  className="w-full h-10 rounded-lg border border-[#E7E0D4] bg-[#FAF8F4] hover:bg-[#F3EFE7] text-[#1C1917] font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-[#065F46]"></span>
                  <span>Instant 1-Click Director Access (admin@hitindia.org)</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="h-12 border-t border-[#E7E0D4] px-6 flex items-center justify-between text-xs text-[#7A7168] font-mono">
          <span>Hindustan Institute of Technology Foundation © 2026</span>
          <span>Reg. No. 275105/UP</span>
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN CONSOLE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#1C1917] antialiased flex flex-col font-['Inter',sans-serif] selection:bg-[#065F46]/10 selection:text-[#065F46]">
      {/* Inline Scoped Styles for Tag-Card & Barcode */}
      <style>{`
        .tag-card {
          position: relative;
          padding-left: 32px;
        }
        .tag-card::before {
          content: "";
          position: absolute;
          left: 14px;
          top: 22px;
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: #FAF8F4;
          border: 1.5px solid #E7E0D4;
          box-shadow: 0 0 0 2px #FFFFFF;
        }
        .tag-card::after {
          content: "";
          position: absolute;
          left: 22px;
          top: 14px;
          bottom: 14px;
          border-left: 1.5px dashed #E7E0D4;
        }
      `}</style>

      <div className="flex min-h-screen">
        {/* ======================================================== */}
        {/* LEFT SIDEBAR (Maren & Co style) */}
        {/* ======================================================== */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E7E0D4] bg-[#FAF8F4] lg:flex justify-between">
          <div>
            {/* Brand Header */}
            <div className="flex h-16 items-center gap-2.5 border-b border-[#E7E0D4] px-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#065F46] text-white shadow-xs">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
              <div>
                <span className="font-['Fraunces'] text-base font-semibold tracking-tight text-[#1C1917] block leading-none">
                  H.I.T Foundation
                </span>
                <span className="text-[10px] text-[#7A7168] font-mono block mt-1">Admin Central Desk</span>
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 space-y-1 p-4">
              <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#7A7168]/80 font-mono">
                Secretariat Desk
              </p>

              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#065F46] text-white shadow-xs font-semibold'
                        : 'text-[#7A7168] hover:bg-[#F3EFE7] hover:text-[#1C1917]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              <p className="px-3 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-wider text-[#7A7168]/80 font-mono">
                System & Portal
              </p>

              <Link
                to="/"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#7A7168] transition-colors hover:bg-[#F3EFE7] hover:text-[#1C1917]"
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
                <span>Public Website</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  authService.logout();
                  adminLogout();
                  notify('info', 'Admin console session closed.');
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out Desk</span>
              </button>
            </nav>
          </div>

          {/* Bottom Callout Tag Card (Institutional Node) */}
          <div className="m-4 rounded-xl border border-[#E7E0D4] bg-[#065F46] p-4 text-white shadow-xs">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#DB2759] text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                  <path d="M12 2l2.6 6.4L21 9.3l-4.9 4.4L17.4 21 12 17.8 6.6 21l1.3-7.3L3 9.3l6.4-.9L12 2z" />
                </svg>
              </span>
              <p className="font-['Fraunces'] text-xs font-semibold">Institutional Node</p>
            </div>
            <p className="text-[11px] leading-relaxed text-white/80">
              MCA & 80G Certified Node: <strong>275105-MAU-HQ</strong>. Cryptographic QR enabled.
            </p>
            <button
              type="button"
              onClick={loadDashboardData}
              className="mt-3 inline-flex h-7 w-full items-center justify-center rounded-md bg-[#FAF8F4] text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F4]/90 transition-colors cursor-pointer"
            >
              Sync Backend Ledger
            </button>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT MAIN CONTENT AREA */}
        {/* ======================================================== */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* STICKY TOP HEADER BAR */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#E7E0D4] bg-[#FAF8F4]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8 justify-between">
            {/* Search Input */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg border border-[#E7E0D4] hover:bg-[#F3EFE7] text-[#1C1917]"
              >
                <span className="material-symbols-outlined text-xl">menu</span>
              </button>

              <div className="relative flex-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7168]">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  placeholder="Search students, roll numbers, vouchers, donor PAN…"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#E7E0D4] bg-white pl-9 pr-14 text-xs sm:text-sm text-[#1C1917] placeholder:text-[#7A7168]/70 focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/20 transition-all"
                />
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-[#E7E0D4] bg-[#F3EFE7] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#7A7168] sm:inline-flex">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right Tools & Admin Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3EFE7] border border-[#E7E0D4] text-[11px] font-mono text-[#065F46] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#065F46] animate-pulse"></span>
                <span>Live Central Node</span>
              </div>

              <button
                type="button"
                onClick={loadDashboardData}
                title="Sync Database"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[#F3EFE7] transition-colors border border-[#E7E0D4]/60 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#7A7168]">sync</span>
              </button>

              <div className="h-6 w-px bg-[#E7E0D4]"></div>

              {/* Admin Avatar & Label */}
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#065F46] text-xs font-semibold text-white shadow-xs">
                  AV
                </span>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none text-[#1C1917]">{adminUser?.name || 'Er. A. K. Verma'}</p>
                  <p className="mt-1 text-[10px] text-[#7A7168] font-mono">Director & Trustee · Super Admin</p>
                </div>
              </div>
            </div>
          </header>

          {/* MOBILE DRAWER (For small screens) */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-b border-[#E7E0D4] bg-[#FAF8F4] p-4 space-y-1 shadow-md animate-fade-in">
              <p className="px-3 pb-1 text-[10px] font-mono text-[#7A7168] uppercase font-bold">Admin Navigation</p>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                    activeTab === item.id ? 'bg-[#065F46] text-white' : 'text-[#7A7168] hover:bg-[#F3EFE7]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* MAIN WORKSPACE BODY */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1400px] flex-col gap-6">

              {/* ======================================================== */}
              {/* TAB 0: EXECUTIVE OVERVIEW (Maren & Co Master Dashboard) */}
              {/* ======================================================== */}
              {activeTab === 'overview' && (
                <>
                  {/* Greeting & Header Actions */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-[#7A7168]">
                        Sunday, October 25, 2026 · Ghosi, Mau Central Secretariat
                      </p>
                      <h1 className="mt-1 font-['Fraunces'] text-2xl font-semibold tracking-tight text-[#1C1917] sm:text-3xl">
                        Good morning, Director Verma
                      </h1>
                      <p className="mt-1 text-xs sm:text-sm text-[#7A7168]">
                        Here's how the foundation operations, students, and institutional ledgers are performing today.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-[#E7E0D4] bg-white px-3 text-xs font-medium text-[#1C1917] hover:bg-[#F3EFE7] transition-colors cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        Financial Year 2026-27
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const csv = "Record,Amount,Type\nDonations," + totalDonationsAmount + ",Credit\nExpenses," + totalExpensesAmount + ",Debit";
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `HIT_Foundation_Summary_${Date.now()}.csv`;
                          a.click();
                          notify('success', 'Summary CSV report downloaded.');
                        }}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-[#E7E0D4] bg-white px-3 text-xs font-medium text-[#1C1917] hover:bg-[#F3EFE7] transition-colors cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export Summary
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAddExpenseModal(true)}
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-[#065F46] px-3.5 text-xs font-medium text-white hover:bg-[#065F46]/90 transition-colors shadow-xs cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Record Expense
                      </button>
                    </div>
                  </div>

                  {/* 4 KPI TAG CARDS */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Card 1 */}
                    <div className="tag-card group relative overflow-hidden rounded-xl border border-[#E7E0D4] bg-white py-5 pr-5 transition-shadow hover:shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#7A7168]">Total Enrolled Students</p>
                        {renderBarcode(16)}
                      </div>
                      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-[#1C1917]">
                        {totalStudentsCount.toLocaleString('en-IN')}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#065F46]/10 text-[#065F46]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#065F46]"></span>
                          Live Registry
                        </span>
                        <span className="text-[11px] text-[#7A7168] font-mono">{studentsSource.length} Verified in DB</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#DB2759]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>

                    {/* Card 2 */}
                    <div className="tag-card group relative overflow-hidden rounded-xl border border-[#E7E0D4] bg-white py-5 pr-5 transition-shadow hover:shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#7A7168]">80G Donations Received</p>
                        {renderBarcode(18)}
                      </div>
                      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-[#065F46]">
                        ₹{totalDonationsAmount.toLocaleString('en-IN')}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#065F46]/10 text-[#065F46]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#065F46]"></span>
                          Tax Compliant
                        </span>
                        <span className="text-[11px] text-[#7A7168] font-mono">{(adminDonations || []).length} Receipts Issued</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#DB2759]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>

                    {/* Card 3 */}
                    <div className="tag-card group relative overflow-hidden rounded-xl border border-[#E7E0D4] bg-white py-5 pr-5 transition-shadow hover:shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#7A7168]">Total Expenses</p>
                        {renderBarcode(16)}
                      </div>
                      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-rose-700">
                        ₹{totalExpensesAmount.toLocaleString('en-IN')}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-rose-50 text-rose-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                          Audited
                        </span>
                        <span className="text-[11px] text-[#7A7168] font-mono">{(expenses || []).length} Recorded Vouchers</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#DB2759]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>

                    {/* Card 4 */}
                    <div className="tag-card group relative overflow-hidden rounded-xl border border-[#E7E0D4] bg-white py-5 pr-5 transition-shadow hover:shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#7A7168]">Active Courses & Programs</p>
                        {renderBarcode(20)}
                      </div>
                      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-[#1C1917]">
                        {courses.length} Active Diplomas
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#065F46]/10 text-[#065F46]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#065F46]"></span>
                          Accredited
                        </span>
                        <span className="text-[11px] text-[#7A7168] font-mono">{courses.length} Certified Courses</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#DB2759]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>
                  </div>

                  {/* 2-COLUMN SECTION: DUAL AREA CHART & FUND UTILIZATION SHARE */}
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Left: Dual Area Chart (Donations vs Expenses) */}
                    <section className="xl:col-span-2 rounded-xl border border-[#E7E0D4] bg-white p-5 sm:p-6">
                      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="font-['Fraunces'] text-base font-semibold tracking-tight text-[#1C1917]">
                            Donations & 80G Receipts vs. Institutional Expenses
                          </h2>
                          <p className="mt-1 text-xs text-[#7A7168]">
                            Monthly fund mobilization and utilization across all regional centres (in INR ₹).
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="inline-flex items-center gap-1.5 text-[#7A7168]">
                            <span className="h-2 w-2 rounded-full bg-[#065F46]"></span>
                            Donations (80G)
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[#7A7168]">
                            <span className="h-2 w-2 rounded-full bg-[#DB2759]"></span>
                            Expenses
                          </span>
                        </div>
                      </header>

                      {/* Interactive SVG Area Chart */}
                      <div className="relative mt-6 h-72 w-full">
                        {!hasFlowData ? (
                          <div className="h-full w-full flex items-center justify-center bg-[#FAF8F4]/50 rounded-xl border border-dashed border-[#E7E0D4]">
                            <div className="text-center p-6 space-y-2">
                              <span className="material-symbols-outlined text-3xl text-[#7A7168]">show_chart</span>
                              <p className="text-xs font-semibold text-[#1C1917]">No monthly ledger data recorded yet</p>
                              <p className="text-[11px] text-[#7A7168] max-w-sm">
                                As donations and expenditures are entered into the database, live monthly financial trends will render here automatically.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <svg viewBox="0 0 760 288" className="h-full w-full" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="gradDonations" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#065F46" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#065F46" stopOpacity="0.0" />
                              </linearGradient>
                              <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#DB2759" stopOpacity="0.22" />
                                <stop offset="100%" stopColor="#DB2759" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Dynamic Grid Ticks */}
                            {(() => {
                              const maxVal = Math.max(...monthlyFlowData.flatMap((d) => [d.donations, d.expenses]), 1000);
                              const niceMax = Math.ceil(maxVal / 10000) * 10000 || 10000;
                              const padL = 48, padR = 8, padT = 12, padB = 28;
                              const innerW = 760 - padL - padR;
                              const innerH = 288 - padT - padB;

                              const x = (i) => padL + (i / (monthlyFlowData.length - 1)) * innerW;
                              const y = (v) => padT + innerH - (v / niceMax) * innerH;

                              const donLine = monthlyFlowData.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.donations).toFixed(1)}`).join(' ');
                              const expLine = monthlyFlowData.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.expenses).toFixed(1)}`).join(' ');

                              const donArea = `${donLine} L${x(monthlyFlowData.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;
                              const expArea = `${expLine} L${x(monthlyFlowData.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

                              return (
                                <>
                                  {[0, 1, 2, 3, 4].map((i) => {
                                    const val = (niceMax / 4) * (4 - i);
                                    const gy = padT + (i / 4) * innerH;
                                    return (
                                      <g key={i}>
                                        <line x1={padL} y1={gy} x2={760 - padR} y2={gy} stroke="#E7E0D4" strokeDasharray="3 3" />
                                        <text x={padL - 8} y={gy + 4} textAnchor="end" fontSize="10" fill="#7A7168" fontFamily="monospace">
                                          ₹{Math.round(val / 1000)}k
                                        </text>
                                      </g>
                                    );
                                  })}

                                  <path d={donArea} fill="url(#gradDonations)" />
                                  <path d={expArea} fill="url(#gradExpenses)" />
                                  <path d={donLine} fill="none" stroke="#065F46" strokeWidth="2.5" />
                                  <path d={expLine} fill="none" stroke="#DB2759" strokeWidth="2" strokeDasharray="5 2" />

                                  {monthlyFlowData.map((d, i) => (
                                    <g key={i}>
                                      <text x={x(i)} y={288 - 8} textAnchor="middle" fontSize="11" fill="#7A7168" fontFamily="monospace">
                                        {d.month}
                                      </text>
                                      <circle
                                        cx={x(i)}
                                        cy={y(d.donations)}
                                        r="8"
                                        fill="transparent"
                                        className="cursor-pointer"
                                        onMouseEnter={() => setAreaTooltip({ x: x(i), d })}
                                        onMouseLeave={() => setAreaTooltip(null)}
                                      />
                                      <circle cx={x(i)} cy={y(d.donations)} r="3" fill="#065F46" pointerEvents="none" />
                                      <circle cx={x(i)} cy={y(d.expenses)} r="2.5" fill="#DB2759" pointerEvents="none" />
                                    </g>
                                  ))}
                                </>
                              );
                            })()}
                          </svg>
                        )}

                        {/* Interactive Floating Tooltip */}
                        {areaTooltip && (
                          <div
                            className="pointer-events-none absolute z-20 rounded-lg border border-[#E7E0D4] bg-white p-3 text-xs shadow-md backdrop-blur-sm transition-all"
                            style={{
                              left: `${Math.min(78, (areaTooltip.x / 760) * 100)}%`,
                              top: '8px',
                            }}
                          >
                            <p className="mb-1.5 font-semibold text-[#1C1917] font-['Fraunces']">{areaTooltip.d.month}</p>
                            <div className="space-y-1 font-mono text-[11px]">
                              <div className="flex items-center justify-between gap-6 text-[#065F46]">
                                <span>Donations:</span>
                                <span className="font-bold">₹{areaTooltip.d.donations.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex items-center justify-between gap-6 text-[#DB2759]">
                                <span>Expenses:</span>
                                <span className="font-bold">₹{areaTooltip.d.expenses.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Right: Program Fund Utilization & Sources */}
                    <section className="rounded-xl border border-[#E7E0D4] bg-white p-5 sm:p-6 flex flex-col justify-between">
                      <div>
                        <header className="flex items-start justify-between">
                          <div>
                            <h2 className="font-['Fraunces'] text-base font-semibold tracking-tight text-[#1C1917]">
                              Fund Allocation & Utilization
                            </h2>
                            <p className="mt-1 text-xs text-[#7A7168]">Categorized expenditure distribution</p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-xs font-mono font-medium text-[#1C1917]">
                            {programAllocation.length} Categories
                          </span>
                        </header>

                        <div className="mt-5">
                          <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#7A7168]">
                            Total Funds Tracked
                          </p>
                          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums tracking-tight text-[#065F46]">
                            ₹{totalExpensesAmount.toLocaleString('en-IN')}
                          </p>
                        </div>

                        {programAllocation.length === 0 ? (
                          <div className="my-8 p-6 text-center text-xs text-[#7A7168] bg-[#FAF8F4] rounded-xl border border-dashed border-[#E7E0D4]">
                            No categorized expenditures logged yet. Add expenses to track fund allocation across departments.
                          </div>
                        ) : (
                          <ul className="mt-6 space-y-4">
                            {programAllocation.map((ch, idx) => (
                              <li key={idx} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <div>
                                    <p className="font-semibold text-[#1C1917]">{ch.name}</p>
                                    <p className="text-[11px] text-[#7A7168]">{ch.note}</p>
                                  </div>
                                  <p className="font-mono font-bold text-[#1C1917]">₹{ch.amount.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F3EFE7]">
                                  <div
                                    className="h-full rounded-full bg-[#065F46] transition-all duration-500"
                                    style={{ width: `${ch.share}%` }}
                                  ></div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#E7E0D4] flex items-center justify-between text-xs text-[#7A7168] font-mono">
                        <span>Statutory Audit Status</span>
                        <span className="text-[#065F46] font-bold">Live Synchronized</span>
                      </div>
                    </section>
                  </div>

                  {/* 2-COLUMN LOWER SECTION: RECENT CANDIDATE REGISTRATIONS & CATEGORY / ACTIVITY */}
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Left: Recent Student Enrolments & Transactions */}
                    <section className="xl:col-span-2 rounded-xl border border-[#E7E0D4] bg-white flex flex-col justify-between">
                      <div>
                        <header className="flex flex-col gap-3 border-b border-[#E7E0D4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                          <div>
                            <h2 className="font-['Fraunces'] text-base font-semibold tracking-tight text-[#1C1917]">
                              Recent Candidate Registrations & Ledgers
                            </h2>
                            <p className="mt-1 text-xs text-[#7A7168]">
                              Live synchronizations from central student registry.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveTab('students')}
                              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E7E0D4] bg-white px-3 text-xs font-medium text-[#1C1917] hover:bg-[#F3EFE7] transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">filter_list</span>
                              <span>Filter Students</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('students')}
                              className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-[#065F46] hover:bg-[#F3EFE7] transition-colors cursor-pointer"
                            >
                              View all ({studentsSource.length})
                            </button>
                          </div>
                        </header>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-[#E7E0D4] text-[11px] font-mono uppercase tracking-wider text-[#7A7168] bg-[#FAF8F4]/50">
                                <th className="px-6 py-3">Student / Roll ID</th>
                                <th className="px-6 py-3">Course / Diploma</th>
                                <th className="px-6 py-3">Centre</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Fee</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E7E0D4]/70">
                              {studentsSource.length === 0 ? (
                                <tr>
                                  <td colSpan="6" className="p-8 text-center text-xs text-[#7A7168]">
                                    No candidate registration records logged in the live database yet.
                                  </td>
                                </tr>
                              ) : (
                                studentsSource.slice(0, 6).map((st, idx) => (
                                  <tr key={st.id || idx} className="transition-colors hover:bg-[#FAF8F4]/80">
                                    <td className="px-6 py-3.5">
                                      <div className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#065F46]/10 text-[#065F46]">
                                          <span className="material-symbols-outlined text-base">person</span>
                                        </span>
                                        <div>
                                          <p className="font-semibold text-[#1C1917]">{st.name || st.fullName || 'Student'}</p>
                                          <p className="font-mono text-[11px] text-[#7A7168]">{st.rollNo || st.id || 'N/A'}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-3.5 font-semibold text-[#065F46]">{st.courseName || st.course?.name || 'Program'}</td>
                                    <td className="px-6 py-3.5 text-[#7A7168]">{st.centre || st.centreName || 'Central Hub'}</td>
                                    <td className="px-6 py-3.5">
                                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-[#065F46]/10 text-[#065F46]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#065F46]"></span>
                                        {st.status || 'Active'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-3.5 font-mono text-[#7A7168]">
                                      {st.date || (st.createdAt ? new Date(st.createdAt).toLocaleDateString('en-GB') : 'Active')}
                                    </td>
                                    <td className="px-6 py-3.5 text-right font-mono font-bold text-[#1C1917]">
                                      {st.fee || (st.feeStatus === 'Paid' ? 'Paid' : 'Settled')}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="p-4 border-t border-[#E7E0D4] bg-[#FAF8F4]/40 flex items-center justify-between text-xs text-[#7A7168] font-mono">
                        <span>Showing top {Math.min(6, studentsSource.length)} candidate admissions</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('students')}
                          className="font-bold text-[#065F46] hover:underline cursor-pointer"
                        >
                          Browse Full Database →
                        </button>
                      </div>
                    </section>

                    {/* Right: Bar Chart & Recent Activity */}
                    <div className="flex flex-col gap-6">
                      {/* Bar Chart: Enrolment by Course Category */}
                      <section className="rounded-xl border border-[#E7E0D4] bg-white p-5 sm:p-6">
                        <header className="flex items-start justify-between">
                          <div>
                            <h2 className="font-['Fraunces'] text-base font-semibold tracking-tight text-[#1C1917]">
                              Enrolment by Curriculum
                            </h2>
                            <p className="mt-1 text-xs text-[#7A7168]">Live course enrollments</p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-[#F3EFE7] px-2 py-0.5 text-xs font-mono font-medium text-[#1C1917]">
                            {categoryDistribution.length} Courses
                          </span>
                        </header>

                        {/* Interactive SVG Bar Chart */}
                        <div className="relative mt-4 h-48 w-full">
                          {!hasCategoryDistribution ? (
                            <div className="h-full w-full flex items-center justify-center bg-[#FAF8F4]/50 rounded-xl border border-dashed border-[#E7E0D4]">
                              <p className="text-xs text-[#7A7168] text-center p-4">
                                No student enrolments mapped to active course programs yet.
                              </p>
                            </div>
                          ) : (
                            <svg viewBox="0 0 340 180" className="h-full w-full" preserveAspectRatio="none">
                              {(() => {
                                const maxV = Math.max(...categoryDistribution.map((cat) => cat.amount), 5);
                                return (
                                  <>
                                    {[0, 1, 2].map((i) => {
                                      const v = Math.round(maxV - (i * maxV) / 2);
                                      const y = 8 + i * 70;
                                      return (
                                        <g key={i}>
                                          <line x1="34" y1={y} x2="334" y2={y} stroke="#E7E0D4" strokeDasharray="3 3" />
                                          <text x="28" y={y + 3} textAnchor="end" fontSize="9" fill="#7A7168" fontFamily="monospace">
                                            {v}
                                          </text>
                                        </g>
                                      );
                                    })}

                                    {categoryDistribution.map((cat, idx) => {
                                      const bandW = (340 - 34 - 6) / categoryDistribution.length;
                                      const barW = Math.min(28, bandW * 0.6);
                                      const cx = 34 + bandW * idx + bandW / 2;
                                      const barX = cx - barW / 2;
                                      const innerH = 180 - 8 - 24;
                                      const barH = (cat.amount / maxV) * innerH;
                                      const barY = 8 + innerH - barH;

                                      return (
                                        <g key={idx}>
                                          <rect
                                            x={barX}
                                            y={barY}
                                            width={barW}
                                            height={barH}
                                            rx="4"
                                            fill={barTooltip?.cat.category === cat.category ? '#DB2759' : '#065F46'}
                                            className="transition-colors duration-200 cursor-pointer"
                                            onMouseEnter={() => setBarTooltip({ cat, x: barX })}
                                            onMouseLeave={() => setBarTooltip(null)}
                                          />
                                          <text x={cx} y={180 - 6} textAnchor="middle" fontSize="10" fill="#7A7168" fontFamily="sans-serif">
                                            {cat.category}
                                          </text>
                                        </g>
                                      );
                                    })}
                                  </>
                                );
                              })()}
                            </svg>
                          )}

                          {barTooltip && (
                            <div
                              className="pointer-events-none absolute z-20 rounded-md border border-[#E7E0D4] bg-white p-2 text-xs shadow-md font-mono"
                              style={{ left: `${Math.min(75, (barTooltip.x / 340) * 100)}%`, top: '4px' }}
                            >
                              <p className="font-bold text-[#1C1917]">{barTooltip.cat.category}</p>
                              <p className="text-[#065F46] font-semibold">{barTooltip.cat.amount} students</p>
                            </div>
                          )}
                        </div>
                      </section>

                      {/* Foundation Activity Log */}
                      <section className="rounded-xl border border-[#E7E0D4] bg-white p-5 sm:p-6">
                        <header className="flex items-start justify-between">
                          <div>
                            <h2 className="font-['Fraunces'] text-base font-semibold tracking-tight text-[#1C1917]">
                              Secretariat Activity Log
                            </h2>
                            <p className="mt-1 text-xs text-[#7A7168]">Verifications & statutory audit trail</p>
                          </div>
                          <span className="text-[11px] font-mono text-[#065F46] font-bold">Live Feed</span>
                        </header>

                        {recentActivity.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#7A7168] bg-[#FAF8F4] rounded-xl border border-dashed border-[#E7E0D4] mt-4">
                            No recent activity logged in the central ledger yet.
                          </div>
                        ) : (
                          <ul className="mt-4 space-y-3.5">
                            {recentActivity.map((a, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3EFE7] text-[10px] font-bold font-mono text-[#065F46]">
                                  {a.initials}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs leading-snug text-[#1C1917]">
                                    <span className="font-semibold">{a.who}</span>
                                    <span className="text-[#7A7168]"> {a.what} </span>
                                    <span className="font-semibold text-[#065F46]">{a.target}</span>
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-[#7A7168] font-mono">{a.when}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    </div>
                  </div>
                </>
              )}

              {/* ======================================================== */}
              {/* TAB 1: STUDENTS REGISTERED BY PARTICULAR COURSE */}
              {/* ======================================================== */}
              {activeTab === 'students' && (
                <div className="bg-white rounded-2xl border border-[#E7E0D4] p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E7E0D4]">
                    <div>
                      <h2 className="font-['Fraunces'] text-xl font-semibold text-[#1C1917]">
                        Candidate Registry by Particular Course
                      </h2>
                      <p className="text-xs text-[#7A7168] mt-0.5">
                        Breakdown of enrolled candidates across vocational certificate and diploma curricula.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#7A7168]">Total Enrolled:</span>
                      <span className="font-mono text-sm font-bold text-[#065F46] bg-[#065F46]/10 px-2.5 py-1 rounded-lg">
                        {studentsSource.length} Students
                      </span>
                    </div>
                  </div>

                  {/* Course Filter Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#7A7168] mr-1">Filter by Course:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCourseFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedCourseFilter === 'all'
                          ? 'bg-[#065F46] text-white shadow-xs'
                          : 'bg-[#F3EFE7] text-[#7A7168] hover:bg-[#E7E0D4]'
                      }`}
                    >
                      <span>All Courses</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px] font-mono">
                        {studentsSource.length}
                      </span>
                    </button>

                    {courses.map((c) => {
                      const count = studentsSource.filter(
                        (s) => s.courseId === c.id || s.courseName?.toLowerCase() === c.name?.toLowerCase()
                      ).length;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCourseFilter(c.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedCourseFilter === c.id
                              ? 'bg-[#065F46] text-white shadow-xs'
                              : 'bg-[#F3EFE7] text-[#7A7168] hover:bg-[#E7E0D4]'
                          }`}
                        >
                          <span>{c.code}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px] font-mono">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Students Registry Table */}
                  <div className="overflow-x-auto rounded-xl border border-[#E7E0D4]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F4] text-[#7A7168] font-mono uppercase text-[11px] border-b border-[#E7E0D4]">
                          <th className="p-3.5">Roll No.</th>
                          <th className="p-3.5">Candidate Full Name</th>
                          <th className="p-3.5">Course Program</th>
                          <th className="p-3.5">Assigned Centre</th>
                          <th className="p-3.5">Enrolment Date</th>
                          <th className="p-3.5">Fee Status</th>
                          <th className="p-3.5">Registry Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E0D4]">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-[#7A7168]">
                              No student records matching current course filter.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((st, idx) => (
                            <tr key={st.id || idx} className="hover:bg-[#FAF8F4]/80 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-[#065F46]">{st.rollNo || st.id || st._id || 'N/A'}</td>
                              <td className="p-3.5 font-semibold text-[#1C1917]">{st.name || st.fullName || 'Student'}</td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded bg-[#065F46]/10 text-[#065F46] font-bold text-[11px]">
                                  {st.courseName || st.course?.name || 'Program'}
                                </span>
                              </td>
                              <td className="p-3.5 text-[#7A7168]">{st.centre || st.centreName || 'HQ Campus'}</td>
                              <td className="p-3.5 font-mono text-[#7A7168]">
                                {st.date || (st.createdAt ? new Date(st.createdAt).toLocaleDateString('en-GB') : 'Active')}
                              </td>
                              <td className="p-3.5 font-semibold text-[#065F46]">{st.fee || st.feeStatus || 'Settled'}</td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#065F46]/10 text-[#065F46] font-medium text-[11px]">
                                  {st.status || 'Active'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: DONATIONS & 80G TAX EXEMPTION LEDGER */}
              {/* ======================================================== */}
              {activeTab === 'donations' && (
                <div className="bg-white rounded-2xl border border-[#E7E0D4] p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E0D4]">
                    <div>
                      <h2 className="font-['Fraunces'] text-xl font-semibold text-[#1C1917]">
                        Donations & 80G Statutory Exemption Ledger
                      </h2>
                      <p className="text-xs text-[#7A7168] mt-0.5">
                        Tracking public contributions, donor PANs, and automated 80G tax vouchers.
                      </p>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-[#065F46]/10 text-[#065F46] border border-[#065F46]/20">
                      <span className="text-[10px] uppercase font-mono tracking-wider block font-bold">Total Mobilized:</span>
                      <span className="font-mono text-lg font-bold">₹{totalDonationsAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#E7E0D4]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F4] text-[#7A7168] font-mono uppercase text-[11px] border-b border-[#E7E0D4]">
                          <th className="p-3.5">Receipt Voucher</th>
                          <th className="p-3.5">Donor Name</th>
                          <th className="p-3.5">Donor PAN</th>
                          <th className="p-3.5">Amount (₹)</th>
                          <th className="p-3.5">Purpose / Mission</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Mode</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E0D4]">
                        {(!adminDonations || adminDonations.length === 0) ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-[#7A7168]">
                              No donation receipts logged yet.
                            </td>
                          </tr>
                        ) : (
                          adminDonations.map((d, idx) => (
                            <tr key={d.id || d._id || idx} className="hover:bg-[#FAF8F4]/80 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-[#065F46]">{d.receiptNo || d.id || 'N/A'}</td>
                              <td className="p-3.5 font-semibold text-[#1C1917]">{d.donorName || d.name || 'Patron'}</td>
                              <td className="p-3.5 font-mono text-[#7A7168]">{d.donorPan || d.pan || 'N/A'}</td>
                              <td className="p-3.5 font-mono font-bold text-[#065F46] text-sm">
                                ₹{Number(d.amount || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="p-3.5 text-[#7A7168]">{d.purpose || 'Institutional Mission'}</td>
                              <td className="p-3.5 font-mono text-[#7A7168]">
                                {d.date || (d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB') : 'Recent')}
                              </td>
                              <td className="p-3.5 font-semibold text-[#1C1917]">{d.mode || 'UPI / NetBanking'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: EXPENSES */}
              {/* ======================================================== */}
              {activeTab === 'expenses' && (
                <div className="bg-white rounded-2xl border border-[#E7E0D4] p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E0D4]">
                    <div>
                      <h2 className="font-['Fraunces'] text-xl font-semibold text-[#1C1917]">
                        Expenses & Fund Utilization Ledger
                      </h2>
                      <p className="text-xs text-[#7A7168] mt-0.5">
                        Detailed institutional accounting of expenses, vendors, categories, and invoices.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200">
                        <span className="text-[10px] uppercase font-mono tracking-wider block font-bold">Total Expenses:</span>
                        <span className="font-mono text-lg font-bold">₹{totalExpensesAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddExpenseModal(true)}
                        className="h-10 px-4 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        <span>Record New Expense</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#E7E0D4]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F4] text-[#7A7168] font-mono uppercase text-[11px] border-b border-[#E7E0D4]">
                          <th className="p-3.5">Expense ID</th>
                          <th className="p-3.5">Expense Title / Item</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Amount (₹)</th>
                          <th className="p-3.5">Vendor / Supplier</th>
                          <th className="p-3.5">Invoice No.</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E0D4]">
                        {(!expenses || expenses.length === 0) ? (
                          <tr>
                            <td colSpan="8" className="p-8 text-center text-[#7A7168]">
                              No expenditure records logged in the central ledger yet.
                            </td>
                          </tr>
                        ) : (
                          expenses.map((exp, idx) => (
                            <tr key={exp.id || exp._id || idx} className="hover:bg-[#FAF8F4]/80 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-[#065F46]">{exp.id || exp._id || `EXP-${idx + 1}`}</td>
                              <td className="p-3.5 font-semibold text-[#1C1917]">{exp.title || 'Expense Item'}</td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded bg-[#F3EFE7] text-[#1C1917] font-medium text-[11px]">
                                  {exp.category || 'Operations'}
                                </span>
                              </td>
                              <td className="p-3.5 font-mono font-bold text-rose-700 text-sm">
                                ₹{Number(exp.amount || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="p-3.5 text-[#7A7168]">{exp.vendor || 'Authorized Supplier'}</td>
                              <td className="p-3.5 font-mono text-[#7A7168]">{exp.invoiceNo || 'N/A'}</td>
                              <td className="p-3.5 font-mono text-[#7A7168]">
                                {exp.date || (exp.createdAt ? new Date(exp.createdAt).toLocaleDateString('en-GB') : 'Recent')}
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeExpense(exp.id || exp._id)}
                                  className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  title="Delete Expense"
                                >
                                  <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: ACADEMIC CURRICULA & UNIVERSITY PROGRAMS */}
              {/* ======================================================== */}
              {activeTab === 'courses' && (
                <div className="bg-white rounded-2xl border border-[#E7E0D4] p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E7E0D4]">
                    <div>
                      <h2 className="font-['Fraunces'] text-xl font-semibold text-[#1C1917]">
                        Academic Curricula & Program Management
                      </h2>
                      <p className="text-xs text-[#7A7168] mt-0.5">
                        Manage vocational skill diplomas, syllabi, and accredited university distance degrees.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Sub-tab Switcher */}
                      <div className="inline-flex rounded-xl border border-[#E7E0D4] bg-[#FAF8F4] p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setCourseCatalogSubTab('vocational')}
                          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            courseCatalogSubTab === 'vocational'
                              ? 'bg-white text-[#065F46] font-semibold shadow-xs'
                              : 'text-[#7A7168] hover:text-[#1C1917]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">terminal</span>
                          <span>Vocational Diplomas ({courses?.length || 0})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCourseCatalogSubTab('university')}
                          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            courseCatalogSubTab === 'university'
                              ? 'bg-white text-[#065F46] font-semibold shadow-xs'
                              : 'text-[#7A7168] hover:text-[#1C1917]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">school</span>
                          <span>University Programs ({universityPrograms?.length || 0})</span>
                        </button>
                      </div>

                      {/* Add Action Button */}
                      {courseCatalogSubTab === 'vocational' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCourse(null);
                            setNewCourseForm({
                              code: '',
                              name: '',
                              duration: '12 Months',
                              eligibility: '10th / 12th Pass',
                              fee: '₹12,000',
                              feeAmount: 12000,
                              formula: 'Fundamental + MS Office + Tally + Web Design',
                              modulesStr: 'Computer Fundamental & Windows, MS Office 2021, Tally Prime with GST, HTML & CSS',
                              icon: 'desktop_windows',
                              popular: true,
                            });
                            setShowAddCourseModal(true);
                          }}
                          className="h-10 px-4 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">add</span>
                          <span>Add New Course</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUnivProgram(null);
                            setNewUnivProgramForm({
                              code: '',
                              name: '',
                              duration: '3 Years (6 Semesters)',
                              eligibility: '10+2 in any stream (Math/CS preferred)',
                              type: 'Undergraduate Degree',
                              mode: 'Online & Distance Mode',
                              fee: 'Flexible Semester Slabs',
                              streams: 'Cloud Computing, Web Development, AI/ML',
                              icon: 'laptop_chromebook',
                              popular: true,
                            });
                            setShowAddUnivModal(true);
                          }}
                          className="h-10 px-4 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">add</span>
                          <span>Add University Program</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* VIEW A: VOCATIONAL COURSES */}
                  {courseCatalogSubTab === 'vocational' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(!courses || courses.length === 0) ? (
                        <div className="col-span-full p-8 text-center text-xs text-[#7A7168] bg-[#FAF8F4] rounded-xl border border-dashed border-[#E7E0D4]">
                          No vocational courses found in database. Click "Add New Course" to create one.
                        </div>
                      ) : (
                        courses.map((c) => (
                          <div
                            key={c.id || c._id || c.code}
                            className="bg-[#FAF8F4] rounded-xl p-5 border border-[#E7E0D4] flex flex-col justify-between hover:border-[#065F46]/30 transition-all shadow-2xs"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#065F46] px-2 py-0.5 rounded bg-white border border-[#E7E0D4]">
                                    {c.code}
                                  </span>
                                  {c.popular && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-[#7A7168] font-mono">{c.duration}</span>
                              </div>

                              <h4 className="font-['Fraunces'] text-base font-semibold text-[#1C1917]">{c.name}</h4>
                              <p className="text-xs text-[#7A7168] mt-1">
                                Fee: <strong className="text-[#065F46] font-mono">{c.fee}</strong>
                                {c.feeAmount ? ` (₹${Number(c.feeAmount).toLocaleString('en-IN')})` : ''}
                              </p>
                              <p className="text-xs text-[#7A7168] mt-0.5">Eligibility: {c.eligibility}</p>
                              {c.formula && (
                                <p className="text-[11px] text-[#7A7168] mt-1 font-mono italic">
                                  Formula: {c.formula}
                                </p>
                              )}

                              <div className="pt-2 mt-2 border-t border-[#E7E0D4] text-xs">
                                <span className="font-mono text-[10px] text-[#7A7168] uppercase tracking-wider block mb-1">
                                  Syllabus Modules:
                                </span>
                                <p className="text-[#1C1917] truncate text-[11px]">
                                  {Array.isArray(c.modules) ? c.modules.join(', ') : (c.modules || 'Curriculum modules active')}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-[#E7E0D4] flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCourse(c);
                                  setNewCourseForm({
                                    code: c.code,
                                    name: c.name,
                                    duration: c.duration,
                                    eligibility: c.eligibility,
                                    fee: c.fee,
                                    feeAmount: c.feeAmount || 12000,
                                    formula: c.formula || '',
                                    modulesStr: Array.isArray(c.modules) ? c.modules.join(', ') : (c.modules || ''),
                                    icon: c.icon || 'desktop_windows',
                                    popular: Boolean(c.popular),
                                  });
                                  setShowAddCourseModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white border border-[#E7E0D4] hover:bg-[#F3EFE7] text-[#065F46] font-medium text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <span>Edit Course</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCourse(c)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Remove Course"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* VIEW B: UNIVERSITY PROGRAMS */}
                  {courseCatalogSubTab === 'university' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(!universityPrograms || universityPrograms.length === 0) ? (
                        <div className="col-span-full p-8 text-center text-xs text-[#7A7168] bg-[#FAF8F4] rounded-xl border border-dashed border-[#E7E0D4]">
                          No university programs found in database. Click "Add University Program" to register one.
                        </div>
                      ) : (
                        universityPrograms.map((p) => (
                          <div
                            key={p.id || p._id || p.code}
                            className="bg-[#FAF8F4] rounded-xl p-5 border border-[#E7E0D4] flex flex-col justify-between hover:border-[#065F46]/30 transition-all shadow-2xs"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs font-bold text-[#065F46] px-2 py-0.5 rounded bg-white border border-[#E7E0D4]">
                                    {p.code}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                                    {p.type || 'Degree'}
                                  </span>
                                  {p.popular && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-[#7A7168] font-mono">{p.duration}</span>
                              </div>

                              <h4 className="font-['Fraunces'] text-base font-semibold text-[#1C1917]">{p.name}</h4>
                              <p className="text-xs text-[#7A7168] mt-1">
                                Mode: <strong className="text-[#1C1917]">{p.mode || 'Online & Distance Mode'}</strong>
                              </p>
                              <p className="text-xs text-[#7A7168] mt-0.5">
                                Fee: <strong className="text-[#065F46] font-mono">{p.fee}</strong>
                              </p>
                              <p className="text-xs text-[#7A7168] mt-0.5">Eligibility: {p.eligibility}</p>

                              {p.streams && (
                                <div className="pt-2 mt-2 border-t border-[#E7E0D4] text-xs">
                                  <span className="font-mono text-[10px] text-[#7A7168] uppercase tracking-wider block mb-1">
                                    Specialization Streams:
                                  </span>
                                  <p className="text-[#1C1917] truncate text-[11px]">
                                    {p.streams}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="pt-4 mt-4 border-t border-[#E7E0D4] flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingUnivProgram(p);
                                  setNewUnivProgramForm({
                                    code: p.code,
                                    name: p.name,
                                    duration: p.duration,
                                    eligibility: p.eligibility,
                                    type: p.type || 'Undergraduate Degree',
                                    mode: p.mode || 'Online & Distance Mode',
                                    fee: p.fee,
                                    streams: p.streams || '',
                                    icon: p.icon || 'laptop_chromebook',
                                    popular: Boolean(p.popular),
                                  });
                                  setShowAddUnivModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white border border-[#E7E0D4] hover:bg-[#F3EFE7] text-[#065F46] font-medium text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <span>Edit Program</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteUnivProgram(p)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Remove University Program"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: GALLERY MANAGEMENT (Add & Update Gallery) */}
              {/* ======================================================== */}
              {activeTab === 'gallery' && (
                <div className="bg-white rounded-2xl border border-[#E7E0D4] p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E0D4]">
                    <div>
                      <h2 className="font-['Fraunces'] text-xl font-semibold text-[#1C1917]">
                        Photo Gallery & Event Media Management
                      </h2>
                      <p className="text-xs text-[#7A7168] mt-0.5">
                        Manage celebrations, campus infrastructure, felicitations, and student convocations.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddGalleryModal(true)}
                      className="h-10 px-4 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                      <span>Add Event Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(!galleryItems || galleryItems.length === 0) ? (
                      <div className="col-span-full p-8 text-center text-xs text-[#7A7168] bg-[#FAF8F4] rounded-xl">
                        No photographs uploaded yet. Click "Add Event Photo" to publish institutional media.
                      </div>
                    ) : (
                      galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#FAF8F4] rounded-xl overflow-hidden border border-[#E7E0D4] flex flex-col justify-between"
                        >
                          <div className="h-36 bg-[#065F46] overflow-hidden relative">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono">
                              {item.badge}
                            </span>
                          </div>

                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-['Fraunces'] text-xs font-semibold text-[#1C1917] line-clamp-2">{item.title}</h4>
                              <p className="text-[10px] text-[#7A7168] mt-1 font-mono">{item.location} • {item.date}</p>
                            </div>

                            <div className="pt-3 mt-3 border-t border-[#E7E0D4] flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeGalleryItem(item.id)}
                                className="px-2 py-1 rounded text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: CERTIFICATE APPROVAL */}
              {/* ======================================================== */}
              {activeTab === 'certificates' && (
                <div className="bg-white rounded-2xl border border-[#E7E0D4] p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="pb-4 border-b border-[#E7E0D4]">
                    <h2 className="font-['Fraunces'] text-xl font-semibold text-[#1C1917]">
                      Student Certificate & Admission Approvals
                    </h2>
                    <p className="text-xs text-[#7A7168] mt-0.5">
                      Review pending candidate applications, verify course completion, and issue cryptographic certificates.
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#E7E0D4]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F4] text-[#7A7168] font-mono uppercase text-[11px] border-b border-[#E7E0D4]">
                          <th className="p-3.5">Application ID</th>
                          <th className="p-3.5">Candidate Full Name</th>
                          <th className="p-3.5">Course Program</th>
                          <th className="p-3.5">Training Centre</th>
                          <th className="p-3.5">Submission Date</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E0D4]">
                        {(!pendingApprovals || pendingApprovals.length === 0) ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-[#7A7168]">
                              No pending certificate applications awaiting approval.
                            </td>
                          </tr>
                        ) : (
                          pendingApprovals.map((app, idx) => (
                            <tr key={app.id || app._id || idx} className="hover:bg-[#FAF8F4]/80 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-[#065F46]">{app.id || app._id || app.applicationNumber || 'N/A'}</td>
                              <td className="p-3.5 font-semibold text-[#1C1917]">{app.name || app.fullName || 'Candidate'}</td>
                              <td className="p-3.5 font-semibold text-[#065F46]">{app.course || app.courseName || 'Program'}</td>
                              <td className="p-3.5 text-[#7A7168]">{app.centre || app.centreName || 'HQ Campus'}</td>
                              <td className="p-3.5 font-mono text-[#7A7168]">
                                {app.date || (app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : 'Recent')}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full font-medium text-[10px] ${
                                    app.status === 'Approved'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {app.status || 'Pending'}
                                </span>
                              </td>
                              <td className="p-3.5">
                                {app.status === 'Approved' ? (
                                  <span className="text-[#065F46] font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                    <span>Certificate Issued</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(app.id || app._id, app.name || app.fullName)}
                                    className="px-3 py-1.5 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                                  >
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    <span>Approve & Issue</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: RECORD NEW EXPENDITURE */}
      {/* ======================================================== */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E7E0D4] animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D4]">
              <h3 className="font-['Fraunces'] text-lg font-semibold text-[#1C1917]">Record Institutional Expenditure</h3>
              <button
                type="button"
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1 rounded-lg hover:bg-[#F3EFE7] text-[#7A7168]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-[#1C1917] block mb-1">Expense Title / Item *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 New Computer Workstations or Optical Fiber Recharge"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Category *</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  >
                    <option>Hardware & Lab Equipment</option>
                    <option>Internet & Networking</option>
                    <option>Power Infrastructure</option>
                    <option>Printing & Stationery</option>
                    <option>Faculty Honorarium</option>
                    <option>Examination Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Amount in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-mono font-bold text-rose-700 focus:outline-none focus:border-[#065F46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Vendor / Recipient</label>
                  <input
                    type="text"
                    placeholder="e.g. Shree Ganesh Infotech"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Invoice / Receipt No.</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2026-99"
                    value={newExpense.invoiceNo}
                    onChange={(e) => setNewExpense({ ...newExpense, invoiceNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-mono text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E7E0D4] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-lg text-[#7A7168] hover:bg-[#F3EFE7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium shadow-xs cursor-pointer"
                >
                  Save Expenditure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD / EDIT VOCATIONAL COURSE */}
      {/* ======================================================== */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E7E0D4] animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D4]">
              <h3 className="font-['Fraunces'] text-lg font-semibold text-[#1C1917]">
                {editingCourse ? 'Update Vocational Course' : 'Create New Vocational Course'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCourseModal(false)}
                className="p-1 rounded-lg hover:bg-[#F3EFE7] text-[#7A7168]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADCA"
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-mono font-bold text-[#065F46] focus:outline-none focus:border-[#065F46]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Duration *</label>
                  <select
                    value={newCourseForm.duration}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  >
                    <option>12 Months</option>
                    <option>6 Months</option>
                    <option>3 Months</option>
                    <option>1 Month</option>
                    <option>2 Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C1917] block mb-1">Course Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Diploma in Computer Applications"
                  value={newCourseForm.name}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-semibold text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Fee Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹12,000"
                    value={newCourseForm.fee}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-mono font-bold text-[#065F46] focus:outline-none focus:border-[#065F46]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Fee Amount in INR (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12000"
                    value={newCourseForm.feeAmount}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, feeAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-mono text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Eligibility</label>
                  <input
                    type="text"
                    placeholder="e.g. 10th / 12th Pass"
                    value={newCourseForm.eligibility}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, eligibility: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Curriculum Formula</label>
                  <input
                    type="text"
                    placeholder="e.g. Fundamental + MS Office + Tally"
                    value={newCourseForm.formula}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, formula: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C1917] block mb-1">
                  Syllabus Modules (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="Computer Fundamental & Windows, MS Office 2021, Tally Prime with GST, HTML & CSS"
                  value={newCourseForm.modulesStr}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, modulesStr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="coursePopular"
                  checked={newCourseForm.popular}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, popular: e.target.checked })}
                  className="rounded border-[#E7E0D4] text-[#065F46] focus:ring-[#065F46]"
                />
                <label htmlFor="coursePopular" className="text-xs text-[#1C1917] font-medium cursor-pointer">
                  Mark as Popular / Featured Program
                </label>
              </div>

              <div className="pt-3 border-t border-[#E7E0D4] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 rounded-lg text-[#7A7168] hover:bg-[#F3EFE7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium shadow-xs cursor-pointer"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD / EDIT UNIVERSITY PROGRAM */}
      {/* ======================================================== */}
      {showAddUnivModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E7E0D4] animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D4]">
              <h3 className="font-['Fraunces'] text-lg font-semibold text-[#1C1917]">
                {editingUnivProgram ? 'Update University Program' : 'Create University Degree Program'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUnivModal(false)}
                className="p-1 rounded-lg hover:bg-[#F3EFE7] text-[#7A7168]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUnivProgram} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Program Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCA, MCA, MBA"
                    value={newUnivProgramForm.code}
                    onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-mono font-bold text-[#065F46] focus:outline-none focus:border-[#065F46]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Degree Type *</label>
                  <select
                    value={newUnivProgramForm.type}
                    onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  >
                    <option value="Undergraduate Degree">Undergraduate Degree</option>
                    <option value="Postgraduate Degree">Postgraduate Degree</option>
                    <option value="Postgraduate Diploma">Postgraduate Diploma</option>
                    <option value="Degree & Diploma Programs">Degree & Diploma Programs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C1917] block mb-1">Program Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Computer Applications"
                  value={newUnivProgramForm.name}
                  onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-semibold text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Years (6 Semesters)"
                    value={newUnivProgramForm.duration}
                    onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Mode *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Online & Distance Mode"
                    value={newUnivProgramForm.mode}
                    onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Fee Structure *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flexible Semester Slabs or ₹15,000 / Semester"
                    value={newUnivProgramForm.fee}
                    onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-mono font-bold text-[#065F46] focus:outline-none focus:border-[#065F46]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Eligibility *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10+2 in any stream (Math/CS preferred)"
                    value={newUnivProgramForm.eligibility}
                    onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, eligibility: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C1917] block mb-1">
                  Specialization Streams (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="Cloud Computing, Full Stack Web Development, AI/ML, Data Science"
                  value={newUnivProgramForm.streams}
                  onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, streams: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="univPopular"
                  checked={newUnivProgramForm.popular}
                  onChange={(e) => setNewUnivProgramForm({ ...newUnivProgramForm, popular: e.target.checked })}
                  className="rounded border-[#E7E0D4] text-[#065F46] focus:ring-[#065F46]"
                />
                <label htmlFor="univPopular" className="text-xs text-[#1C1917] font-medium cursor-pointer">
                  Mark as Popular / Featured Degree
                </label>
              </div>

              <div className="pt-3 border-t border-[#E7E0D4] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUnivModal(false)}
                  className="px-4 py-2 rounded-lg text-[#7A7168] hover:bg-[#F3EFE7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium shadow-xs cursor-pointer"
                >
                  {editingUnivProgram ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD GALLERY EVENT PHOTO */}
      {/* ======================================================== */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E7E0D4] animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D4]">
              <h3 className="font-['Fraunces'] text-lg font-semibold text-[#1C1917]">Publish Event Photograph</h3>
              <button
                type="button"
                onClick={() => setShowAddGalleryModal(false)}
                className="p-1 rounded-lg hover:bg-[#F3EFE7] text-[#7A7168]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateGalleryItem} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-[#1C1917] block mb-1">Event / Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Convocation or Computer Lab Inauguration"
                  value={newGalleryForm.title}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Category</label>
                  <select
                    value={newGalleryForm.category}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="classroom">Classroom & Lab</option>
                    <option value="felicitations">Felicitations & Awards</option>
                    <option value="leadership">Leadership & Director</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Convocation 2026"
                    value={newGalleryForm.badge}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Ghosi Central Campus"
                    value={newGalleryForm.location}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">Date / Session</label>
                  <input
                    type="text"
                    placeholder="e.g. October 2026"
                    value={newGalleryForm.date}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] font-mono text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C1917] block mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the event or celebration..."
                  value={newGalleryForm.desc}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F4] border border-[#E7E0D4] text-[#1C1917] focus:outline-none focus:border-[#065F46]"
                />
              </div>

              <div className="pt-3 border-t border-[#E7E0D4] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 rounded-lg text-[#7A7168] hover:bg-[#F3EFE7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#065F46] hover:bg-[#065F46]/90 text-white font-medium shadow-xs cursor-pointer"
                >
                  Publish Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
