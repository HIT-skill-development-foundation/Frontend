# H.I.T India Skill Development Foundation - Backend API Specification (`api.md`)

This document provides the complete RESTful API contract for the **H.I.T India Skill Development Foundation** web application. It is tailored to seamlessly power all frontend views (Admissions, Student Portal, Verification, Admin Console, Donations, Courses, Gallery, and Franchise Inquiries).

---

## 1. General Architecture & Standards

### 1.1 Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.hitindia.org/api/v1`

### 1.2 Headers & Content Type
- **Content-Type**: `application/json` (or `multipart/form-data` for file uploads)
- **Authorization**: `Bearer <JWT_TOKEN>` for protected routes

### 1.3 Standard Response Formats

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Descriptive error message",
  "details": [ ... ] // Optional validation errors
}
```

### 1.4 HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or missing parameters.
- `401 Unauthorized`: Missing or invalid Bearer token.
- `403 Forbidden`: Authenticated user lacks required role/permissions.
- `404 Not Found`: Requested entity not found.
- `500 Internal Server Error`: Unexpected server exception.

---

## 2. Authentication & Admin Desks

### 2.1 Admin Login
- **Endpoint**: `POST /auth/admin/login`
- **Access**: Public
- **Description**: Authenticates trustee, director, or registrar.

#### Request Body
```json
{
  "email": "admin@hitindia.org",
  "password": "password123"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "data": {
    "id": "67140...",
    "name": "Er. A. K. Verma (Director Desk)",
    "email": "admin@hitindia.org",
    "role": "Super Admin & Central Trustee"
  }
}
```

---

### 2.2 Student Login
- **Endpoint**: `POST /auth/student/login`
- **Access**: Public
- **Description**: Authenticates student using Roll Number or Email.

#### Request Body
```json
{
  "rollOrEmail": "HIT-STU-2026-00001",
  "password": "password123"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "data": {
    "rollNo": "HIT-STU-2026-00001",
    "admissionNo": "HIT-ADM-2026-00001",
    "fullName": "Rahul Kumar Verma",
    "email": "rahul.verma@email.com",
    "courseName": "Advance Diploma in Computer Applications (ADCA)",
    "centreName": "Ghosi Main Training Centre",
    "status": "Active Enrolled Student"
  }
}
```

---

### 2.3 Admin Dashboard Summary Statistics
- **Endpoint**: `GET /admin/stats`
- **Access**: Protected (`Admin`)
- **Description**: Summary metrics displayed in the top KPI tiles of the Admin Dashboard.

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "totalStudents": 89,
    "totalDonations": 43500,
    "totalExpenses": 198350,
    "pendingAdmissions": 5,
    "activeCentres": 6,
    "activeCourses": 9
  }
}
```

---

## 3. Student Admissions

### 3.1 Submit New Admission Form
- **Endpoint**: `POST /admissions`
- **Access**: Public
- **Description**: Submits student admission application, assigns registration ID & roll ID, and settles initial registration fee.

#### Request Body
```json
{
  "fullName": "Rahul Kumar Verma",
  "fatherName": "Dinesh Verma",
  "motherName": "Shanti Devi",
  "dob": "2004-06-14",
  "gender": "Male",
  "category": "OBC",
  "mobile": "9452078192",
  "email": "rahul.verma@email.com",
  "address": "Kasba Khas, Ward 4",
  "district": "Mau",
  "state": "Uttar Pradesh",
  "pincode": "275105",
  "courseId": "adca",
  "centreId": "HIT-CEN-0001",
  "batchTime": "08:00 AM - 10:00 AM (Morning)",
  "qualification": "12th Pass (Science Stream)",
  "aadhaarNo": "4829-1928-8472",
  "paymentMode": "upi",
  "paymentRef": "UPI-48192039120"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "regId": "HIT-ADM-2026-78192",
  "rollId": "HIT-STU-2026-78192",
  "studentData": {
    "rollNo": "HIT-STU-2026-78192",
    "regNo": "HIT-ADM-2026-78192",
    "fullName": "Rahul Kumar Verma",
    "fatherName": "Dinesh Verma",
    "motherName": "Shanti Devi",
    "dob": "2004-06-14",
    "gender": "Male",
    "category": "OBC",
    "mobile": "+91 9452078192",
    "email": "rahul.verma@email.com",
    "courseCode": "ADCA",
    "courseName": "Advance Diploma in Computer Applications (ADCA)",
    "centreName": "Ghosi Main Training Centre",
    "centreCode": "HIT-CEN-0001",
    "session": "2026-2027",
    "batchTiming": "08:00 AM - 10:00 AM (Morning)",
    "admissionDate": "19/10/2026",
    "status": "Active Enrolled Student",
    "feeStatus": "₹100 Registration Settled (Online)",
    "attendancePercentage": "100%",
    "overallGrade": "A+"
  }
}
```

