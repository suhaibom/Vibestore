import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Shield,
  Gift,
  HelpCircle,
  LogOut,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  Sparkles,
  Wallet,
  Smartphone,
  ChevronRight,
  Share2,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import type { SavedAddress, Order } from '../../types';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType =
  | 'overview'
  | 'personal'
  | 'orders'
  | 'addresses'
  | 'wallet'
  | 'wishlist'
  | 'rewards'
  | 'security'
  | 'support';

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
];

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const { orders, products, addToCart } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Form states for Personal Info
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATARS[0]);

  // Form states for Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(user?.savedAddresses || [
    {
      id: 'addr_1',
      label: 'Home',
      name: user?.name || 'Vibe Customer',
      phone: user?.phone || '+91 98765 43210',
      street: '123 Vibe Plaza, Marine Drive',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682031',
      isDefault: true,
    },
    {
      id: 'addr_2',
      label: 'Work',
      name: user?.name || 'Vibe Customer',
      phone: user?.phone || '+91 98765 43210',
      street: 'Tech Park, Infopark Phase 1',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682042',
      isDefault: false,
    }
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<SavedAddress>>({
    label: 'Home',
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: 'Kerala',
    pincode: '',
  });

  // Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(user?.walletBalance || 500);

  // Success / Info Message Banner
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const userOrders = orders.filter((o) => o.customerEmail.toLowerCase() === user.email.toLowerCase());
  const activeOrders = userOrders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      avatar: selectedAvatar,
      savedAddresses,
    });
    showMsg('✅ Profile information updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showMsg('Password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showMsg('New passwords do not match.', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showMsg('✅ Password updated successfully!');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.pincode) {
      showMsg('Please fill in all address fields.', 'error');
      return;
    }
    const addrObj: SavedAddress = {
      id: 'addr_' + Date.now(),
      label: newAddress.label as 'Home' | 'Work' | 'Other',
      name: newAddress.name || name,
      phone: newAddress.phone || phone,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state || 'Kerala',
      pincode: newAddress.pincode,
      isDefault: savedAddresses.length === 0,
    };
    const updated = [...savedAddresses, addrObj];
    setSavedAddresses(updated);
    updateProfile({ savedAddresses: updated });
    setShowAddressForm(false);
    showMsg('✅ New delivery address added!');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    updateProfile({ savedAddresses: updated });
    showMsg('Address removed.');
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setSavedAddresses(updated);
    updateProfile({ savedAddresses: updated });
    showMsg('Default address updated.');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const foundProduct = products.find((p) => p.id === item.productId);
      if (foundProduct) {
        addToCart(foundProduct);
      }
    });
    showMsg('🛍️ Order items added to your shopping cart!');
  };

  const handlePrintInvoice = (order: Order) => {
    showMsg(`🖨️ Generating invoice for Order #${order.orderNumber}...`);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[750px] shadow-2xl relative text-slate-100 flex flex-col md:flex-row overflow-hidden">

        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 bg-slate-950/80 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
          <div>
            {/* User Avatar Mini Profile */}
            <div className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-800/90 rounded-2xl mb-6 shadow-sm">
              <img
                src={selectedAvatar}
                alt={user.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/50 shadow-md shrink-0"
              />
              <div className="overflow-hidden">
                <h3 className="font-extrabold text-sm text-white truncate">{user.name}</h3>
                <p className="text-[11px] text-indigo-400 truncate">{user.email}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 bg-indigo-950 border border-indigo-800/60 rounded-full text-[9px] font-bold text-indigo-300 capitalize">
                  {user.role} Member
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 overflow-y-auto max-h-[420px] pr-1 custom-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'personal'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Personal Info</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-4 h-4" />
                  <span>Orders & Tracking</span>
                </div>
                {activeOrders.length > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full text-[10px]">
                    {activeOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Wallet className="w-4 h-4" />
                  <span>Store Wallet</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-extrabold">₹{walletBalance}</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </button>

              <button
                onClick={() => setActiveTab('rewards')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'rewards'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Gift className="w-4 h-4 text-pink-400" />
                <span>Offers & Referrals</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security & Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('support')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Support & Help</span>
              </button>
            </nav>
          </div>

          {/* Logout Action at Bottom */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 hover:text-rose-100 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Account</span>
            </button>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar">

          {/* Banner notification alert */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-2xl text-xs font-medium border flex items-center space-x-2 animate-fadeIn ${
                message.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-800 text-rose-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Greeting */}
              <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/60 border border-indigo-800/50 rounded-3xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-extrabold tracking-wide uppercase">
                    Customer Account Hub
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                    Welcome back, {user.name}! 👋
                  </h1>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg">
                    Manage your orders, saved addresses, wallet balance, and security settings from your personal dashboard.
                  </p>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('orders')}
                  className="bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 p-4 rounded-2xl transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold">Total Orders</p>
                  <p className="text-xl font-black text-white mt-0.5">{userOrders.length}</p>
                </div>

                <div
                  onClick={() => setActiveTab('wallet')}
                  className="bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 p-4 rounded-2xl transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold">Store Wallet</p>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">₹{walletBalance}</p>
                </div>

                <div
                  onClick={() => setActiveTab('wishlist')}
                  className="bg-slate-800/60 border border-slate-700/60 hover:border-pink-500/50 p-4 rounded-2xl transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold">Wishlist Items</p>
                  <p className="text-xl font-black text-white mt-0.5">4 Products</p>
                </div>

                <div
                  onClick={() => setActiveTab('addresses')}
                  className="bg-slate-800/60 border border-slate-700/60 hover:border-amber-500/50 p-4 rounded-2xl transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold">Saved Addresses</p>
                  <p className="text-xl font-black text-white mt-0.5">{savedAddresses.length}</p>
                </div>
              </div>

              {/* Active Order Card */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>Recent Order Tracking</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                  >
                    <span>View All Orders</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {userOrders.length > 0 ? (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Order #{userOrders[0].orderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                        {userOrders[0].orderStatus}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-2">
                      <div className="flex mb-2 items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span className="text-emerald-400 font-bold">Ordered</span>
                        <span className="text-indigo-400 font-bold">Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-800">
                        <div className="w-1/2 bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full animate-pulse" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="text-slate-400">Total: <strong className="text-white">₹{userOrders[0].total}</strong></span>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition text-xs"
                      >
                        Track Shipment Live
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No active orders yet. Start shopping now!</p>
                )}
              </div>
            </div>
          )}

          {/* 2. PERSONAL INFO TAB */}
          {activeTab === 'personal' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-extrabold text-white">Personal Information</h2>
                <p className="text-xs text-slate-400 mt-0.5">Update your contact details and select your avatar</p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Profile Avatar</label>
                <div className="flex space-x-3">
                  {AVATARS.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="Avatar Option"
                      onClick={() => setSelectedAvatar(imgUrl)}
                      className={`w-12 h-12 rounded-2xl object-cover cursor-pointer transition border-2 ${
                        selectedAvatar === imgUrl ? 'border-indigo-500 scale-105 shadow-lg shadow-indigo-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm mt-4 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* 3. ORDERS & TRACKING TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Orders & Live Tracking</h2>
                <p className="text-xs text-slate-400 mt-0.5">Track your active deliveries and review purchase history</p>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-3xl border border-slate-800">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-300">No orders placed yet</p>
                  <p className="text-xs text-slate-500 mt-1">Explore our shop and place your first order!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="bg-slate-800/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs text-slate-400">Order ID:</span>
                          <span className="text-sm font-extrabold text-white ml-2">#{order.orderNumber}</span>
                          <span className="text-xs text-slate-500 ml-3">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-xs font-bold capitalize">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Purchased Items List */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                              <div>
                                <p className="font-bold text-slate-200">{item.productName}</p>
                                <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                              </div>
                            </div>
                            <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                        <div>
                          <span className="text-xs text-slate-400">Total Amount: </span>
                          <span className="text-sm font-extrabold text-emerald-400">₹{order.total}</span>
                          <span className="text-[11px] text-slate-500 uppercase ml-2">({order.paymentMethod})</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>

                          <button
                            onClick={() => handleReorder(order)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Buy Again</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. SAVED ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Saved Delivery Addresses</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage your shipping destinations for fast checkout</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl space-y-3 animate-fadeIn">
                  <h3 className="text-sm font-bold text-white mb-2">New Address Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Label (Home/Work/Office)"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Recipient Full Name"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Street Address, House No, Landmark"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-[10px] font-bold">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                          Default Address
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-white">{addr.name}</h4>
                    <p className="text-xs text-slate-300">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-xs text-slate-400">Phone: {addr.phone}</p>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] text-indigo-400 hover:underline font-semibold cursor-pointer"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. WALLET & PAYMENTS TAB */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Store Wallet & Payment Options</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage store cash balance and saved UPI / cards</p>
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-700/50 p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-emerald-300">Vibe Store Cash Balance</p>
                  <h3 className="text-3xl font-black text-white mt-1">₹{walletBalance}.00</h3>
                  <p className="text-[11px] text-emerald-200 mt-1">Use for 1-click checkout & instant refunds</p>
                </div>
                <button
                  onClick={() => {
                    setWalletBalance(walletBalance + 500);
                    showMsg('✅ Added ₹500 store cash to your wallet!');
                  }}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer"
                >
                  + Top Up Wallet
                </button>
              </div>

              {/* Transaction Logs */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Wallet History</h3>
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Promotional Cashback Received</span>
                    <span className="text-emerald-400 font-bold">+₹200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Refund Approved for Order #VB-9812</span>
                    <span className="text-emerald-400 font-bold">+₹300.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">My Wishlist & Saved Products</h2>
                <p className="text-xs text-slate-400 mt-0.5">Your favorite items saved for later purchase</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex space-x-3 items-center">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-slate-900" />
                    <div className="flex-1">
                      <h4 className="font-bold text-xs text-white line-clamp-1">{product.name}</h4>
                      <p className="text-xs font-extrabold text-emerald-400 mt-0.5">₹{product.price}</p>
                      <button
                        onClick={() => {
                          addToCart(product);
                          showMsg(`Added ${product.name} to cart!`);
                        }}
                        className="mt-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. REWARDS & REFERRALS TAB */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Coupons & Referral Rewards</h2>
                <p className="text-xs text-slate-400 mt-0.5">Claim discounts and invite friends to earn store cash</p>
              </div>

              {/* Coupons Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Available Coupons</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-800/60 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider">70% OFF SALE</span>
                      <h4 className="font-mono font-extrabold text-lg text-white">VIBE70</h4>
                    </div>
                    <button
                      onClick={() => handleCopy('VIBE70')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {copiedCoupon === 'VIBE70' ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-800/60 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">FREE EXPRESS SHIPPING</span>
                      <h4 className="font-mono font-extrabold text-lg text-white">FREESHIP</h4>
                    </div>
                    <button
                      onClick={() => handleCopy('FREESHIP')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {copiedCoupon === 'FREESHIP' ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Refer & Earn Banner */}
              <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-pink-400" />
                  <h3 className="text-sm font-extrabold text-white">Refer Friends & Earn ₹250</h3>
                </div>
                <p className="text-xs text-slate-300">Share your custom referral code. Get ₹250 store cash when they complete their first order!</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://vibestore.bond/ref/${user.name.toLowerCase().replace(/\s+/g, '')}`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-indigo-300 font-mono"
                  />
                  <button
                    onClick={() => handleCopy(`https://vibestore.bond/ref/${user.name.toLowerCase().replace(/\s+/g, '')}`)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 8. SECURITY & SETTINGS TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-extrabold text-white">Security & Notification Preferences</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage your account password and active login sessions</p>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span>Change Account Password</span>
                </h3>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <input
                  type="password"
                  placeholder="New Password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Update Password
                </button>
              </form>

              {/* Active Sessions */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Login Sessions</h3>
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Chrome on Windows 11 (Current Device)</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">Active Now • Kochi, India</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-bold">This Session</span>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Notifications</h3>
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-200">Email Promotional Offers</span>
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={() => setEmailNotifs(!emailNotifs)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-200">SMS Order Updates</span>
                    <input
                      type="checkbox"
                      checked={smsNotifs}
                      onChange={() => setSmsNotifs(!smsNotifs)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. SUPPORT & HELP TAB */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Help & Customer Support</h2>
                <p className="text-xs text-slate-400 mt-0.5">Need assistance with your orders or account? We are here 24/7</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <Mail className="w-6 h-6 text-indigo-400" />
                  <h4 className="font-bold text-sm text-white">Email Support</h4>
                  <p className="text-xs text-slate-400">Send an email to support@vibestore.bond for order queries.</p>
                  <button
                    onClick={() => showMsg('Support ticket opened! We will email you shortly.')}
                    className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Contact Support
                  </button>
                </div>

                <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <Phone className="w-6 h-6 text-emerald-400" />
                  <h4 className="font-bold text-sm text-white">WhatsApp Helpline</h4>
                  <p className="text-xs text-slate-400">Instant chat assistance for delivery status & exchanges.</p>
                  <button
                    onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                    className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
