import React, { useState } from 'react';
import { CreditCard, QrCode, Building2, Banknote, ShieldCheck, Check } from 'lucide-react';

interface PaymentOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  popular?: boolean;
}

interface PaymentSelectorProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  totalAmount: number;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  totalAmount,
}) => {
  const options: PaymentOption[] = [
    {
      id: 'UPI (Google Pay / PhonePe / Paytm)',
      title: 'UPI Payment',
      subtitle: 'Google Pay, PhonePe, Paytm, BHIM — Instant & Zero Charges',
      icon: <QrCode className="w-5 h-5 text-emerald-600" />,
      popular: true,
    },
    {
      id: 'Credit / Debit Card',
      title: 'Credit or Debit Card',
      subtitle: 'Visa, Mastercard, RuPay, Amex cards accepted',
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'Net Banking',
      title: 'Net Banking',
      subtitle: 'HDFC, ICICI, SBI, Axis & all major Indian banks',
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'Cash on Delivery (COD)',
      title: 'Cash / Pay on Delivery',
      subtitle: 'Pay via cash or UPI QR code at your doorstep upon arrival',
      icon: <Banknote className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-emerald-600" />
        <span>3. Select Payment Method</span>
      </h3>

      <div className="space-y-2.5">
        {options.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onSelectMethod(opt.id)}
              className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                isSelected
                  ? 'glass-panel border-emerald-500 shadow-md shadow-emerald-500/10 bg-emerald-50/30'
                  : 'bg-white/70 border-slate-200/70 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 border border-slate-200/60">
                  {opt.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{opt.title}</span>
                    {opt.popular && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.subtitle}</p>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-2xl bg-slate-100/80 text-slate-600 text-xs flex items-center gap-2 border border-slate-200/60">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>100% Encrypted & Safe Payments backed by 256-bit SSL Security.</span>
      </div>
    </div>
  );
};
