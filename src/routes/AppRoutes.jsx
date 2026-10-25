import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const HomePage = lazy(() => import('../pages/HomePage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const CoursesOfferPage = lazy(() => import('../pages/CoursesOfferPage'));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage'));
const StudentPortalPage = lazy(() => import('../pages/StudentPortalPage'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const DonationPage = lazy(() => import('../pages/DonationPage'));
const BecomeMemberPage = lazy(() => import('../pages/BecomeMemberPage'));

const AdmissionPage = lazy(() => import('../pages/AdmissionPage'));
const VerificationPage = lazy(() => import('../pages/VerificationPage'));
const DonationReceiptPage = lazy(() => import('../pages/DonationReceiptPage'));

function RouteSuspenseFallback() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
        Loading View...
      </span>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteSuspenseFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<HomePage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="courses" element={<CoursesOfferPage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="student-portal" element={<StudentPortalPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="donation" element={<DonationPage />} />
          <Route path="become-member" element={<BecomeMemberPage />} />

          
          <Route path="admission" element={<AdmissionPage />} />
          <Route path="verification" element={<VerificationPage />} />
          <Route path="receipt" element={<DonationReceiptPage />} />
          <Route path="student_portal" element={<Navigate to="/student-portal" replace />} />
          <Route path="admin-portal" element={<Navigate to="/admin" replace />} />

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
