import React from 'react';
import { ShoppingBag, User as UserIcon, LogOut, Search, PackageCheck, Home, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { ThemeSelector } from './ThemeSelector';

interface NavbarProps {
  currentTab: 'home' | 'shop' | 'orders' | 'admin';
  onTabChange: (tab: 'home' | 'shop' | 'orders' | 'admin') => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenCart,
  onOpenAuth,
}) => {
  const { user, logout } = useAuth();
  const { cartCount, searchQuery, setSearchQuery } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('home')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                VIBE<span className="text-indigo-500">STORE</span>
              </span>
              <span className="hidden sm:block text-xs text-indigo-400 font-medium tracking-wide">
                Commercial E-Commerce Store
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => onTabChange('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
                currentTab === 'home'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onTabChange('shop')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
                currentTab === 'shop'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Shop Store</span>
            </button>

            {/* Admin Dashboard Navigation Tab */}
            <button
              onClick={() => onTabChange('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
                currentTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          </div>

          {/* Search bar (Shop mode) */}
          {currentTab === 'shop' && (
            <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>
          )}

          {/* Nav Actions */}
          <div className="flex items-center space-x-3">
            
            {/* White / Dark Mode Toggle */}
            <ThemeSelector />

            {/* Orders History Link */}
            {user && (
              <button
                onClick={() => onTabChange('orders')}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                  currentTab === 'orders' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-300 hover:bg-slate-800'
                }`}
                title="My Orders"
              >
                <PackageCheck className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">My Orders</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl transition-all shadow-inner group"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="hidden xl:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-200">{user.name}</span>
                  <span className="text-[10px] text-indigo-400 capitalize font-medium">
                    {user.role} ({user.email})
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 bg-slate-800/80 hover:bg-rose-900/30 hover:border-rose-500/50 border border-slate-700 text-slate-400 hover:text-rose-300 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
