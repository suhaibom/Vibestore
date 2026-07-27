export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  isAvailable: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'upi' | 'card';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorLog {
  id: string;
  sessionId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  pageVisited: string;
  deviceType: string;
  browser: string;
  ipAddress: string;
  timestamp: string;
  timeSpentSeconds?: number;
  location?: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  activeVisitorsNow: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  totalProducts: number;
  lowStockProducts: number;
}
