import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Order, CartItem, VisitorLog, AnalyticsSummary, PaymentMethod, OrderStatus } from '../types';
import { storageService } from '../services/storageService';
import { trackerService } from '../services/trackerService';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  visitorLogs: VisitorLog[];
  analytics: AnalyticsSummary;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Product Admin actions
  saveProduct: (productData: Partial<Product> & { name: string; price: number; category: string }) => Product;
  deleteProduct: (id: string) => void;
  seedDemoProducts: () => void;

  // Order actions
  placeOrder: (shipping: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Tracking
  recordVisit: (pageName: string) => void;
  refreshLogs: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>(() => storageService.getVisitorLogs());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshStore = () => {
    setProducts(storageService.getProducts());
    setOrders(storageService.getOrders());
    setVisitorLogs(storageService.getVisitorLogs());
  };

  useEffect(() => {
    refreshStore();
  }, []);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const saveProduct = (productData: Partial<Product> & { name: string; price: number; category: string }) => {
    const saved = storageService.saveProduct(productData);
    setProducts(storageService.getProducts());
    return saved;
  };

  const deleteProduct = (id: string) => {
    storageService.deleteProduct(id);
    setProducts(storageService.getProducts());
  };

  const seedDemoProducts = () => {
    const demoProds = storageService.seedDemoProducts();
    setProducts(demoProds);
  };

  const placeOrder = (shipping: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => {
    if (cart.length === 0) return null;

    const items = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const subtotal = cartTotal;
    const discount = 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal - discount + tax;

    const newOrder = storageService.saveOrder({
      userId: user?.id || 'guest',
      customerName: shipping.customerName,
      customerEmail: shipping.customerEmail,
      customerPhone: shipping.customerPhone,
      shippingAddress: shipping.shippingAddress,
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod: shipping.paymentMethod,
      paymentStatus: shipping.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'pending',
      notes: shipping.notes,
    });

    clearCart();
    setOrders(storageService.getOrders());
    setProducts(storageService.getProducts());
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    storageService.updateOrderStatus(orderId, status);
    setOrders(storageService.getOrders());
  };

  const recordVisit = (pageName: string) => {
    trackerService.trackPageView(pageName, user);
    setVisitorLogs(storageService.getVisitorLogs());
  };

  const refreshLogs = () => {
    setVisitorLogs(storageService.getVisitorLogs());
  };

  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'cancelled' ? sum + o.total : sum), 0);
  const totalVisitors = new Set(visitorLogs.map((l) => l.sessionId)).size;
  const totalOrders = orders.length;
  const conversionRate = totalVisitors > 0 ? Number(((totalOrders / totalVisitors) * 100).toFixed(1)) : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 3 && p.isAvailable).length;

  const analytics: AnalyticsSummary = {
    totalVisitors,
    activeVisitorsNow: Math.max(1, Math.min(visitorLogs.length, Math.floor(totalVisitors * 0.4) + 1)),
    totalOrders,
    totalRevenue,
    conversionRate,
    totalProducts: products.length,
    lowStockProducts,
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        visitorLogs,
        analytics,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        saveProduct,
        deleteProduct,
        seedDemoProducts,
        placeOrder,
        updateOrderStatus,
        recordVisit,
        refreshLogs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
