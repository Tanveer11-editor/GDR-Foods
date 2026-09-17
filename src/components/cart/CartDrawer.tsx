import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Tag, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { CartItemRow } from './CartItem';
import { FreeDeliveryBar } from './FreeDeliveryBar';
import { EmptyState } from '../common/EmptyState';
import { MOCK_COUPONS } from '../../data/mockCoupons';
import { Coupon } from '../../types';
import { supabase } from '../../lib/supabaseClient';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getMrpTotal,
    getItemDiscount,
    getCouponDiscount,
    getDeliveryFee,
    getPlatformFee,
    getTotalSavings,
    getTotalAmount,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showCouponsList, setShowCouponsList] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>(MOCK_COUPONS);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('coupons').select('*');
        if (!error && data && data.length > 0) {
          const mapped: Coupon[] = data.map((c: any) => ({
            code: c.code,
            title: c.title,
            description: c.description,
            minOrder: Number(c.min_order),
            discountValue: Number(c.discount_value),
            discountType: c.discount_type,
            maxDiscount: c.max_discount ? Number(c.max_discount) : undefined,
            expiresAt: c.expires_at,
          }));
          setAvailableCoupons(mapped);
        }
      } catch (err) {
        console.warn('Supabase coupons fetch warning:', err);
      }
    })();
  }, []);

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const itemDiscount = getItemDiscount();
  const couponDiscount = getCouponDiscount();
  const deliveryFee = getDeliveryFee();
  const platformFee = getPlatformFee();
  const totalSavings = getTotalSavings();
  const totalAmount = getTotalAmount();

  const handleApplyCoupon = async (e?: React.FormEvent, codeToApply?: string) => {
    if (e) e.preventDefault();
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    let couponObj: Coupon | undefined = availableCoupons.find((c) => c.code === code);

    if (!couponObj) {
      try {
        const { data } = await supabase.from('coupons').select('*').eq('code', code).maybeSingle();
        if (data) {
          couponObj = {
            code: data.code,
            title: data.title,
            description: data.description,
            minOrder: Number(data.min_order),
            discountValue: Number(data.discount_value),
            discountType: data.discount_type,
            maxDiscount: data.max_discount ? Number(data.max_discount) : undefined,
            expiresAt: data.expires_at,
          };
        }
      } catch (err) {
        console.warn('Coupon validation error:', err);
      }
    }

    if (!couponObj) {
      setCouponError('Invalid promo coupon code');
      return;
    }

    const result = applyCoupon(couponObj);
    if (result.success) {
      setCouponError(null);
      setCouponInput('');
      setShowCouponsList(false);
    } else {
      setCouponError(result.message);
    }
  };

  const handleCheckoutClick = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-screen max-w-[92vw] sm:max-w-md bg-slate-50/95 backdrop-blur-2xl shadow-2xl border-l border-white/80 flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 glass-panel border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Your Basket</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {items.length} {items.length === 1 ? 'item' : 'items'} selected
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
              {items.length === 0 ? (
                <EmptyState
                  type="cart"
                  onActionClick={() => setDrawerOpen(false)}
                />
              ) : (
                <>
                  {/* Free Delivery Goal Progress */}
                  <FreeDeliveryBar />

                  {/* Cart Items List */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Selected Items
                    </h4>
                    {items.map((item) => (
                      <CartItemRow key={item.product.id} item={item} />
                    ))}
                  </div>

                  {/* Coupon & Offer Code Section */}
                  <div className="p-3.5 rounded-2xl glass-panel-subtle border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span>Promo Code & Coupons</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCouponsList(!showCouponsList)}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline"
                      >
                        {showCouponsList ? 'Hide Offers' : 'View Offers'}
                      </button>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="font-bold text-emerald-900">{appliedCoupon.code} Applied</p>
                            <p className="text-[11px] text-emerald-700">{appliedCoupon.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[11px] text-rose-600 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleApplyCoupon(e)} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon (e.g. FRESH50)"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError(null);
                          }}
                          className="flex-1 px-3 py-2 text-xs rounded-xl glass-input focus:outline-none uppercase font-bold text-slate-800 placeholder-slate-400"
                        />
                        <button type="submit" className="btn-emerald px-4 py-2 text-xs rounded-xl shrink-0">
                          Apply
                        </button>
                      </form>
                    )}

                    {couponError && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{couponError}</span>
                      </div>
                    )}

                    {/* Quick Available Coupons Suggestions */}
                    {showCouponsList && !appliedCoupon && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-slate-200/60">
                        {availableCoupons.map((c) => (
                          <div
                            key={c.code}
                            className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-slate-200/60 hover:border-emerald-300 text-xs cursor-pointer"
                            onClick={() => handleApplyCoupon(undefined, c.code)}
                          >
                            <div>
                              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {c.code}
                              </span>
                              <p className="text-[11px] text-slate-600 mt-1">{c.description}</p>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 hover:underline shrink-0">
                              Apply
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order Bill Summary */}
                  <div className="p-4 rounded-2xl glass-panel space-y-2 text-xs text-slate-700">
                    <h4 className="font-extrabold text-slate-900 border-b border-slate-200/60 pb-2 text-xs uppercase tracking-wider">
                      Bill Details
                    </h4>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Items Subtotal</span>
                      <span className="font-semibold text-slate-900">₹{subtotal}</span>
                    </div>

                    {itemDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Product Discounts</span>
                        <span className="font-semibold">-₹{itemDiscount}</span>
                      </div>
                    )}

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Coupon Savings ({appliedCoupon?.code})</span>
                        <span className="font-semibold">-₹{couponDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-slate-500">Delivery Charge</span>
                      {deliveryFee === 0 ? (
                        <span className="font-bold text-emerald-600">FREE</span>
                      ) : (
                        <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Platform Handling Fee</span>
                      <span className="font-semibold text-slate-900">₹{platformFee}</span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center mt-2 flex items-center justify-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>You saved ₹{totalSavings} on this order!</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/80 text-sm font-extrabold text-slate-900">
                      <span>Total Payable</span>
                      <span className="text-base text-emerald-700">₹{totalAmount}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Checkout CTA */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 glass-panel border-t border-slate-200/80">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full btn-emerald py-3.5 rounded-2xl flex items-center justify-between text-sm shadow-xl shadow-emerald-600/30"
                >
                  <div className="text-left">
                    <p className="text-[11px] font-medium text-emerald-100">Total Payable</p>
                    <p className="text-base font-extrabold text-white">₹{totalAmount}</p>
                  </div>
                  <div className="flex items-center gap-2 font-extrabold">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
