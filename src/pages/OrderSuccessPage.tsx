import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrderStore();

  const order = getOrderById(orderId || '');

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 space-y-6 text-center">
      {/* Celebration Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Check Animated Circle */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-300/60">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Order ID: <strong className="text-slate-900 font-extrabold">{orderId}</strong>
          </p>
        </div>

        {/* ETA Highlight */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-left flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">Estimated Delivery Time</p>
              <p className="text-sm font-black text-emerald-700">20–30 Minutes Express</p>
            </div>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-emerald-600 text-white rounded-full">
            On Time
          </span>
        </div>

        {/* Order Details Preview */}
        {order && (
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/60 text-left text-xs space-y-2">
            <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200/60 pb-2">
              <span>Delivering to</span>
              <span className="text-emerald-700">{order.address.label}</span>
            </div>
            <p className="text-slate-600">{order.address.name} — {order.address.street}, {order.address.city}</p>
            <div className="flex justify-between pt-2 border-t border-slate-200/60 font-extrabold text-slate-900">
              <span>Total Paid ({order.paymentMethod})</span>
              <span className="text-sm text-emerald-700">₹{order.totalAmount}</span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to={`/order-tracking/${orderId}`}
            className="w-full sm:flex-1 btn-emerald py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Order Status</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:flex-1 py-3.5 rounded-2xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
