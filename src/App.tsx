import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AuthPage } from './components/auth/AuthPage';
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/shop/ProductDetailPage';
import { CollectionsPage } from './components/pages/CollectionsPage';
import { NewArrivalsPage } from './components/pages/NewArrivalsPage';
import { SaleArchivePage } from './components/pages/SaleArchivePage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { FAQPage } from './components/pages/FAQPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { AccountPage } from './components/account/AccountPage';
import { OrderTrackingPage } from './components/account/OrderTrackingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/shop/QuickViewModal';
import { SearchModal } from './components/search/SearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { SplashScreen } from './components/common/SplashScreen';

const MainContent: React.FC = () => {
  const { isAuthenticated, activePage, adminUser } = useStore();

  // Authentication First requirement: if not authenticated, show Auth Page
  if (!isAuthenticated) {
    return (
      <main id="auth-main-container">
        <AuthPage />
        <ToastContainer />
      </main>
    );
  }

  // Dedicated Admin Portal Workspace: isolated from consumer storefront navigation
  if (activePage === 'admin') {
    return (
      <div id="vanta-admin-portal" className="min-h-screen flex flex-col bg-[#0A0A0C] text-zinc-100 selection:bg-zinc-200 selection:text-black">
        {!adminUser ? <AdminLogin /> : <AdminDashboard />}
        <ToastContainer />
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'collections':
        return <CollectionsPage />;
      case 'new-arrivals':
        return <NewArrivalsPage />;
      case 'sale':
        return <SaleArchivePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FAQPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'account':
      case 'wishlist':
        return <AccountPage />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div id="vanta-store-app" className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#0D0D0F] text-zinc-100 selection:bg-zinc-200 selection:text-black">
      {/* Primary Navigation */}
      <Navbar />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 lg:pb-0">
        {renderActivePage()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Quick Mobile Navigation Bar */}
      <MobileBottomNav />

      {/* Interactive Overlays & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <StoreProvider>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      <MainContent />
    </StoreProvider>
  );
}
