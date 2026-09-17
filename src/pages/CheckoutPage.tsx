import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useOrderStore } from '../store/useOrderStore';
import { useCustomerAuth } from '../store/useCustomerAuth';
import { AddressSelector } from '../components/checkout/AddressSelector';
import { DeliverySelector } from '../components/checkout/DeliverySelector';
import { PaymentSelector } from '../components/checkout/PaymentSelector';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useCustomerAuth();
  const {
    items,
    appliedCoupon,
    getSubtotal,
    getItemDiscount,
    getCouponDiscount,
    getDeliveryFee,
    getPlatformFee,
    getTotalAmount,
    clearCart,
  } = useCartStore();

  const { addresses, selectedAddressId } = useUserStore();
  const { createOrder } = useOrderStore();

  const [deliveryOption, setDeliveryOption] = useState<{ type: 'fast' | 'scheduled'; slot?: string }>({
    type: 'fast',
    slot: '20-30 Minutes Express',
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI (Google Pay / PhonePe / Paytm)');
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = getSubtotal();
  const itemDiscount = getItemDiscount();
  const couponDiscount = getCouponDiscount();
  const deliveryFee = getDeliveryFee();
  const platformFee = getPlatformFee();
  const totalAmount = getTotalAmount();

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty.</h2>
        <Link to="/" className="btn-emerald inline-block px-6 py-2.5 rounded-2xl text-xs">
          Return to Storefront
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress) return;
    setIsPlacing(true);

    setTimeout(() => {
      const order = createOrder(
        {
          items,
          subtotal,
          discount: itemDiscount + couponDiscount,
          deliveryFee,
          platformFee,
          totalAmount,
          couponCode: appliedCoupon?.code,
          address: selectedAddress,
          paymentMethod,
          paymentStatus: paymentMethod.includes('Cash') ? 'Cash on Delivery' : 'Paid',
        },
        user?.id || 'cust-101'
      );

      clearCart(user?.id);
      setIsPlacing(false);
      navigate(`/order-success/${order.id}`);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
            <p className="text-xs text-slate-500">4-Step Streamlined Express Checkout</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Steps 1, 2 & 3 */}
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          {/* Step 1: Address Selection */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80">
            <AddressSelector />
          </div>

          {/* Step 2: Delivery Option */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80">
            <DeliverySelector onSelectOption={(opt) => setDeliveryOption(opt)} />
          </div>

          {/* Step 3: Payment Method */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80">
            <PaymentSelector
              selectedMethod={paymentMethod}
              onSelectMethod={(m) => setPaymentMethod(m)}
              totalAmount={totalAmount}
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Step 4 Place Order CTA */}
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80 space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-200/80 pb-3">
              Order Summary ({items.length} items)
            </h3>

            {/* Items Thumbnails List */}
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.product.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="pt-3 border-t border-slate-200/80 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>

              {itemDiscount + couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Total Savings</span>
                  <span>-₹{itemDiscount + couponDiscount}</span>
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

              <div className="flex justify-between items-center pt-3 border-t border-slate-200/80 text-sm font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl text-emerald-700">₹{totalAmount}</span>
              </div>
            </div>

            {/* Step 4 CTA — Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing || !selectedAddress}
              className="w-full btn-emerald py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-extrabold shadow-xl shadow-emerald-600/30"
            >
              {isPlacing ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Confirming Order...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Place Order (₹{totalAmount})</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              By placing order, you agree to GDR Foods terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
