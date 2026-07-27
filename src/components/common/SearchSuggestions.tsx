import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Sparkles, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types';

interface SearchSuggestionsProps {
  onSelectProduct?: (product: Product) => void;
}

const POPULAR_SEARCHES = [
  'Headphones',
  'Smartwatch',
  'Hoodie',
  '4K Monitor',
  'Power Bank',
  'Bluetooth Speaker',
  'Backpack',
  'Sunset Lamp',
];

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSelectProduct }) => {
  const { searchQuery, setSearchQuery, products, addToCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const matchingProducts = products.filter((p) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const recommendedProducts = products.filter((p) => p.featured || p.price > 3000).slice(0, 4);

  const handleChipClick = (term: string) => {
    setSearchQuery(term);
    setIsOpen(true);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Input Field */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search 120+ products, categories, deals..."
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          className="w-full bg-slate-800/90 border border-slate-700/80 text-slate-100 text-xs sm:text-sm rounded-full pl-10 pr-9 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Instant Suggestions Floating Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden text-slate-100 animate-fadeIn max-h-[500px] flex flex-col">
          
          {/* CASE A: EMPTY SEARCH -> SHOW TRENDING CHIPS & RECOMMENDED PRODUCTS */}
          {!searchQuery.trim() && (
            <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
              
              {/* Popular Searches */}
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-extrabold text-indigo-400 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Trending & Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleChipClick(term)}
                      className="px-3 py-1 bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold rounded-xl border border-slate-700/80 transition cursor-pointer flex items-center space-x-1"
                    >
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Deals */}
              <div>
                <div className="flex items-center justify-between text-xs font-extrabold text-amber-400 mb-2.5">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Top Recommended Deals</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">Handpicked for you</span>
                </div>

                <div className="space-y-2">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(product);
                        setIsOpen(false);
                      }}
                      className="p-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-11 h-11 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-700/60"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {product.name}
                          </p>
                          <div className="flex items-center space-x-2 text-[11px] mt-0.5">
                            <span className="font-extrabold text-emerald-400">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="line-through text-slate-500 text-[10px]">
                                ₹{product.originalPrice}
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-slate-900 text-slate-400 rounded-full text-[9px] font-semibold uppercase">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 shrink-0 ${
                          addedItemMap[product.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30'
                        }`}
                      >
                        {addedItemMap[product.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* CASE B: ACTIVE SEARCH -> SHOW REAL-TIME MATCHING PRODUCTS */}
          {searchQuery.trim() !== '' && (
            <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300">
                  Search results for "<strong className="text-indigo-400">{searchQuery}</strong>"
                </span>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full">
                  {matchingProducts.length} items found
                </span>
              </div>

              {matchingProducts.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs font-bold text-slate-400">No products matching "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-500">Try searching for "Headphones", "Hoodie", or "Watch"</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {matchingProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(product);
                        setIsOpen(false);
                      }}
                      className="p-2.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-700/60"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{product.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-black text-xs text-emerald-400">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="line-through text-slate-500 text-[10px]">
                                ₹{product.originalPrice}
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-[9px] font-bold">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 shrink-0 ml-2 ${
                          addedItemMap[product.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        }`}
                      >
                        {addedItemMap[product.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Bar */}
          <div className="bg-slate-950/80 border-t border-slate-800 p-2.5 text-center flex items-center justify-between text-[11px] text-slate-400 px-4">
            <span>Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">ESC</kbd> to close</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-400 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>Explore Full Store Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
