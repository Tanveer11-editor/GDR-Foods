import React from 'react';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const FreeDeliveryBar: React.FC = () => {
  const { getSubtotal, getFreeDeliveryThreshold, getRemainingForFreeDelivery } = useCartStore();

  const subtotal = getSubtotal();
  const threshold = getFreeDeliveryThreshold();
  const remaining = getRemainingForFreeDelivery();
  const percentage = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-slate-800">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2 font-semibold">
          {remaining === 0 ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span className="text-emerald-900 font-extrabold">🎉 Free delivery unlocked!</span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>
                Add <strong className="text-emerald-700">₹{remaining}</strong> more to unlock <strong className="text-emerald-800">FREE delivery</strong>
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] text-emerald-700 font-bold">{Math.round(percentage)}%</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 rounded-full bg-emerald-200/60 overflow-hidden relative">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