---

### 3.2 List All Admissions (Admin Console)
- **Endpoint**: `GET /admissions`
- **Access**: Protected (`Admin`)
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 20)
  - `status` (`Pending`, `Approved`, `Revision Needed`)
  - `search` (Search by student name or regId)

#### Response (`200 OK`)
```json
{
  "success": true,
  "count": 5,
  "totalPages": 1,
  "currentPage": 1,
  "data": [
    {
      "id": "HIT-ADM-2026-00048",
      "name": "Pooja Kumari",
      "course": "ADCA (12 Mo)",
      "centre": "Ghosi Main",
      "date": "17 Oct 2026",
      "fee": "₹100",
      "status": "Approved"
    },
    {
      "id": "HIT-ADM-2026-00047",
      "name": "Vikas Yadav",
      "course": "Tally Prime + GST",
      "centre": "Kopaganj",
      "date": "16 Oct 2026",
      "fee": "₹100",
      "status": "Pending"
    }
  ]
}
```

---

### 3.3 Update Admission Status (Approve / Reject)
- **Endpoint**: `PATCH /admissions/:id/status`
- **Access**: Protected (`Admin`)

#### Request Body
```json
{
  "status": "Approved", // or "Revision Needed"
  "certificateIssued": true,
  "remark": "All documents verified successfully against MCA guidelines"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Admission status updated to Approved"
}
```

---

## 4. Student Portal & Registry

### 4.1 Get Student Dossier by Roll Number
- **Endpoint**: `GET /students/:rollNo`
- **Access**: Public / Protected (`Student`, `Admin`)
- **Description**: Fetches student record, subjects, academic grades, and identity card profile.

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "fullName": "Rahul Kumar Verma",
    "fatherName": "Dinesh Verma",
    "dob": "2004-06-14",
    "gender": "Male",
    "mobile": "+91 94520-78192",
    "email": "rahul.verma@email.com",
    "rollNo": "HIT-STU-2026-00001",
    "admissionNo": "HIT-ADM-2026-00001",
    "courseCode": "ADCA-101",
    "courseName": "Advance Diploma in Computer Applications (ADCA)",
    "courseDuration": "12 Months",
    "centreCode": "HIT-CEN-0001",
    "centreName": "Ghosi Main Training Centre",
    "centreAddress": "Kasba Khas, Ghosi, Mau, UP - 275105",
    "batchTime": "Morning Batch (08:00 AM – 10:00 AM)",
    "enrollmentDate": "12 Jan 2026",
    "validUpto": "January 2027",
    "bloodGroup": "B+",
    "emergencyContact": "+91 94520-11223",
    "photoUrl": "https://lh3.googleusercontent.com/...",
    "status": "Active Enrolled Student",
    "attendance": "94.5%",
    "subjects": [
      { "name": "Computer Fundamentals & OS", "marks": "92/100", "grade": "A+" },
      { "name": "MS Office Suite & Productivity", "marks": "88/100", "grade": "A" },
      { "name": "Tally Prime with GST & E-Way", "marks": "95/100", "grade": "A+" },
      { "name": "Web Development & HTML/CSS", "marks": "86/100", "grade": "A" },
      { "name": "Programming with Python & C", "marks": "90/100", "grade": "A+" }
    ]
  }
}
```

---

### 4.2 List Enrolled Students (Admin Console)
- **Endpoint**: `GET /students`
- **Access**: Protected (`Admin`)
- **Query Parameters**:
  - `courseId` (filter by course, e.g. `adca`, `ccc`)
  - `search` (filter by student name or roll number)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "HIT-STU-2026-00001",
      "name": "Rahul Kumar Verma",
      "courseId": "adca",
      "courseName": "ADCA (12 Months)",
      "centre": "Ghosi Main HQ",
      "date": "12 Jan 2026",
      "feeStatus": "Paid (₹12,000)",
      "status": "Active Enrolled",
      "grade": "A+"
    }
  ]
}
```

---

### 4.3 Download Student ID Card / PDF Generation
- **Endpoint**: `GET /students/:rollNo/id-card`
- **Access**: Public / Protected
- **Description**: Streams or generates official PVC Student ID Card PDF.

