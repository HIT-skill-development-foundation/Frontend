export const initialStudentData = {
  fullName: "Rahul Kumar Verma",
  fatherName: "Dinesh Verma",
  dob: "2004-06-14",
  gender: "Male",
  mobile: "+91 94520-78192",
  email: "rahul.verma@email.com",
  rollNo: "HIT-STU-2026-00001",
  admissionNo: "HIT-ADM-2026-00001",
  courseCode: "ADCA-101",
  courseName: "Advance Diploma in Computer Applications (ADCA)",
  courseDuration: "12 Months",
  centreCode: "HIT-CEN-0001",
  centreName: "Ghosi Main Training Centre",
  centreAddress: "Kasba Khas, Ghosi, Mau, UP - 275105",
  batchTime: "Morning Batch (08:00 AM – 10:00 AM)",
  enrollmentDate: "12 Jan 2026",
  validUpto: "January 2027",
  bloodGroup: "B+",
  emergencyContact: "+91 94520-11223",
  photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7w1t1k4oE5UqY7CjyUR9wr4ds1UGeSFZ3ypw5-HptD0EkF58K5E_vmI_bA_f-uvoCN_b5QE-r2mxd-Qkmddhft6wn7PXH7whtkiBb1dTJDjJVOyAKIo7zA0yQzmr4PUxGNfinra069nOa3zmuRri1yPodaLmd6-OIFQGJKZaRvAf485ZePcjl6rZon7kqfgLE1uKxMG6GpvCoyemhXKNm4PSZixEqRPRApUwBqT4PhqUJoBZ3PrTiSQ",
  status: "Active Enrolled Student",
  attendance: "94.5%",
  subjects: [
    { name: "Computer Fundamentals & OS", marks: "92/100", grade: "A+" },
    { name: "MS Office Suite & Productivity", marks: "88/100", grade: "A" },
    { name: "Tally Prime with GST & E-Way", marks: "95/100", grade: "A+" },
    { name: "Web Development & HTML/CSS", marks: "86/100", grade: "A" },
    { name: "Programming with Python & C", marks: "90/100", grade: "A+" }
  ]
};

