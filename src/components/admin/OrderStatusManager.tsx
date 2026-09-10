import React from 'react';
import { ShoppingBag, ArrowRight, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { OrderStatus } from '../../types';

export const OrderStatusManager: React.FC = () => {
  const { orders, updateOrderStatus } = useOrderStore();

  const statuses: OrderStatus[] = ['Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Packed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Out for Delivery':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Delivered':
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/80 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Live Orders Pipeline</h3>
          <p className="text-xs text-slate-500">Advance order stages in real time</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {orders.length} Active Orders
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm space-y-3"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{order.id}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Payment: {order.paymentMethod} ({order.paymentStatus})
                </p>
              </div>

              {/* Status Selector Dropdown / Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 mr-1">Update Status:</span>
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => updateOrderStatus(order.id, st)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      order.status === st
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid & Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Items List */}
              <div className="md:col-span-2 space-y-1.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Order Items ({order.items.length})
                </span>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-2">
                        <img src={item.product.image} alt="" className="w-7 h-7 rounded-lg object-cover" />
                        <span className="font-bold text-slate-800">{item.product.name}</span>
                        <span className="text-slate-400 font-medium">x{item.quantity}</span>
                      </div>
                      <span className="font-extrabold text-slate-900">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address & Total */}
              <div className="p-3 rounded-xl bg-slate-50 space-y-2">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Delivery Address</span>
                  <p className="font-bold text-slate-900 mt-0.5">{order.address.name} ({order.address.label})</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{order.address.street}, {order.address.city}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Total Payable:</span>
                  <span className="font-black text-sm text-emerald-700">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
