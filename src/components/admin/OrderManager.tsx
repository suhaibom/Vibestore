import React, { useState } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronRight, User, Phone, MapPin, CreditCard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus } from '../../types';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === 'All') return true;
    return order.orderStatus === selectedStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Package className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped</span>
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
    <div className="space-y-6">
      
      {/* Header & Status Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <span>Customer Sales Orders ({orders.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage incoming purchase orders, update shipping status, and view customer delivery addresses.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-3xl">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            There are no customer orders matching the "{selectedStatus}" status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition"
              >
                {/* Order Summary Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none bg-slate-900 hover:bg-slate-850"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      #
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-white text-base">{order.orderNumber}</span>
                        {getStatusBadge(order.orderStatus)}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Placed by <strong className="text-slate-200">{order.customerName}</strong> on{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-6">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
                      <span className="text-lg font-black text-emerald-400">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={order.orderStatus}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-800 border border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="pending">Mark Pending</option>
                        <option value="processing">Mark Processing</option>
                        <option value="shipped">Mark Shipped</option>
                        <option value="delivered">Mark Delivered</option>
                        <option value="cancelled">Mark Cancelled</option>
                      </select>

                      <ChevronRight
                        className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 bg-slate-950/70 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Customer & Shipping Info */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                        Customer Delivery Details
                      </h4>
                      <div className="space-y-2 text-slate-400">
                        <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                          <User className="w-4 h-4 text-indigo-400" />
                          <span>{order.customerName} ({order.customerEmail})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-indigo-400" />
                          <span>{order.customerPhone}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{order.shippingAddress}</span>
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <CreditCard className="w-4 h-4 text-indigo-400" />
                          <span className="capitalize font-bold text-indigo-300">
                            Payment Method: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Purchased Items */}
                    <div>
                      <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-3">
                        Ordered Items
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-10 h-10 object-cover rounded-lg bg-slate-800"
                              />
                              <div>
                                <h5 className="font-bold text-white text-xs">{item.productName}</h5>
                                <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-bold text-white">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