export const coursesList = [
  {
    id: "bcc",
    code: "BCC",
    name: "Basic Computer Course (BCC)",
    duration: "2 Month",
    eligibility: "Open to All",
    formula: "Basic Fundamental + DOS + Windows 10 + Notepad + Wordpad + Paint + MS Word 2010 + Internet",
    modules: [
      "Basic Fundamental",
      "M.S - DOS",
      "M.S. Windows 10",
      "Notepad",
      "Word pad",
      "Paint",
      "M.S Word 2010",
      "Internet"
    ],
    fee: "₹2,000",
    icon: "desktop_windows",
    popular: false
  },
  {
    id: "ccc",
    code: "CCC",
    name: "Course on Computer Concepts (CCC)",
    duration: "3 Month",
    eligibility: "Open to All",
    formula: "Basic Fundamental + DOS + Windows 10 + Notepad + Wordpad + Paint + LibreOffice + Internet",
    modules: [
      "Basic Fundamental",
      "M.S - DOS",
      "M.S. Windows 10",
      "Notepad",
      "Word pad",
      "Paint",
      "Libre Office",
      "Writer",
      "Calc",
      "Impress",
      "Internet"
    ],
    fee: "₹3,500",
    icon: "verified",
    popular: true
  },
  {
    id: "cca",
    code: "CCA",
    name: "Certificate in Computer Application (CCA)",
    duration: "6 Month",
    eligibility: "10th Pass",
    formula: "Basic Fundamental + LibreOffice + M.S Office 2010 + Typing + Internet",
    modules: [
      "Basic Fundamental",
      "M.S - DOS",
      "M.S. Windows 10",
      "Notepad",
      "Word pad",
      "Paint",
      "Libre Office (Writer, Calc, Impress)",
      "M.S Office 2010",
      "M.S Word 2010",
      "M.S Excel 2020",
      "M.S Power Point 2020",
      "English Typing",
      "Internet"
    ],
    fee: "₹6,000",
    icon: "computer",
    popular: false
  },
  {
    id: "dcpa",
    code: "DCPA",
    name: "Diploma in Computer Professional Accounting & M.S Office 2010 (DCPA)",
    duration: "6 Month",
    eligibility: "10th / 12th Pass",
    formula: "BCC + M.S Office 2010 + Tally 9 ERP + Internet",
    modules: [
      "BCC (Basic Fundamental, DOS, Windows 10, Paint, Wordpad)",
      "M.S Office 2010 Full Suite",
      "Tally 9 ERP (Accounting, Vouchers & Inventory)",
      "Internet & Professional Office Communication"
    ],
    fee: "₹6,000",
    icon: "account_balance_wallet",
    popular: true
  },
  {
    id: "dtp",
    code: "DTP",
    name: "Desk Top Publishing (DTP)",
    duration: "6 Month",
    eligibility: "10th / 12th Pass",
    formula: "BCC + M.S Word 2010 + Hindi Typing + PageMaker 7.0 + CorelDraw + Photoshop + Internet",
    modules: [
      "BCC (Fundamentals & Windows)",
      "M.S Word 2010",
      "Hindi Typing",
      "Adobe PageMaker 7.0",
      "CorelDraw Graphic Designing",
      "Photoshop Image Editing",
      "Internet & Digital Printing"
    ],
    fee: "₹6,000",
    icon: "palette",
    popular: true
  },
  {
    id: "chw",
    code: "CHW",
    name: "Computer Hardware (CHW)",
    duration: "3 Month",
    eligibility: "10th Pass",
    formula: "PC Architecture + Assembly + OS Installation + Troubleshooting",
    modules: [
      "Computer Hardware Fundamentals",
      "PC Architecture & Motherboard Components",
      "CPU, RAM & Storage Installation",
      "BIOS/CMOS Setup & Windows OS Installation",
      "Driver Configuration & Troubleshooting",
      "SMPS, Power Supplies & Diagnostic Tools"
    ],
    fee: "₹6,000",
    icon: "build",
    popular: false
  },
  {
    id: "tally",
    code: "Tally 9 ERP",
    name: "Certificate in Tally 9 ERP",
    duration: "3 Month",
    eligibility: "10th / 12th Pass",
    formula: "Accounting Fundamentals + Company Setup + Inventory + Financials",
    modules: [
      "Accounting Fundamentals",
      "Company Creation & Ledger Setup",
      "Inventory Management",
      "Voucher Entry & Bill of Materials",
      "Taxation Basics & Financial Reports in Tally 9 ERP"
    ],
    fee: "₹3,500",
    icon: "calculate",
    popular: true
  },
  {
    id: "office-automation",
    code: "COA",
    name: "Certificate in Office Automation",
    duration: "3 Month",
    eligibility: "Open to All",
    formula: "Windows 10 + Word + Excel + PPT + Office Automation & Internet",
    modules: [
      "M.S. Windows 10 & File Management",
      "M.S Word 2010 Document Formatting",
      "M.S Excel 2010 Formulas & Data Management",
      "M.S PowerPoint 2010 Presentations",
      "Office Email, Scanning & Printing Automation"
    ],
    fee: "₹3,000",
    icon: "business_center",
    popular: false
  },
  {
    id: "adca",
    code: "ADCA",
    name: "Advance Diploma in Computer Application (ADCA)",
    duration: "12 Month",
    eligibility: "10th / 12th Pass",
    formula: "BCC + CCC + CCA + DCPA + DTP + CHW + Internet + English Typing + Hindi Typing + Office Automation",
    modules: [
      "BCC (Basic Fundamental, DOS, Windows 10, Paint, Wordpad)",
      "CCC (LibreOffice Writer, Calc, Impress)",
      "CCA (M.S Office 2010 Suite)",
      "DCPA (Computer Professional Accounting & Tally 9 ERP)",
      "DTP (PageMaker 7.0, CorelDraw, Photoshop)",
      "CHW (Computer Hardware Maintenance)",
      "English Typing & Hindi Typing Speed Drills",
      "Office Automation & Internet Applications",
      "Live Capstone Project & Practical Examination"
    ],
    fee: "₹12,000",
    icon: "terminal",
    popular: true
  }
];

