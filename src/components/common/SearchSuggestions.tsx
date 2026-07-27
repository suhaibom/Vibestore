import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ShoppingBag, ArrowRight, Check, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types';

interface SearchSuggestionsProps {
  onSelectProduct?: (product: Product) => void;
}

const TRENDING_KEYWORDS = [
  'mobiles',
  'shoes',
  't shirts',
  'laptops',
  'watches',
  'tv',
  'headphones',
  'power bank',
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

  const handleKeywordClick = (term: string) => {
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
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input Bar (Flipkart Style) */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          className="w-full bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm sm:text-base rounded-2xl pl-12 pr-10 py-2.5 sm:py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Flipkart-Style Large Suggestions Floating Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden text-slate-900 dark:text-slate-100 animate-fadeIn max-h-[550px] flex flex-col">
          
          {/* CASE A: EMPTY SEARCH -> SHOW FLIPKART STYLE TRENDING LIST & TOP PRODUCTS */}
          {!searchQuery.trim() && (
            <div className="p-4 sm:p-5 space-y-5 overflow-y-auto custom-scrollbar">
              
              {/* Flipkart Style "Trending" Vertical List */}
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Trending</span>
                </div>

                <div className="space-y-1">
                  {TRENDING_KEYWORDS.map((keyword) => (
                    <div
                      key={keyword}
                      onClick={() => handleKeywordClick(keyword)}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer text-slate-700 dark:text-slate-200 font-semibold text-sm group"
                    >
                      <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                      <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{keyword}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Top Deals Section */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mb-3">
                  <span>Popular Product Suggestions</span>
                  <span className="text-[10px] text-slate-400">Featured</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(product);
                        setIsOpen(false);
                      }}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 rounded-2xl transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {product.name}
                          </p>
                          <div className="flex items-center space-x-2 text-xs mt-0.5">
                            <span className="font-black text-emerald-600 dark:text-emerald-400">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="line-through text-slate-400 text-[10px]">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 shrink-0 ml-2 ${
                          addedItemMap[product.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        }`}
                      >
                        {addedItemMap[product.id] ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* CASE B: ACTIVE SEARCH QUERY -> REAL-TIME MATCHES */}
          {searchQuery.trim() !== '' && (
            <div className="p-4 sm:p-5 space-y-3 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Search results for "<strong className="text-indigo-600 dark:text-indigo-400">{searchQuery}</strong>"
                </span>
                <span className="text-[11px] text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {matchingProducts.length} items
                </span>
              </div>

              {matchingProducts.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No products matching "{searchQuery}"</p>
                  <p className="text-xs text-slate-400">Try searching for "mobiles", "shoes", or "headphones"</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {matchingProducts.slice(0, 8).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(product);
                        setIsOpen(false);
                      }}
                      className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3.5 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center space-x-2.5 mt-1">
                            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="line-through text-slate-400 text-xs">
                                ₹{product.originalPrice}
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full text-[10px] font-bold">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 shrink-0 ml-3 ${
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
          <div className="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-5">
            <span>Press <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-300 font-mono">ESC</kbd> to close</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
