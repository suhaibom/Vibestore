import React, { useState } from 'react';
import { X, ShoppingBag, Truck, ShieldCheck, Star, Plus, Minus, Check } from 'lucide-react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-slate-100 max-h-[90vh] flex flex-col md:flex-row">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/80 border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800 relative">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-80 w-full object-contain rounded-2xl"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 fill-slate-950 inline" />
              <span>Featured Choice</span>
            </span>
          )}
        </div>

        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-bold inline-block mb-3">
              {product.category}
            </span>

            <h2 className="text-2xl font-extrabold text-white mb-2">{product.name}</h2>

            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-2xl font-black text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {product.description || 'Exclusive product carefully cataloged for Vibe Store buyers.'}
            </p>

            <div className="space-y-2 text-xs text-slate-400 mb-6 border-t border-b border-slate-800 py-4">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-indigo-400" />
                <span>Standard Delivery in 2-4 business days</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Quality & Safe Packaging</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-300">Quantity</span>
              <div className="flex items-center space-x-3 bg-slate-800 border border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 ${
                addedNotice
                  ? 'bg-emerald-600 text-white'
                  : product.stock <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
