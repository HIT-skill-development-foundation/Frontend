import React, { useState } from 'react';
import { useAdmin, useLoader } from '../store/hooks';
import logo2 from '../assets/images/logo2.jpeg';
import { registeredStudentsList } from '../data/mockData';

export default function AdminDashboardPage() {
  const {
    isAdminLoggedIn,
    adminUser,
    expenses,
    adminDonations,
    pendingApprovals,
    adminStats,
    courses,
    galleryItems,
    adminLogin,
    adminLogout,
    recordExpense,
    removeExpense,
    approveCert,
    rejectCert,
    addNewCourse,
    editCourse,
    removeCourse,
    addNewGalleryItem,
    removeGalleryItem,
  } = useAdmin();

  const { withLoader, notify } = useLoader();

  // Active Admin Console Tab
  // 1: 'students', 2: 'donations', 3: 'expenses', 4: 'courses', 5: 'gallery', 6: 'certificates'
  const [activeTab, setActiveTab] = useState('students');

  // Login form state
  const [adminCreds, setAdminCreds] = useState({
    email: 'admin@hitindia.org',
    password: 'password123',
  });

  // Course filter for Tab 1
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');

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

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourseForm, setNewCourseForm] = useState({
    code: '',
    name: '',
    duration: '12 Months',
    eligibility: '12th Pass',
    fee: '₹100 Reg. + ₹600/mo',
    modulesStr: 'Computer Fundamentals, Practical Work',
    icon: 'terminal',
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

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      adminLogin({
        name: 'Er. A. K. Verma (Director Desk)',
        email: adminCreds.email,
        role: 'Super Admin & Trustee',
      });
      notify('success', 'Authenticated as Super Admin. Central Ledger synced.');
    }, 'Authenticating Super Admin Credentials with Institutional Node...');
  };

  const handleDemoAdminLogin = async () => {
    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      adminLogin({
        name: 'Er. A. K. Verma (Director Desk)',
        email: 'admin@hitindia.org',
        role: 'Super Admin & Central Trustee',
      });
      notify('success', 'Logged in as Super Admin (Director Desk)');
    }, 'Accessing Central Super Admin Console...');
  };

  // Add Expense Handler
  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const expItem = {
        id: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: newExpense.title,
        category: newExpense.category,
        amount: Number(newExpense.amount),
        date: newExpense.date,
        vendor: newExpense.vendor || 'Authorized Supplier',
        invoiceNo: newExpense.invoiceNo || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Verified & Settled',
        approvedBy: 'Super Admin / Director',
      };
      recordExpense(expItem);
      setShowAddExpenseModal(false);
      setNewExpense({
        title: '',
        category: 'Hardware & Lab Equipment',
        amount: '',
        vendor: '',
        date: new Date().toLocaleDateString('en-GB'),
        invoiceNo: '',
      });
      notify('success', `Expenditure of ₹${expItem.amount.toLocaleString('en-IN')} recorded successfully.`);
    }, 'Recording Institutional Expenditure into Expenditure Ledger...');
  };

  // Add / Edit Course Handler
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!newCourseForm.name || !newCourseForm.code) return;

    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const modulesArr = newCourseForm.modulesStr.split(',').map((m) => m.trim()).filter(Boolean);

      if (editingCourse) {
        editCourse({
          ...editingCourse,
          code: newCourseForm.code,
          name: newCourseForm.name,
          duration: newCourseForm.duration,
          eligibility: newCourseForm.eligibility,
          fee: newCourseForm.fee,
          modules: modulesArr,
        });
        notify('success', `Course ${newCourseForm.code} updated successfully.`);
      } else {
        const newC = {
          id: newCourseForm.code.toLowerCase().replace(/[^a-z0-9]/g, ''),
          code: newCourseForm.code,
          name: newCourseForm.name,
          duration: newCourseForm.duration,
          eligibility: newCourseForm.eligibility,
          fee: newCourseForm.fee,
          modules: modulesArr,
          icon: newCourseForm.icon || 'school',
          popular: false,
        };
        addNewCourse(newC);
        notify('success', `New course ${newCourseForm.name} added to curriculum.`);
      }

      setShowAddCourseModal(false);
      setEditingCourse(null);
    }, 'Updating Academic Curriculum Ledger...');
  };

  // Add Gallery Photo Handler
  const handleCreateGalleryItem = async (e) => {
    e.preventDefault();
    if (!newGalleryForm.title) return;

    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const item = {
        id: Date.now(),
        title: newGalleryForm.title,
        category: newGalleryForm.category,
        location: newGalleryForm.location,
        date: newGalleryForm.date,
        badge: newGalleryForm.badge || 'Campus Event',
        desc: newGalleryForm.desc || 'Institutional event and vocational training milestone photograph.',
        img: logo2, // uses brand logo as default fallback asset
      };
      addNewGalleryItem(item);
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
    }, 'Updating Institutional Media Repository...');
  };

  // Approve Certificate Handler
  const handleApprove = async (id, studentName) => {
    await withLoader(async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      approveCert(id);
      notify('success', `Certificate approved for ${studentName || id}. Permanent verification QR active.`);
    }, `Validating Dossier & Issuing Government-Recognized Certificate for ${studentName || id}...`);
  };

  // ==========================================
  // VIEW 1: UNAUTHENTICATED ADMIN LOGIN GATE
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="flex flex-col w-full pb-space-xl">
        <div className="w-full bg-primary text-on-primary py-space-sm px-margin-sm lg:px-margin-lg shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-label-sm font-label-sm">
            <div className="flex items-center gap-space-xs">
              <span className="text-secondary-fixed font-bold">HIT Super Admin Portal</span>
              <span className="text-on-primary/40">/</span>
              <span className="text-on-primary/70">Restricted Institutional Access</span>
            </div>
            <span className="text-rose-400 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-sm">shield</span>
              Authorized Trustees & Administrators Only
            </span>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full px-4 pt-16">
          <div className="bg-surface-container-lowest rounded-3xl p-8 sm:p-10 shadow-2xl border border-outline-variant/30 text-center">
            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-secondary/40">
              <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
            </div>
            <h2 className="font-headline text-2xl font-bold text-primary">Super Admin Login</h2>
            <p className="text-xs text-on-surface-variant mt-1 mb-6">
              Enter administrative credentials to manage students, donations, expenses, courses & certificates.
            </p>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1">
                  Administrator Email / Username
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                    person
                  </span>
                  <input
                    type="email"
                    required
                    value={adminCreds.email}
                    onChange={(e) => setAdminCreds({ ...adminCreds, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1">Security PIN / Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                    lock
                  </span>
                  <input
                    type="password"
                    required
                    value={adminCreds.password}
                    onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm font-semibold text-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Enter Admin Console</span>
              </button>

              <div className="pt-4 border-t border-outline-variant/20 text-center">
                <span className="text-[11px] text-on-surface-variant block mb-2">Evaluation or Demo Login?</span>
                <button
                  type="button"
                  onClick={handleDemoAdminLogin}
                  className="w-full py-2.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-xs transition-colors cursor-pointer border border-secondary/30 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">bolt</span>
                  <span>1-Click Demo Super Admin Login</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED SUPER ADMIN CONSOLE
  // ==========================================
  // Calculate Totals
  const totalDonationsAmount = (adminDonations || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalExpensesAmount = (expenses || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalStudentsCount = registeredStudentsList.length;

  // Filter students
  const filteredStudents = registeredStudentsList.filter((s) => {
    const matchesCourse = selectedCourseFilter === 'all' || s.courseId === selectedCourseFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.centre.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Admin Security Ribbon */}
      <div className="w-full bg-primary text-on-primary py-space-sm px-margin-sm lg:px-margin-lg shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              SUPER ADMIN CONSOLE
            </span>
            <span className="text-on-primary/40 hidden sm:inline">|</span>
            <span className="text-secondary-fixed text-xs hidden sm:inline">
              Central Node: 275105-MAU-HQ (Live)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-container-high hidden md:inline">
              Logged in: <strong>{adminUser?.name || 'Er. A. K. Verma'}</strong>
            </span>
            <button
              onClick={adminLogout}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-margin-sm lg:px-margin-lg pt-6 space-y-6">
        {/* KPI Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-medium block">Total Registered Students</span>
              <span className="font-headline text-2xl font-extrabold text-primary">{totalStudentsCount}</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-medium block">Total Donations (80G)</span>
              <span className="font-headline text-2xl font-extrabold text-emerald-700">
                ₹{totalDonationsAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-medium block">Total Expenses (Khrch)</span>
              <span className="font-headline text-2xl font-extrabold text-rose-700">
                ₹{totalExpensesAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-medium block">Active Diploma Courses</span>
              <span className="font-headline text-2xl font-extrabold text-primary">{courses.length}</span>
            </div>
          </div>
        </div>

        {/* 6 MAIN COMMAND TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/30">
          {[
            { id: 'students', label: '1. Students by Course', icon: 'groups' },
            { id: 'donations', label: '2. Donations Received', icon: 'volunteer_activism' },
            { id: 'expenses', label: '3. Expenses & Khrch', icon: 'receipt_long' },
            { id: 'courses', label: '4. Course Management', icon: 'school' },
            { id: 'gallery', label: '5. Gallery Management', icon: 'photo_library' },
            { id: 'certificates', label: '6. Certificate Approval', icon: 'verified' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ========================================== */}
        {/* TAB 1: STUDENTS REGISTERED BY PARTICULAR COURSE */}
        {/* ========================================== */}
        {activeTab === 'students' && (
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">
                  Student Registration Ledger by Particular Course
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  View and manage registered students broken down by specific course programs.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by name, roll, centre..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                />
              </div>
            </div>

            {/* Course Breakdown Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-on-surface-variant mr-1">Filter by Course:</span>
              <button
                onClick={() => setSelectedCourseFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCourseFilter === 'all'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span>All Courses</span>
                <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px] font-mono">
                  {registeredStudentsList.length}
                </span>
              </button>
              {courses.map((c) => {
                const count = registeredStudentsList.filter((s) => s.courseId === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourseFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedCourseFilter === c.id
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{c.code}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px] font-mono">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold">
                    <th className="p-3 rounded-l-xl">Permanent Roll No.</th>
                    <th className="p-3">Student Full Name</th>
                    <th className="p-3">Registered Course</th>
                    <th className="p-3">Assigned Training Centre</th>
                    <th className="p-3">Reg. Date</th>
                    <th className="p-3">Processing Fee</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-surface-container-low/50">
                      <td className="p-3 font-mono font-bold text-primary">{st.id}</td>
                      <td className="p-3 font-semibold text-on-surface">{st.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-bold text-[11px]">
                          {st.courseName}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface-variant">{st.centre}</td>
                      <td className="p-3 text-on-surface-variant">{st.date}</td>
                      <td className="p-3 font-bold text-emerald-700">{st.feeStatus}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: DONATIONS RECEIVED (80G LEDGER) */}
        {/* ========================================== */}
        {activeTab === 'donations' && (
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Donations & 80G Tax Exemption Ledger</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Statutory tracking of all public contributions, donor PANs, and issued 80G tax vouchers.
                </p>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="text-[10px] uppercase tracking-wider block font-bold">Total Funds Received:</span>
                <span className="font-headline text-lg font-extrabold">₹{totalDonationsAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold">
                    <th className="p-3 rounded-l-xl">Receipt No.</th>
                    <th className="p-3">Donor Name</th>
                    <th className="p-3">Donor PAN</th>
                    <th className="p-3">Amount (₹)</th>
                    <th className="p-3">Purpose / Allocation</th>
                    <th className="p-3">Settlement Date</th>
                    <th className="p-3 rounded-r-xl">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {adminDonations.map((d, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low/50">
                      <td className="p-3 font-mono font-bold text-primary">{d.receiptNo}</td>
                      <td className="p-3 font-semibold text-on-surface">{d.donorName}</td>
                      <td className="p-3 font-mono text-on-surface-variant">{d.donorPan}</td>
                      <td className="p-3 font-extrabold text-emerald-700 text-sm">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-on-surface-variant">{d.purpose}</td>
                      <td className="p-3 text-on-surface-variant">{d.date}</td>
                      <td className="p-3 text-[11px] font-semibold text-secondary">{d.mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: EXPENSES & KHRCH ("Kitna khrch hua aur kha") */}
        {/* ========================================== */}
        {activeTab === 'expenses' && (
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">
                  Institutional Expenditure & Fund Utilization Ledger
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Detailed breakdown of where funds were spent (kitna khrch hua aur kha).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200">
                  <span className="text-[10px] uppercase tracking-wider block font-bold">Total Spent:</span>
                  <span className="font-headline text-lg font-extrabold">₹{totalExpensesAmount.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Record New Expense</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold">
                    <th className="p-3 rounded-l-xl">Expense ID</th>
                    <th className="p-3">Item / Expenditure Title (Kha Khrch Hua)</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount (₹)</th>
                    <th className="p-3">Vendor / Recipient</th>
                    <th className="p-3">Invoice No.</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-surface-container-low/50">
                      <td className="p-3 font-mono font-bold text-primary">{exp.id}</td>
                      <td className="p-3 font-semibold text-on-surface">{exp.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-bold text-[10px]">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-3 font-extrabold text-rose-700 text-sm">
                        ₹{Number(exp.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-on-surface-variant">{exp.vendor}</td>
                      <td className="p-3 font-mono text-outline">{exp.invoiceNo}</td>
                      <td className="p-3 text-on-surface-variant">{exp.date}</td>
                      <td className="p-3">
                        <button
                          onClick={() => removeExpense(exp.id)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete Expense"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: COURSE MANAGEMENT (ADD & UPDATE COURSES) */}
        {/* ========================================== */}
        {activeTab === 'courses' && (
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Academic Curriculum Management</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Update existing courses, fees, durations, or add brand new vocational programs anytime.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCourse(null);
                  setNewCourseForm({
                    code: '',
                    name: '',
                    duration: '12 Months',
                    eligibility: '12th Pass',
                    fee: '₹100 Reg. + ₹600/mo',
                    modulesStr: 'Computer Fundamentals, Practical Lab',
                    icon: 'school',
                  });
                  setShowAddCourseModal(true);
                }}
                className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-secondary px-2 py-0.5 rounded bg-surface-container-highest">
                        {c.code}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">{c.duration}</span>
                    </div>

                    <h4 className="font-headline text-base font-bold text-primary">{c.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Fee: <strong className="text-primary">{c.fee}</strong>
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Eligibility: {c.eligibility}</p>

                    <div className="pt-2 mt-2 border-t border-outline-variant/20 text-xs">
                      <span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">
                        Modules:
                      </span>
                      <p className="text-on-surface truncate">
                        {c.modules ? c.modules.join(', ') : 'Curriculum modules active'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingCourse(c);
                        setNewCourseForm({
                          code: c.code,
                          name: c.name,
                          duration: c.duration,
                          eligibility: c.eligibility,
                          fee: c.fee,
                          modulesStr: c.modules ? c.modules.join(', ') : '',
                          icon: c.icon || 'school',
                        });
                        setShowAddCourseModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Edit Course</span>
                    </button>

                    <button
                      onClick={() => removeCourse(c.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remove Course"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: GALLERY MANAGEMENT (ADD & UPDATE GALLERY) */}
        {/* ========================================== */}
        {activeTab === 'gallery' && (
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Photo Gallery & Media Management</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Update event photographs, student celebrations, felicitations, and institutional media.
                </p>
              </div>

              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                <span>Add Event Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col justify-between"
                >
                  <div className="h-36 bg-primary overflow-hidden relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-headline text-xs font-bold text-primary line-clamp-2">{item.title}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-1">{item.location} • {item.date}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-outline-variant/20 flex justify-end">
                      <button
                        onClick={() => removeGalleryItem(item.id)}
                        className="px-2 py-1 rounded text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: CERTIFICATE APPROVAL */}
        {/* ========================================== */}
        {activeTab === 'certificates' && (
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div className="pb-4 border-b border-outline-variant/20">
              <h3 className="font-headline text-xl font-bold text-primary">
                Student Certificate & Admission Approvals
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Review pending candidate applications, verify course completion, and issue cryptographic certificates.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold">
                    <th className="p-3 rounded-l-xl">Application ID</th>
                    <th className="p-3">Candidate Full Name</th>
                    <th className="p-3">Course Enrolled</th>
                    <th className="p-3">Training Centre</th>
                    <th className="p-3">Submission Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {pendingApprovals.map((app) => (
                    <tr key={app.id} className="hover:bg-surface-container-low/50">
                      <td className="p-3 font-mono font-bold text-primary">{app.id}</td>
                      <td className="p-3 font-semibold text-on-surface">{app.name}</td>
                      <td className="p-3 text-secondary font-semibold">{app.course}</td>
                      <td className="p-3 text-on-surface-variant">{app.centre}</td>
                      <td className="p-3 text-on-surface-variant">{app.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            app.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {app.status === 'Approved' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>Certificate Issued</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApprove(app.id, app.name)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>Approve & Issue Certificate</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL 1: RECORD NEW EXPENDITURE */}
      {/* ========================================== */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-headline text-lg font-bold text-primary">Record New Institutional Expenditure</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="p-1 rounded-lg hover:bg-surface-container">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant block mb-1">Expenditure Title (Kha Khrch Hua) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 New Lab Workstations or Fiber Internet Recharge"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Category *</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
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
                  <label className="font-bold text-on-surface-variant block mb-1">Amount in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 font-bold text-rose-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Vendor / Recipient</label>
                  <input
                    type="text"
                    placeholder="e.g. Shree Ganesh Computers"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Invoice / Receipt No.</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2026-99"
                    value={newExpense.invoiceNo}
                    onChange={(e) => setNewExpense({ ...newExpense, invoiceNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-md cursor-pointer"
                >
                  Save Expenditure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: ADD / EDIT COURSE */}
      {/* ========================================== */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-headline text-lg font-bold text-primary">
                {editingCourse ? 'Update Existing Course' : 'Add New Vocational Diploma Course'}
              </h3>
              <button onClick={() => setShowAddCourseModal(false)} className="p-1 rounded-lg hover:bg-surface-container">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADCA, PGDCA"
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 font-mono font-bold text-secondary"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Duration *</label>
                  <select
                    value={newCourseForm.duration}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                  >
                    <option>12 Months</option>
                    <option>6 Months</option>
                    <option>3 Months</option>
                    <option>1 Month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant block mb-1">Course Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advance Diploma in Computer Applications"
                  value={newCourseForm.name}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Eligibility</label>
                  <input
                    type="text"
                    placeholder="e.g. 10th / 12th Pass"
                    value={newCourseForm.eligibility}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, eligibility: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Fee Structure</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹100 Reg. + ₹600/mo"
                    value={newCourseForm.fee}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 font-bold text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant block mb-1">
                  Modules / Syllabus (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="MS Word, Tally Prime, Python, Practical Project"
                  value={newCourseForm.modulesStr}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, modulesStr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                />
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 rounded-xl text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-md cursor-pointer"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: ADD GALLERY EVENT PHOTO */}
      {/* ========================================== */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-headline text-lg font-bold text-primary">Upload / Add Event Photograph</h3>
              <button onClick={() => setShowAddGalleryModal(false)} className="p-1 rounded-lg hover:bg-surface-container">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateGalleryItem} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant block mb-1">Event / Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Convocation or Computer Lab Inauguration"
                  value={newGalleryForm.title}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Category</label>
                  <select
                    value={newGalleryForm.category}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="classroom">Classroom & Lab</option>
                    <option value="felicitations">Felicitations & Awards</option>
                    <option value="leadership">Leadership & Director</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab Session"
                    value={newGalleryForm.badge}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Ghosi Central Campus"
                    value={newGalleryForm.location}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface-variant block mb-1">Date / Session</label>
                  <input
                    type="text"
                    placeholder="e.g. October 2026"
                    value={newGalleryForm.date}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant block mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the activity..."
                  value={newGalleryForm.desc}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
                />
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 rounded-xl text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-md cursor-pointer"
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