export const universityProgramsList = [
  {
    id: "univ-ba",
    code: "BA",
    name: "Bachelor of Arts (BA)",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th Pass (Any Recognized Board)",
    mode: "Online & Distance Mode",
    type: "Undergraduate Degree",
    fee: "Flexible University Slabs",
    streams: "Hindi, English, History, Political Science, Sociology, Economics",
    icon: "history_edu",
    popular: true
  },
  {
    id: "univ-bcom",
    code: "B.Com",
    name: "Bachelor of Commerce (B.Com)",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th Pass (Commerce / Any Stream)",
    mode: "Online & Distance Mode",
    type: "Undergraduate Degree",
    fee: "Flexible University Slabs",
    streams: "Financial Accounting, Business Law, Corporate Taxation, Banking",
    icon: "account_balance",
    popular: true
  },
  {
    id: "univ-bca",
    code: "BCA",
    name: "Bachelor of Computer Applications (BCA)",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th Pass (Maths / Computer Preferred)",
    mode: "Online & Distance Mode",
    type: "Undergraduate Degree",
    fee: "Flexible University Slabs",
    streams: "Programming (C/C++, Java), Database Management, Web Technologies, Software Engineering",
    icon: "laptop_chromebook",
    popular: true
  },
  {
    id: "univ-mca",
    code: "MCA",
    name: "Master of Computer Applications (MCA)",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation (BCA/B.Sc IT or Any Graduate with Maths)",
    mode: "Online & Distance Mode",
    type: "Postgraduate Degree",
    fee: "Flexible University Slabs",
    streams: "Advanced Algorithms, Cloud Computing, Full-Stack Development, AI & Machine Learning",
    icon: "terminal",
    popular: true
  },
  {
    id: "univ-mba",
    code: "MBA",
    name: "Master of Business Administration (MBA)",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation in Any Discipline",
    mode: "Online & Distance Mode",
    type: "Postgraduate Degree",
    fee: "Flexible University Slabs",
    streams: "Finance, Marketing, Human Resource (HR), Information Technology (IT), Operations",
    icon: "business",
    popular: true
  },
  {
    id: "univ-pgdca",
    code: "PGDCA",
    name: "Post Graduate Diploma in Computer Applications (PGDCA)",
    duration: "1 Year (2 Semesters)",
    eligibility: "Graduation (Any Stream)",
    mode: "Online & Distance Mode",
    type: "Postgraduate Diploma",
    fee: "Flexible University Slabs",
    streams: "Computer Applications, Database Systems, System Analysis, Commercial Software",
    icon: "workspace_premium",
    popular: true
  },
  {
    id: "univ-ma",
    code: "MA",
    name: "Master of Arts (MA)",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation in Relevant Subject",
    mode: "Online & Distance Mode",
    type: "Postgraduate Degree",
    fee: "Flexible University Slabs",
    streams: "Hindi Literature, English, Sociology, Political Science, History",
    icon: "menu_book",
    popular: false
  },
  {
    id: "univ-other",
    code: "Other Courses",
    name: "Additional University Programs (BBA, B.Sc, M.Com, M.Sc, MSW, BLIS, MLIS)",
    duration: "1 - 3 Years",
    eligibility: "12th / Graduation as Applicable",
    mode: "Online & Distance Mode",
    type: "Degree & Diploma Programs",
    fee: "Approved University Norms",
    streams: "Business Administration, Science Streams, Library Sciences, Social Work",
    icon: "domain_add",
    popular: false
  }
];

export const centresList = [
  { id: "HIT-CEN-0001", name: "Ghosi Main Training Centre", district: "Mau", address: "Kasba Khas, Ghosi, Mau, UP - 275105", status: "Active HQ" },
  { id: "HIT-CEN-0002", name: "Kopaganj Skill Campus", district: "Mau", address: "Near Old Bus Stand, Kopaganj, Mau, UP", status: "Active" },
  { id: "HIT-CEN-0003", name: "Dohrighat Vocational Hub", district: "Mau", address: "Ramghat Road, Dohrighat, Mau, UP", status: "Active" },
  { id: "HIT-CEN-0004", name: "Muhammadabad Youth Centre", district: "Mau", address: "Gohna Road, Muhammadabad, Mau, UP", status: "Active" },
  { id: "HIT-CEN-0005", name: "Azamgarh City Extension", district: "Azamgarh", address: "Civil Lines, Azamgarh, UP - 276001", status: "Active" },
  { id: "HIT-CEN-0006", name: "Varanasi Eastern Hub", district: "Varanasi", address: "Sigra, Varanasi, UP - 221002", status: "Active" }
];

export const mockAdmissionsTable = [
  { id: "HIT-ADM-2026-00048", name: "Pooja Kumari", course: "ADCA (12 Mo)", centre: "Ghosi Main", date: "17 Oct 2026", fee: "₹100", status: "Approved" },
  { id: "HIT-ADM-2026-00047", name: "Vikas Yadav", course: "Tally Prime + GST", centre: "Kopaganj", date: "16 Oct 2026", fee: "₹100", status: "Pending" },
  { id: "HIT-ADM-2026-00046", name: "Ananya Sharma", course: "CCC (NIELIT)", centre: "Ghosi Main", date: "16 Oct 2026", fee: "₹100", status: "Approved" },
  { id: "HIT-ADM-2026-00045", name: "Mohd. Tariq", course: "ADCA (12 Mo)", centre: "Dohrighat", date: "15 Oct 2026", fee: "₹100", status: "Approved" },
  { id: "HIT-ADM-2026-00044", name: "Sunita Maurya", course: "DITA & AI", centre: "Muhammadabad", date: "15 Oct 2026", fee: "₹100", status: "Pending" }
];

