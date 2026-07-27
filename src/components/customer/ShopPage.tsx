import React, { useState } from 'react';
import { ShoppingCart, Star, ShieldCheck, Sparkles, RefreshCw, Zap, Tag, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types';
import { ProductDetailsModal } from './ProductDetailsModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';

interface ShopPageProps {
  isCartOpen: boolean;
  onCloseCart: () => void;
  onProceedCheckout: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ isCartOpen, onCloseCart, onProceedCheckout }) => {
  const { products, activeCategory, setActiveCategory, searchQuery, addToCart, cart, seedDemoProducts } = useStore();

  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const categoryIcons = [
    { name: 'All', icon: '🛍️' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Wearables', icon: '⌚' },
    { name: 'Accessories', icon: '🎧' },
    { name: 'Home & Living', icon: '🏠' },
    { name: 'Beauty', icon: '💄' },
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesCat = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch && product.isAvailable;
    })
    .sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'rating') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    onProceedCheckout();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Flipkart Style Top Category Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between min-w-max space-x-6 sm:space-x-8">
          {categoryIcons.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center space-y-1.5 transition-all cursor-pointer group ${
                activeCategory === cat.name ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md border transition-all ${
                  activeCategory === cat.name
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-200 group-hover:bg-slate-750'
                }`}
              >
                {cat.icon}
              </div>
              <span
                className={`text-xs font-bold ${
                  activeCategory === cat.name ? 'text-indigo-400 font-extrabold' : 'text-slate-300'
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Flipkart / Amazon Promotional Deal Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="bg-black/30 text-amber-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-300/30 inline-block mb-1">
            ⚡ BIG VIBE SALE • LIVE NOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">Up to 70% OFF on Top Brand Products</h2>
          <p className="text-xs text-amber-100">Free Express Delivery on all orders above ₹499!</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold bg-white/20 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/30">
            Use Code: <strong>VIBE70</strong>
          </span>
        </div>
      </div>

      {/* Control Bar (Filter / Sort / Product Count) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">
            {activeCategory === 'All' ? 'All Products' : `${activeCategory} Store`} ({filteredProducts.length})
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort By:</span>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="featured">Featured / Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {products.length === 0 && (
            <button
              onClick={seedDemoProducts}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Sample Store Products</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid (Flipkart / Amazon Style Cards) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
          <Tag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Products in This Category</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Click below to load sample store products with Flipkart & Amazon style layout.
          </p>
          <button
            onClick={seedDemoProducts}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            ⚡ Load Sample Store Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inCartItem = cart.find((item) => item.product.id === product.id);
            const discountPercent =
              product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

            return (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 flex flex-col justify-between group relative"
              >
                {/* Product Image & Badges */}
                <div
                  className="relative aspect-square overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                    }}
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {discountPercent > 0 && (
                      <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        {discountPercent}% OFF
                      </span>
                    )}
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 inline" />
                      <span>Vibe Assured</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-indigo-400">{product.category}</span>
                      <span className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        4.7 (1.2k)
                      </span>
                    </div>

                    <h4
                      onClick={() => setSelectedProduct(product)}
                      className="font-bold text-white text-base line-clamp-1 group-hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.description || 'Verified product cataloged for Vibe Store buyers.'}
                    </p>

                    <div className="mt-2 flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold">
                      <Zap className="w-3 h-3" />
                      <span>Free Delivery by Tomorrow</span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-3 mt-3 border-t border-slate-800">
                    <div className="flex items-baseline space-x-2 mb-3">
                      <span className="text-xl font-black text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                          inCartItem
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {inCartItem ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added ({inCartItem.quantity})</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleBuyNow(product)}
                        className="py-2 px-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={onCloseCart}
        onProceedToCheckout={onProceedCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => setIsCheckoutOpen(false)}
      />

    </div>
  );
};
