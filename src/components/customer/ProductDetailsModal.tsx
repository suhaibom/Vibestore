import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Star,
  Plus,
  Minus,
  Check,
  RotateCcw,
  MapPin,
  Sparkles,
  Zap,
  CheckCircle2,
  Tag
} from 'lucide-react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onProceedCheckout?: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onProceedCheckout,
}) => {
  const { addToCart, products } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!product) return null;

  const currentImage = selectedImage || product.image;

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 35;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (onProceedCheckout) {
      onClose();
      onProceedCheckout();
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeStatus(`✅ Delivery available for ${pincode}! Guaranteed delivery by Tomorrow, 5 PM.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Pincode.');
    }
  };

  // Similar products in same category
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fadeIn">
      <div className="dark-modal bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[780px] shadow-2xl relative text-slate-100 flex flex-col md:flex-row overflow-hidden">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950/80 border border-slate-800 transition cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN - IMAGE GALLERY & PURCHASE ACTIONS */}
        <div className="w-full md:w-1/2 bg-slate-950/90 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 relative overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-[11px] rounded-full uppercase tracking-wider shadow-md">
                ⚡ {discountPercent}% OFF DEAL
              </span>
              <span className="px-3 py-1 bg-indigo-950 border border-indigo-800/80 text-indigo-300 font-extrabold text-[11px] rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Vibe Certified Quality</span>
              </span>
            </div>

            {/* Main Image Showcase */}
            <div className="relative bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-center min-h-[260px] max-h-[320px] group overflow-hidden">
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-64 w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Gallery Angle Previews */}
            <div className="flex space-x-3 overflow-x-auto pb-1 custom-scrollbar">
              {[product.image, product.image, product.image].map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Angle ${idx + 1}`}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-14 h-14 rounded-xl object-contain p-1 bg-slate-900 border-2 cursor-pointer transition ${
                    currentImage === imgUrl ? 'border-indigo-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sticky Bottom Actions & Quantity Selector */}
          <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Select Quantity:</span>
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-700/80 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-black text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3 px-4 rounded-xl font-extrabold text-xs shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer ${
                  addedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Buy Now (Instant)</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - DETAILS, OFFERS, SPECS & REVIEWS */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto custom-scrollbar flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            {/* Category & Title */}
            <div>
              <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/50 inline-block mb-2">
                {product.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">{product.name}</h1>
              
              {/* Rating & Review Summary */}
              <div className="flex items-center space-x-3 mt-2">
                <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold rounded-lg text-xs flex items-center space-x-1">
                  <span>4.8</span>
                  <Star className="w-3 h-3 fill-white inline" />
                </span>
                <span className="text-xs text-slate-400 font-medium">1,420 Ratings & 384 Verified Reviews</span>
              </div>
            </div>

            {/* Price & Discounts Section */}
            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-emerald-400">
                  ₹{(product.price * quantity).toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-500 line-through">
                    ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-black text-rose-400 uppercase">
                  Save ₹{((product.originalPrice ? product.originalPrice - product.price : 1000) * quantity).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Inclusive of all taxes & free express shipping</p>
            </div>

            {/* Bank & Coupon Offers Card */}
            <div className="p-4 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-800/40 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-pink-400">
                <Tag className="w-4 h-4" />
                <span>Available Offers & Promotions</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300 pl-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Bank Offer:</strong> ₹100 Instant Discount on UPI & GPay</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Vibe Coupon:</strong> Use code <strong className="text-amber-400 font-mono">VIBE70</strong> for 70% OFF</span>
                </li>
              </ul>
            </div>

            {/* Pincode Delivery Checker */}
            <form onSubmit={handleCheckPincode} className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Check Delivery Pincode</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Check
                </button>
              </div>
              {pincodeStatus && (
                <p className="text-[11px] font-semibold text-emerald-400 mt-1">{pincodeStatus}</p>
              )}
            </form>

            {/* Vibe Peace of Mind Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl text-center space-y-1">
                <RotateCcw className="w-5 h-5 text-indigo-400 mx-auto" />
                <p className="text-[10px] font-bold text-slate-200">7 Days Return</p>
              </div>
              <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                <p className="text-[10px] font-bold text-slate-200">1 Year Warranty</p>
              </div>
              <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl text-center space-y-1">
                <Truck className="w-5 h-5 text-amber-400 mx-auto" />
                <p className="text-[10px] font-bold text-slate-200">Cash on Delivery</p>
              </div>
            </div>

            {/* Product Highlights & Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Product Highlights</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                {product.description || 'Premium quality product manufactured with durable materials for long-lasting performance and maximum satisfaction.'}
              </p>
            </div>

            {/* Similar Products Recommendation */}
            {similarProducts.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Similar Products</h3>
                <div className="grid grid-cols-3 gap-2">
                  {similarProducts.map((sp) => (
                    <div
                      key={sp.id}
                      onClick={() => {
                        addToCart(sp, 1);
                      }}
                      className="p-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-center cursor-pointer group"
                    >
                      <img src={sp.image} alt={sp.name} className="w-10 h-10 rounded-lg object-cover mx-auto mb-1 bg-slate-900" />
                      <p className="text-[10px] font-bold text-white line-clamp-1 group-hover:text-indigo-400">{sp.name}</p>
                      <p className="text-[10px] font-black text-emerald-400">₹{sp.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
