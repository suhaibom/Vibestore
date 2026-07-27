import React from 'react';
import { PackageCheck, Clock, Truck, CheckCircle2, XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import type { OrderStatus } from '../../types';

interface OrderHistoryModalProps {
  onBackToStore: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ onBackToStore }) => {
  const { user } = useAuth();
  const { orders } = useStore();

  const userOrders = orders.filter((o) => o.userId === user?.id || o.customerEmail === user?.email);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Order Placed</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Packing Items</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
            <Truck className="w-3.5 h-3.5" />
            <span>Out For Delivery</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToStore}
          className="flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold px-3 py-2 bg-slate-800 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <PackageCheck className="w-5 h-5 text-indigo-400" />
          <span>My Orders & Tracking ({userOrders.length})</span>
        </h2>
      </div>

      {userOrders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No Purchases Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            You haven't placed any orders with Vibe Store. Browse our catalog to place your first order!
          </p>
          <button
            onClick={onBackToStore}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-white text-base">{order.orderNumber}</span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">
                    Order Date:{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="text-xl font-black text-emerald-400">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/80"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-lg bg-slate-800"
                      />
                      <div>
                        <h4 className="font-bold text-white text-xs">{item.productName}</h4>
                        <span className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</span>
                      </div>
                    </div>
                    <span className="font-bold text-white text-sm">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex justify-between items-center">
                <span>
                  Delivering to: <strong className="text-slate-200">{order.shippingAddress}</strong>
                </span>
                <span className="capitalize font-semibold text-indigo-300">
                  Payment: {order.paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