export const mockDonationRecord = {
  txnId: "pay_P982Kjx9128Kz_HITDON",
  receiptNo: "HIT/80G/2026/0892",
  date: "17 Oct 2026, 11:34 AM",
  donorName: "Arunav Sengupta",
  donorPan: "ABCPS8291M",
  donorEmail: "arunav.sengupta@techindia.org",
  donorPhone: "+91 98301-54321",
  donorAddress: "Sector 62, Noida, Uttar Pradesh - 201301",
  amount: 5000,
  amountInWords: "Five Thousand Indian Rupees Only",
  purpose: "Vocational & Digital Skill Sponsorship for Underprivileged Girls",
  taxExemptionEligible: 2500, // 50% under 80G
  orderRef: "ORD_2026_99412",
  mode: "UPI Auto-Settled (Razorpay Webhook)",
  bankRef: "UPI-429182903102"
};

export const mockDonationsList = [
  mockDonationRecord,
  {
    txnId: "pay_M871Bvx4419Lt_HITDON",
    receiptNo: "HIT/80G/2026/0891",
    date: "16 Oct 2026, 04:15 PM",
    donorName: "Dr. Rameshwar Pandey",
    donorPan: "AFRPP4192K",
    donorEmail: "dr.rpandey@purvanchal.edu",
    donorPhone: "+91 94152-33441",
    donorAddress: "Civil Lines, Azamgarh, UP",
    amount: 11000,
    amountInWords: "Eleven Thousand Indian Rupees Only",
    purpose: "Computer Lab Hardware & Fiber Internet Fund",
    taxExemptionEligible: 5500,
    orderRef: "ORD_2026_99411",
    mode: "NEFT Bank Transfer",
    bankRef: "BARB-261016-9921"
  },
  {
    txnId: "pay_K129Asd7721Pm_HITDON",
    receiptNo: "HIT/80G/2026/0890",
    date: "15 Oct 2026, 02:40 PM",
    donorName: "Shri Sita Ram Charitable Trust",
    donorPan: "AABTS9910D",
    donorEmail: "trust@sitaram.org",
    donorPhone: "+91 98110-44910",
    donorAddress: "Connaught Place, New Delhi",
    amount: 25000,
    amountInWords: "Twenty Five Thousand Indian Rupees Only",
    purpose: "Rural Youth IT Training Sponsorship",
    taxExemptionEligible: 12500,
    orderRef: "ORD_2026_99410",
    mode: "Corporate Net Banking",
    bankRef: "HDFC-20261015-8821"
  },
  {
    txnId: "pay_Q552Hmn1023Wq_HITDON",
    receiptNo: "HIT/80G/2026/0889",
    date: "14 Oct 2026, 10:20 AM",
    donorName: "Sunil Kumar Srivastava",
    donorPan: "ABXPS7712E",
    donorEmail: "sunil.srivastava@gmail.com",
    donorPhone: "+91 94520-88129",
    donorAddress: "Kasba Khas, Ghosi, Mau, UP",
    amount: 2500,
    amountInWords: "Two Thousand Five Hundred Rupees Only",
    purpose: "Student Learning Kits & Books",
    taxExemptionEligible: 1250,
    orderRef: "ORD_2026_99409",
    mode: "UPI Instant Settlement",
    bankRef: "UPI-918290192841"
  }
];

export const mockExpensesList = [
  {
    id: "EXP-2026-001",
    title: "10 New Core-i5 Computer Systems with SSDs",
    category: "Hardware & Lab Equipment",
    amount: 85000,
    date: "12 Oct 2026",
    vendor: "Shree Ganesh Computers, Varanasi",
    invoiceNo: "INV-SGC-4481",
    status: "Verified & Settled",
    approvedBy: "Treasurer / Director"
  },
  {
    id: "EXP-2026-002",
    title: "Airtel Enterprise Fiber 200 Mbps (3 Months Advance)",
    category: "Internet & Networking",
    amount: 8850,
    date: "10 Oct 2026",
    vendor: "Bharti Airtel Enterprise Services",
    invoiceNo: "AIR-UP-2026-9912",
    status: "Verified & Settled",
    approvedBy: "Centre Administrator"
  },
  {
    id: "EXP-2026-003",
    title: "5 kVA Luminous Inverter + 4 Tubular Batteries for Lab Backup",
    category: "Power Infrastructure",
    amount: 42000,
    date: "08 Oct 2026",
    vendor: "Kashi Power Solutions, Mau",
    invoiceNo: "KPS-IN-8819",
    status: "Verified & Settled",
    approvedBy: "Board of Trustees"
  },
  {
    id: "EXP-2026-004",
    title: "Student Practical Manuals, Syllabi & ID Card Ribbons (500 Sets)",
    category: "Printing & Stationery",
    amount: 14500,
    date: "05 Oct 2026",
    vendor: "Purvanchal Offset Printers, Ghosi",
    invoiceNo: "POP-INV-1092",
    status: "Verified & Settled",
    approvedBy: "Academic Coordinator"
  },
  {
    id: "EXP-2026-005",
    title: "Certified Instructors & Lab Demonstrators Monthly Honorarium",
    category: "Faculty Honorarium",
    amount: 48000,
    date: "01 Oct 2026",
    vendor: "HIT Faculty Payroll Ledger",
    invoiceNo: "PAY-OCT-2026",
    status: "Verified & Settled",
    approvedBy: "Centre Director"
  }
];

