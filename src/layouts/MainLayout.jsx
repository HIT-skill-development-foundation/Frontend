import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlobalLoader from '../components/common/GlobalLoader';

export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top automatically whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface selection:bg-secondary/20 selection:text-primary">
      {/* Global Progress and Loader */}
      <GlobalLoader />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Routed Page Content with offset for fixed top nav */}
      <main className="flex-1 pt-24 sm:pt-28">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