#### Response (`200 OK`)
```json
{
  "success": true,
  "filename": "HIT_ID_CARD_HIT-STU-2026-00001.pdf",
  "downloadUrl": "https://api.hitindia.org/downloads/cards/HIT-STU-2026-00001.pdf"
}
```

---

### 4.4 Increment ID Card Download Count
- **Endpoint**: `POST /students/:rollNo/download-log`
- **Access**: Protected (`Student`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "downloadCount": 3
}
```

---

## 5. Credential & Roll Verification

### 5.1 Verify Roll Number or Certificate ID
- **Endpoint**: `GET /verification/:identifier`
- **Access**: Public
- **Description**: Cryptographically checks student roll number or certificate serial against the Central Registry.

#### Response (`200 OK` - Found)
```json
{
  "success": true,
  "data": {
    "rollNo": "HIT-STU-2026-00001",
    "fullName": "Rahul Kumar Verma",
    "courseName": "Advance Diploma in Computer Applications (ADCA)",
    "courseDuration": "12 Months",
    "centreName": "Ghosi Main Training Centre",
    "enrollmentDate": "12 Jan 2026",
    "status": "Active Enrolled Student",
    "attendance": "94.5%",
    "grade": "A+",
    "verifiedBy": "MCA & NITI Aayog Central Ledger Node"
  }
}
```

#### Response (`404 Not Found`)
```json
{
  "success": false,
  "error": "Credential Record Not Found in Central NITI Aayog/MCA Registry"
}
```

---

## 6. Courses & University Programs

### 6.1 Get All Vocational / Computer Courses
- **Endpoint**: `GET /courses`
- **Access**: Public

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "adca",
      "code": "ADCA",
      "name": "Advance Diploma in Computer Application (ADCA)",
      "duration": "12 Month",
      "eligibility": "10th / 12th Pass",
      "formula": "BCC + CCC + CCA + DCPA + DTP + CHW + Internet + Typing",
      "modules": [
        "Basic Fundamental",
        "LibreOffice & MS Office Suite",
        "Tally 9 ERP & Accounting",
        "Photoshop & Graphic Design",
        "Typing & Project Work"
      ],
      "fee": "₹12,000",
      "icon": "terminal",
      "popular": true
    }
  ]
}
```

---

### 6.2 Create Course (Admin)
- **Endpoint**: `POST /courses`
- **Access**: Protected (`Admin`)

#### Request Body
```json
{
  "code": "ADIT",
  "name": "Advance Diploma in Information Technology",
  "duration": "12 Months",
  "eligibility": "12th Pass",
  "fee": "₹15,000",
  "modules": ["Python", "Web Development", "Database", "Networking"],
  "icon": "computer",
  "popular": false
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": { "id": "adit", "code": "ADIT", "..." : "..." }
}
```

---

### 6.3 Update Course (Admin)
- **Endpoint**: `PUT /courses/:id`
- **Access**: Protected (`Admin`)

---

### 6.4 Delete Course (Admin)
- **Endpoint**: `DELETE /courses/:id`
- **Access**: Protected (`Admin`)

---

### 6.5 Get University Programs (Degree & Distance)
- **Endpoint**: `GET /courses/university-programs`
- **Access**: Public

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "univ-bca",
      "code": "BCA",
      "name": "Bachelor of Computer Applications (BCA)",
      "duration": "3 Years (6 Semesters)",
      "eligibility": "12th Pass (Maths / Computer Preferred)",
      "mode": "Online & Distance Mode",
      "type": "Undergraduate Degree",
      "fee": "Flexible University Slabs",
      "streams": "Programming (C/C++, Java), Database Management, Web Tech",
      "icon": "laptop_chromebook",
      "popular": true
    }
  ]
}
```

---

### 6.6 Submit University Course Inquiry
- **Endpoint**: `POST /courses/inquiry`
- **Access**: Public

#### Request Body
```json
{
  "programId": "univ-bca",
  "programName": "Bachelor of Computer Applications (BCA)",
  "name": "Amit Sharma",
  "phone": "9812345678",
  "qualification": "12th Pass"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Inquiry Received Successfully! Our admissions counselor will call you shortly."
}
```

---

## 7. Centres & Franchise Affiliation

### 7.1 List Training Centres
- **Endpoint**: `GET /centres`
- **Access**: Public

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "HIT-CEN-0001",
      "name": "Ghosi Main Training Centre",
      "district": "Mau",
      "address": "Kasba Khas, Ghosi, Mau, UP - 275105",
      "status": "Active HQ"
    }
  ]
}
```

