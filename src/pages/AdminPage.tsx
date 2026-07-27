import React, { useState, useEffect } from 'react';
import { Layers, Eye, Package, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { ProductManager } from '../components/admin/ProductManager';
import { VisitorAnalytics } from '../components/admin/VisitorAnalytics';
import { OrderManager } from '../components/admin/OrderManager';

export const AdminPage: React.FC<{
  onSwitchToStore: () => void;
  onOpenAuth?: () => void;
}> = ({ onSwitchToStore, onOpenAuth }) => {
  const { user, isAdmin, logout, quickLogin } = useAuth();
  const { recordVisit } = useStore();
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');

  useEffect(() => {
    recordVisit('Admin Control Panel');
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">VibeStore Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Store Admin authentication required to access visitor analytics, products, and order management.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => quickLogin('admin')}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>⚡ Quick Admin Login (1-Click Access)</span>
            </button>

            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                🔐 Login via Email OTP
              </button>
            )}

            <button
              onClick={onSwitchToStore}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
            >
              🌐 Return to Main Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onSwitchToStore}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>View Storefront</span>
              </button>

              <span className="hidden sm:inline text-sm font-black text-white tracking-wider border-l border-slate-800 pl-3">
                VIBE STORE ADMIN
              </span>
            </div>

            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Customer Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Products Catalog</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Sales Orders</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="hidden md:inline text-xs font-semibold text-slate-300">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'analytics' && <VisitorAnalytics />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'orders' && <OrderManager />}
      </main>

    </div>
  );
};
