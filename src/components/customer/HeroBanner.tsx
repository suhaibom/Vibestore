import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const { activeCategory, setActiveCategory } = useStore();

  const categories = ['All', 'Electronics', 'Fashion', 'Wearables', 'Accessories', 'Home & Living', 'Beauty'];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-slate-800 p-6 sm:p-10 lg:p-14 mb-10 shadow-2xl transition-all">
      
      {/* Background Neon Blurs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>VIBE STORE • PREMIUM E-COMMERCE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Discover Exceptional <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Products & Daily Deals
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl leading-relaxed">
          Welcome to Vibe Store! Explore high quality collections with express nationwide shipping and 100% secure payment options.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={onExploreClick}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center space-x-2 text-sm"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Checkout</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Seller</span>
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 flex items-center space-x-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter By Category</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
