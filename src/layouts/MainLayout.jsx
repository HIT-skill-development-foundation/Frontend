import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlobalLoader from '../components/common/GlobalLoader';

export default function MainLayout() {
  const { pathname } = useLocation();

  const isAdmin = pathname.startsWith('/admin');

  // Scroll to top automatically whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  if (isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#1C1917] antialiased">
        <GlobalLoader />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface selection:bg-secondary/20 selection:text-primary">
      {/* Global Progress and Loader */}
      <GlobalLoader />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Routed Page Content flush under sticky top nav */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
