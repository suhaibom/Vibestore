import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/customer/HeroBanner';
import { ProductCard } from '../components/customer/ProductCard';
import { ProductDetailsModal } from '../components/customer/ProductDetailsModal';
import { CartDrawer } from '../components/customer/CartDrawer';
import { CheckoutModal } from '../components/customer/CheckoutModal';
import { OrderHistoryModal } from '../components/customer/OrderHistoryModal';
import { useStore } from '../context/StoreContext';
import type { Product, Order } from '../types';
import { PackageX, Sparkles } from 'lucide-react';

interface StorePageProps {
  currentTab: 'store' | 'admin' | 'orders';
  onTabChange: (tab: 'store' | 'admin' | 'orders') => void;
  isCartOpen: boolean;
  onCloseCart: () => void;
}

export const StorePage: React.FC<StorePageProps> = ({
  currentTab,
  onTabChange,
  isCartOpen,
  onCloseCart,
}) => {
  const { products, activeCategory, searchQuery, recordVisit } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    recordVisit('Customer Storefront');
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCat = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch && product.isAvailable;
  });

  const handleProceedToCheckout = () => {
    onCloseCart();
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (_order: Order) => {
    setIsCheckoutOpen(false);
    onTabChange('orders');
  };

  if (currentTab === 'orders') {
    return <OrderHistoryModal onBackToStore={() => onTabChange('store')} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <HeroBanner onExploreClick={() => {
        const catalogEl = document.getElementById('catalog-section');
        catalogEl?.scrollIntoView({ behavior: 'smooth' });
      }} />

      <div id="catalog-section" className="scroll-mt-24 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <span>{activeCategory === 'All' ? 'All Store Items' : `${activeCategory} Collection`}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Showing {filteredProducts.length} product(s) available for online order.
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
            <PackageX className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {products.length === 0 ? 'New Collections Arriving Soon' : 'No Products Match Search'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {products.length === 0
                ? 'Check back shortly! Fresh inventory and exclusive deals are being cataloged.'
                : 'Try searching with different keywords or switch the category filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

      </div>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={onCloseCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

    </div>
  );
};
