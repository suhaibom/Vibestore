import React from 'react';
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Zap, Truck, Star, Award, TrendingUp } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HomePageProps {
  onShopNowClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onShopNowClick }) => {
  const { products, addToCart } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      
      {/* High-Impact Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/90 to-purple-950 border border-slate-800 p-8 sm:p-14 shadow-2xl">
        
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full hero-badge-dark text-xs font-bold mb-6 border">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>WELCOME TO VIBE STORE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black hero-title-dark tracking-tight leading-tight mb-6">
            Your Ultimate <br />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
              Shopping Destination
            </span>
          </h1>

          <p className="text-base sm:text-lg hero-desc-dark mb-8 leading-relaxed font-medium">
            Discover thousands of top quality items with unbeatable deals, express nationwide shipping, and 100% buyer protection.
          </p>

          {/* SHOP NOW PRIMARY CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onShopNowClick}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/40 hover:scale-105 transition-all text-base flex items-center space-x-3 group cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
              <span className="btn-gradient-text">SHOP NOW</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center space-x-4 text-xs font-semibold hero-subtext-dark">
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="hero-subtext-dark">Express Delivery</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="hero-subtext-dark">Verified Seller</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-4 shadow-lg">
          <div className="p-3.5 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Free Express Shipping</h4>
            <p className="text-xs text-slate-400">On all orders over ₹499</p>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-4 shadow-lg">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Vibe Assured Quality</h4>
            <p className="text-xs text-slate-400">100% original products</p>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-4 shadow-lg">
          <div className="p-3.5 bg-purple-500/10 text-purple-500 rounded-xl shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Easy 7-Day Returns</h4>
            <p className="text-xs text-slate-400">No questions asked policy</p>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-4 shadow-lg">
          <div className="p-3.5 bg-pink-500/10 text-pink-500 rounded-xl shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Instant Checkout</h4>
            <p className="text-xs text-slate-400">UPI, COD, Cards supported</p>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      {featuredProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-indigo-500" />
                <span>Trending Deals & Best Sellers</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Handpicked top deals available right now</p>
            </div>
            <button
              onClick={onShopNowClick}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Shop Items</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl transition flex flex-col justify-between"
              >
                <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover bg-slate-950" />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>4.8 | Vibe Choice</span>
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{prod.name}</h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-base font-black text-white">₹{prod.price.toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-black hero-title-dark">Ready to Start Shopping?</h3>
        <p className="text-xs hero-desc-dark max-w-lg mx-auto">
          Explore our complete e-commerce store with Flipkart & Amazon style layout, category filters, and daily flash sales.
        </p>
        <button
          onClick={onShopNowClick}
          className="px-8 py-3.5 bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-slate-100 transition text-sm inline-flex items-center space-x-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-indigo-600" />
          <span>GO TO SHOP STORE</span>
        </button>
      </section>

    </div>
  );
};
