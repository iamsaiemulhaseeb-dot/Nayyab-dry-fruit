import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustFeatures } from './components/TrustFeatures';
import { FeaturedSlider } from './components/FeaturedSlider';
import { ProductCatalog } from './components/ProductCatalog';
import { StoreLocation } from './components/StoreLocation';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HealthGuide } from './components/HealthGuide';
import { Reviews } from './components/Reviews';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { FloatingActions } from './components/FloatingActions';
import { ToastContainer } from './components/ToastContainer';
import { AdminDashboard } from './components/AdminDashboard';
import { GiftBoxSection } from './components/GiftBoxBuilder';
import { OrderTracking } from './components/OrderTracking';
import { AdminLoginPage, isSessionValid, clearSession } from './components/AdminLoginPage';

/* ── helper: which path are we on? ── */
const isPath = (p) => window.location.pathname === p || window.location.hash === '#' + p.replace(/^\//, '') || window.location.hash === '#/' + p.replace(/^\//, '');

export function App() {
  /* ── view state ── */
  const getView = () => {
    const p = window.location.pathname;
    const h = window.location.hash;
    if (p === '/admin/login' || h === '#admin/login' || h === '#/admin/login') return 'admin-login';
    if (p === '/admin'       || h === '#admin'       || h === '#/admin')       return 'admin';
    if (p === '/track-order' || h === '#track-order')                           return 'tracking';
    return 'store';
  };

  const [view, setView] = useState(getView);

  useEffect(() => {
    const handleRouteChange = () => setView(getView());
    window.addEventListener('popstate',   handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate',   handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  /* ── navigation helpers ── */
  const push = (path) => {
    window.history.pushState({}, '', path);
    setView(getView());
  };

  const navigateToStore       = () => push('/');
  const navigateToAdmin       = () => push('/admin');
  const navigateToAdminLogin  = () => push('/admin/login');
  const navigateToTracking    = () => push('/track-order');

  /* ── logout: clear session and go to login page ── */
  const handleAdminLogout = () => {
    clearSession();
    navigateToAdminLogin();
  };

  /* ── routing ── */

  // /admin/login
  if (view === 'admin-login') {
    return (
      <AdminLoginPage
        onLoginSuccess={navigateToAdmin}
        onBackToStore={navigateToStore}
      />
    );
  }

  // /admin — gate: redirect to /admin/login if not authenticated
  if (view === 'admin') {
    if (!isSessionValid()) {
      // Lazy redirect on next tick so React has committed the current render
      setTimeout(() => { window.history.replaceState({}, '', '/admin/login'); setView('admin-login'); }, 0);
      return null;
    }
    return <AdminDashboard onBackToStore={navigateToStore} onLogout={handleAdminLogout} />;
  }

  // /track-order
  if (view === 'tracking') {
    return <OrderTracking onBack={navigateToStore} />;
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-amber-200 selection:text-amber-950 overflow-x-hidden w-full max-w-full relative">
        <Navbar onOpenAdmin={navigateToAdmin} onOpenTracking={navigateToTracking} />
        <main className="flex-1">
          <Hero />
          <TrustFeatures />
          <FeaturedSlider />
          <ProductCatalog />
          <GiftBoxSection />
          <StoreLocation />
          <WhyChooseUs />
          <HealthGuide />
          <Reviews />
          <FAQ />
        </main>
        <Footer onOpenAdmin={navigateToAdmin} />

        {/* Overlays & Modals */}
        <CartDrawer />
        <CheckoutModal />
        <QuickViewModal />
        <OrderSuccessModal />
        <FloatingActions />
        <ToastContainer />
      </div>
    </CartProvider>
  );
}

export default App;
