import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Headphones, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-900">
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Express Delivery</h4>
              <p className="text-xs text-slate-400">All India shipping with live tracking</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Quality Guaranteed</h4>
              <p className="text-xs text-slate-400">100% verified products & easy returns</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Checkout</h4>
              <p className="text-xs text-slate-400">UPI, COD, Credit/Debit card support</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Dedicated Support</h4>
              <p className="text-xs text-slate-400">Direct customer service helpline</p>
            </div>
          </div>
        </div>

        {/* Footer main body */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">VIBE STORE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Vibe Store is your premier online shopping destination for top quality products with instant delivery and secure payment options.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#catalog-section" className="hover:text-indigo-400 transition-colors">All Store Products</a></li>
              <li><a href="#orders" className="hover:text-indigo-400 transition-colors">Track My Orders</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Customer Support</h4>
            <p className="text-xs text-slate-400 mb-1">Email: support@vibestore.com</p>
            <p className="text-xs text-slate-400 mb-1">Phone: +91 98765 43210</p>
            <p className="text-xs text-slate-400 mb-3">Location: Kerala, India</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              🟢 Store Open & Accepting Orders
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Vibe Store. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