---

### 7.2 Submit Franchise / Affiliation Application
- **Endpoint**: `POST /centres/franchise-apply`
- **Access**: Public

#### Request Body
```json
{
  "name": "Anand Kumar Singh",
  "phone": "9616764675",
  "email": "centre@ghosi.org",
  "city": "Ghosi, Mau",
  "centerType": "New Computer Center",
  "pcCount": "10 to 20 Computers",
  "spaceAvailable": "300 to 500 Sq. Ft."
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "applicationRef": "HIT-FRAN-2026-9812",
  "message": "Franchise inquiry registered. Institutional affiliation team will connect."
}
```

---

## 8. Donations & 80G Tax Exemption

### 8.1 Process Donation & Generate 80G Receipt
- **Endpoint**: `POST /donations/process`
- **Access**: Public
- **Description**: Verifies payment settlement and generates official 50% 80G tax exemption receipt.

#### Request Body
```json
{
  "amount": 5000,
  "donorInfo": {
    "name": "Arunav Sengupta",
    "pan": "ABCPS8291M",
    "email": "arunav.sengupta@techindia.org",
    "phone": "+91 98301-54321",
    "address": "Sector 62, Noida, Uttar Pradesh - 201301",
    "purpose": "Vocational & Digital Skill Sponsorship for Underprivileged Girls",
    "citizenAgree": true
  }
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "txnId": "pay_P982Kjx9128Kz_HITDON",
    "receiptNo": "HIT/80G/2026/0892",
    "date": "17 Oct 2026, 11:34 AM",
    "donorName": "Arunav Sengupta",
    "donorPan": "ABCPS8291M",
    "donorEmail": "arunav.sengupta@techindia.org",
    "donorPhone": "+91 98301-54321",
    "donorAddress": "Sector 62, Noida, Uttar Pradesh - 201301",
    "amount": 5000,
    "amountInWords": "Five Thousand Indian Rupees Only",
    "purpose": "Vocational & Digital Skill Sponsorship for Underprivileged Girls",
    "taxExemptionEligible": 2500,
    "orderRef": "ORD_2026_99412",
    "mode": "UPI Instant Settlement (Razorpay Webhook)",
    "bankRef": "UPI-429182903102"
  }
}
```

---

### 8.2 List Donations (Admin & Transparency)
- **Endpoint**: `GET /donations`
- **Access**: Protected (`Admin`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "totalAmount": 43500,
  "data": [
    {
      "txnId": "pay_P982Kjx9128Kz_HITDON",
      "receiptNo": "HIT/80G/2026/0892",
      "donorName": "Arunav Sengupta",
      "amount": 5000,
      "date": "17 Oct 2026, 11:34 AM",
      "taxExemptionEligible": 2500
    }
  ]
}
```

---

## 9. Foundation Membership

### 9.1 Register Membership
- **Endpoint**: `POST /memberships`
- **Access**: Public
- **Description**: Registers life, patron, annual, or volunteer member and issues digital card.

#### Request Body
```json
{
  "fullName": "Dr. Alok Nath Tripathi",
  "phone": "+91 94152-88192",
  "email": "dr.aloktripathi@gmail.com",
  "occupation": "Professor of Computer Science & Social Worker",
  "address": "Civil Lines, Mau, Uttar Pradesh - 275101",
  "membershipTier": "Life Member (₹2,500)",
  "declaration": true
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "memberId": "HIT-MEM-2026-4821",
  "message": "Congratulations! Membership confirmed. ID: HIT-MEM-2026-4821",
  "data": {
    "memberId": "HIT-MEM-2026-4821",
    "fullName": "Dr. Alok Nath Tripathi",
    "tier": "Life Member",
    "fee": 2500,
    "issueDate": "19/10/2026",
    "status": "Active Lifetime Member"
  }
}
```

---

## 10. Financial Expenses Transparency Ledger

### 10.1 List Public Institutional Expenses
- **Endpoint**: `GET /expenses`
- **Access**: Public / Protected

#### Response (`200 OK`)
```json
{
  "success": true,
  "totalExpenses": 198350,
  "data": [
    {
      "id": "EXP-2026-001",
      "title": "10 New Core-i5 Computer Systems with SSDs",
      "category": "Hardware & Lab Equipment",
      "amount": 85000,
      "date": "12 Oct 2026",
      "vendor": "Shree Ganesh Computers, Varanasi",
      "invoiceNo": "INV-SGC-4481",
      "status": "Verified & Settled",
      "approvedBy": "Treasurer / Director"
    }
  ]
}
```

---

### 10.2 Add New Expense (Admin)
- **Endpoint**: `POST /expenses`
- **Access**: Protected (`Admin`)

#### Request Body
```json
{
  "title": "Fiber Optic High Speed Internet (Annual Lease)",
  "category": "Internet & Networking",
  "amount": 14500,
  "vendor": "Bharti Airtel Enterprise",
  "date": "19/10/2026",
  "invoiceNo": "INV-AIR-8821"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Expense entry recorded into audited ledger",
  "data": {
    "id": "EXP-2026-492",
    "title": "Fiber Optic High Speed Internet (Annual Lease)",
    "amount": 14500,
    "status": "Verified & Settled"
  }
}
```

---

### 10.3 Delete Expense (Admin)
- **Endpoint**: `DELETE /expenses/:id`
- **Access**: Protected (`Admin`)

---

## 11. Gallery & Institutional Events

### 11.1 Get Gallery Items
- **Endpoint**: `GET /gallery`
- **Access**: Public
- **Query Parameters**:
  - `category` (optional, e.g. `felicitations`, `leadership`, `infrastructure`, `events`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "title": "Annual Student Achievement & Course Completion Award",
      "category": "felicitations",
      "location": "Ghosi Main Campus Auditorium",
      "date": "Convocation 2026",
      "badge": "Merit Award",
      "img": "https://api.hitindia.org/uploads/gallery/award.jpeg",
      "desc": "Female scholar receiving certificate of merit and honors award hamper from the Centre Director.",
      "gps": "Ghosi Lab A Venue"
    }
  ]
}
```

