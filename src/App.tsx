import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginForm } from './components/auth/LoginForm';
import { HomePage } from './components/customer/HomePage';
import { ShopPage } from './components/customer/ShopPage';
import { AdminPage } from './pages/AdminPage';
import { OrderHistoryModal } from './components/customer/OrderHistoryModal';
import { CustomerProfileModal } from './components/customer/CustomerProfileModal';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'shop' | 'orders' | 'admin'>(() => {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.startsWith('admin.') || hostname.includes('admin')) {
      return 'admin';
    }
    return 'home';
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Page Body View */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HomePage onShopNowClick={() => setCurrentTab('shop')} />
        )}

        {currentTab === 'shop' && (
          <ShopPage
            isCartOpen={isCartOpen}
            onCloseCart={() => setIsCartOpen(false)}
            onProceedCheckout={() => {
              setIsCartOpen(false);
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage onSwitchToStore={() => setCurrentTab('shop')} />
        )}

        {currentTab === 'orders' && (
          <OrderHistoryModal onBackToStore={() => setCurrentTab('shop')} />
        )}
      </main>

      {/* Shared Footer */}
      <Footer />

      {/* Login / Auth Modal */}
      <LoginForm
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Customer Profile Hub Modal */}
      <CustomerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <MainAppContent />
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
