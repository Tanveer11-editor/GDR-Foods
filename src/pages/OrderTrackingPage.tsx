import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, PhoneCall, ShieldCheck, ShoppingBag, RotateCcw } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useCartStore } from '../store/useCartStore';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { useToast } from '../components/common/Toast';

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, updateOrderStatus } = useOrderStore();
  const { addItem } = useCartStore();
  const { showToast } = useToast();

  const order = getOrderById(orderId || '');

  if (!order) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Order not found.</h2>
        <Link to="/" className="btn-emerald inline-block px-6 py-2.5 rounded-2xl text-xs">
          Return to Storefront
        </Link>
      </div>
    );
  }

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem(item.product, item.quantity);
    });
    showToast(`Added ${order.items.length} items from ${order.id} to cart`, 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/account?tab=orders"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Live Delivery Tracking
            </h1>
            <p className="text-xs text-slate-500 font-medium">Order ID: {order.id}</p>
          </div>
        </div>

        <button
          onClick={handleReorder}
          className="btn-emerald px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reorder Items</span>
        </button>
      </div>

      {/* Live ETA Banner */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80 space-y-3 bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Real-time Express Track
            </span>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-white/10 rounded-full border border-white/20">
            {order.status}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white">
          {order.estimatedDelivery}
        </h2>
        <p className="text-xs text-emerald-100/90 font-medium">
          Assigned Delivery Partner: <strong className="text-white font-bold">Rahul Sharma (+91 98123 45678)</strong> • Insulated cold bag #GDR-88
        </p>
      </div>

      {/* Interactive Timeline */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 mb-4 border-b border-slate-200/60 pb-3">
          Order Status Progression
        </h3>

        <OrderTimeline
          steps={order.trackingSteps}
          currentStatus={order.status}
          onAdvanceStatus={(next) => updateOrderStatus(order.id, next)}
        />
      </div>

      {/* Delivery Address & Items Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Card */}
        <div className="glass-panel rounded-3xl p-5 border border-white/80 space-y-2 text-xs">
          <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Delivery Destination</span>
          </h4>
          <p className="font-bold text-slate-900">{order.address.name} ({order.address.label})</p>
          <p className="text-slate-600 leading-relaxed">
            {order.address.apartment ? `${order.address.apartment}, ` : ''}{order.address.street}, {order.address.city} — {order.address.pincode}
          </p>
          <p className="text-slate-400 font-medium pt-1">Phone: {order.address.phone}</p>
        </div>

        {/* Items Summary Card */}
        <div className="glass-panel rounded-3xl p-5 border border-white/80 space-y-3 text-xs">
          <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Order Summary ({order.items.length} items)</span>
          </h4>
          <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-slate-700">
                <span className="font-medium line-clamp-1">{item.product.name} x{item.quantity}</span>
                <span className="font-bold text-slate-900">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-200/80 flex justify-between font-extrabold text-slate-900 text-sm">
            <span>Total Paid ({order.paymentMethod})</span>
            <span className="text-emerald-700">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