export const registeredStudentsList = [
  { id: "HIT-STU-2026-00001", name: "Rahul Kumar Verma", courseId: "adca", courseName: "ADCA (12 Months)", centre: "Ghosi Main HQ", date: "12 Jan 2026", feeStatus: "Paid (₹12,000)", status: "Active Enrolled", grade: "A+" },
  { id: "HIT-STU-2026-00002", name: "Pooja Kumari", courseId: "adca", courseName: "ADCA (12 Months)", centre: "Ghosi Main HQ", date: "14 Jan 2026", feeStatus: "Paid (₹12,000)", status: "Active Enrolled", grade: "A" },
  { id: "HIT-STU-2026-00003", name: "Ananya Sharma", courseId: "ccc", courseName: "CCC (3 Months)", centre: "Ghosi Main HQ", date: "15 Jan 2026", feeStatus: "Paid (₹3,500)", status: "Active Enrolled", grade: "A+" },
  { id: "HIT-STU-2026-00004", name: "Vikas Yadav", courseId: "tally", courseName: "Tally 9 ERP (3 Months)", centre: "Kopaganj Campus", date: "18 Jan 2026", feeStatus: "Paid (₹3,500)", status: "Active Enrolled", grade: "A" },
  { id: "HIT-STU-2026-00005", name: "Mohd. Tariq", courseId: "dca", courseName: "DCA (12 Months)", centre: "Dohrighat Hub", date: "20 Jan 2026", feeStatus: "Paid (₹12,000)", status: "Active Enrolled", grade: "B+" },
  { id: "HIT-STU-2026-00006", name: "Sunita Maurya", courseId: "pgdca", courseName: "PGDCA (12 Months)", centre: "Muhammadabad", date: "22 Jan 2026", feeStatus: "Paid (₹22,000)", status: "Active Enrolled", grade: "A" },
  { id: "HIT-STU-2026-00007", name: "Amit Kumar Rajbhar", courseId: "cca", courseName: "CCA (6 Months)", centre: "Ghosi Main HQ", date: "24 Jan 2026", feeStatus: "Paid (₹6,000)", status: "Active Enrolled", grade: "A" },
  { id: "HIT-STU-2026-00008", name: "Neha Prajapati", courseId: "hindi-typing", courseName: "Hindi Typing (3 Months)", centre: "Kopaganj Campus", date: "25 Jan 2026", feeStatus: "Paid (₹3,000)", status: "Active Enrolled", grade: "A+" },
  { id: "HIT-STU-2026-00009", name: "Deepak Chauhan", courseId: "english-typing", courseName: "English Typing (3 Months)", centre: "Azamgarh City", date: "28 Jan 2026", feeStatus: "Paid (₹3,000)", status: "Active Enrolled", grade: "A" },
  { id: "HIT-STU-2026-00010", name: "Ritu Soni", courseId: "tally-office", courseName: "Tally & Office Automation (6 Months)", centre: "Varanasi Eastern", date: "01 Feb 2026", feeStatus: "Paid (₹6,000)", status: "Active Enrolled", grade: "A+" },
  { id: "HIT-STU-2026-00011", name: "Suraj Gond", courseId: "bcc", courseName: "BCC (2 Months)", centre: "Ghosi Main HQ", date: "03 Feb 2026", feeStatus: "Paid (₹2,000)", status: "Active Enrolled", grade: "B+" },
  { id: "HIT-STU-2026-00012", name: "Priyanka Vishwakarma", courseId: "dtp", courseName: "DTP (6 Months)", centre: "Dohrighat Hub", date: "05 Feb 2026", feeStatus: "Paid (₹6,000)", status: "Active Enrolled", grade: "A" },
];