---

### 11.2 Add Gallery Item (Admin)
- **Endpoint**: `POST /gallery`
- **Access**: Protected (`Admin`)
- **Headers**: `multipart/form-data` or `application/json`

#### Request Body
```json
{
  "title": "Independence Day Digital Literacy Workshop",
  "category": "events",
  "location": "Ghosi Central Campus",
  "date": "August 2026",
  "badge": "Community Event",
  "desc": "Free computer awareness session for rural youth and distribution of scholarships.",
  "img": "https://images.unsplash.com/photo-..."
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Gallery item added successfully",
  "data": { "id": 18, "title": "Independence Day Digital Literacy Workshop" }
}
```

---

### 11.3 Delete Gallery Item (Admin)
- **Endpoint**: `DELETE /gallery/:id`
- **Access**: Protected (`Admin`)

---

## 12. Complete Postman / Insomnia Summary Matrix

| Method | Endpoint | Description | Role / Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/admin/login` | Super Admin login | Public |
| `POST` | `/auth/student/login` | Student portal roll/email login | Public |
| `GET` | `/admin/stats` | Dashboard KPI tiles | Admin |
| `POST` | `/admissions` | Submit student admission & pay ₹100 | Public |
| `GET` | `/admissions` | Filter & paginate admissions | Admin |
| `PATCH` | `/admissions/:id/status` | Approve or reject admission | Admin |
| `GET` | `/students` | List enrolled students | Admin |
| `GET` | `/students/:rollNo` | Get student dossier | Public/Student |
| `GET` | `/students/:rollNo/id-card` | Download official PVC ID card | Public/Student |
| `GET` | `/verification/:identifier` | Verify certificate / roll on central ledger | Public |
| `GET` | `/courses` | List vocational computer courses | Public |
| `POST` | `/courses` | Add new course | Admin |
| `PUT` | `/courses/:id` | Edit course | Admin |
| `DELETE` | `/courses/:id` | Delete course | Admin |
| `GET` | `/courses/university-programs` | List degree & distance courses | Public |
| `POST` | `/courses/inquiry` | Request counseling call | Public |
| `GET` | `/centres` | List affiliated training centres | Public |
| `POST` | `/centres/franchise-apply` | Apply for centre franchise | Public |
| `POST` | `/donations/process` | Process donation & issue 80G receipt | Public |
| `GET` | `/donations` | List donation records | Admin |
| `POST` | `/memberships` | Register foundation member | Public |
| `GET` | `/expenses` | List audited financial expenses | Public/Admin |
| `POST` | `/expenses` | Record audited expense | Admin |
| `DELETE` | `/expenses/:id` | Void expense entry | Admin |
| `GET` | `/gallery` | List media gallery items | Public |
| `POST` | `/gallery` | Upload photo & description | Admin |
| `DELETE` | `/gallery/:id` | Delete photo | Admin |
