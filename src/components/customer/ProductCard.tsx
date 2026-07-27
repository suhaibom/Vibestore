import React from 'react';
import { ShoppingCart, Eye, Star, Check, AlertCircle } from 'lucide-react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, cart } = useStore();

  const inCartItem = cart.find((item) => item.product.id === product.id);
  const isOutOfStock = product.stock <= 0 || !product.isAvailable;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col group relative">
      
      <div className="relative aspect-square overflow-hidden bg-slate-950">
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
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
              <Star className="w-3 h-3 fill-slate-950 inline" />
              <span>Featured</span>
            </span>
          )}
        </div>

        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 right-3 p-2.5 bg-slate-900/90 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-2xl backdrop-blur-md border border-slate-700 transition shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-indigo-400 font-semibold mb-1">
            <span>{product.category}</span>
            {product.stock <= 3 && product.stock > 0 && (
              <span className="text-amber-400 font-bold">Only {product.stock} left</span>
            )}
          </div>

          <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description || 'Premium quality product available at Vibe Store.'}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-black text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : inCartItem
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {inCartItem ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart ({inCartItem.quantity})</span>
              </>
            ) : isOutOfStock ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
