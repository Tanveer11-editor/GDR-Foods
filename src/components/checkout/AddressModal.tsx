import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { Address } from '../../types';
import { useUserStore } from '../../store/useUserStore';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editAddress?: Address | null;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, editAddress }) => {
  const { addAddress, updateAddress } = useUserStore();

  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>(editAddress?.label || 'Home');
  const [name, setName] = useState(editAddress?.name || 'Mohammed Tanveer');
  const [phone, setPhone] = useState(editAddress?.phone || '+91 98765 43210');
  const [street, setStreet] = useState(editAddress?.street || '');
  const [apartment, setApartment] = useState(editAddress?.apartment || '');
  const [city, setCity] = useState(editAddress?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(editAddress?.pincode || '560038');
  const [deliveryNotes, setDeliveryNotes] = useState(editAddress?.deliveryNotes || '');
  const [isDefault, setIsDefault] = useState(editAddress?.isDefault || false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !pincode) return;

    if (editAddress) {
      updateAddress(editAddress.id, {
        label,
        name,
        phone,
        street,
        apartment,
        city,
        pincode,
        deliveryNotes,
        isDefault,
      });
    } else {
      addAddress({
        label,
        name,
        phone,
        street,
        apartment,
        city,
        pincode,
        deliveryNotes,
        isDefault,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[94vw] sm:w-[88vw] md:w-full max-w-md glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl relative border border-white/80 max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                {editAddress ? 'Edit Address' : 'Add New Delivery Address'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Label Pills */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Save Address As</label>
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLabel(l)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      label === l
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Receiver Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Street / Building */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Flat / House No. & Building</label>
              <input
                type="text"
                placeholder="e.g. Apt 402, Emerald Heights"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Street & Area Name</label>
              <input
                type="text"
                required
                placeholder="e.g. 100 Ft Road, Indiranagar"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
              />
            </div>

            {/* City & Pincode */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Delivery instructions */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Delivery Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Ring doorbell, leave at front desk"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
              />
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isDefault" className="text-slate-700 font-medium cursor-pointer">
                Set as default delivery address
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-3">
              <button type="submit" className="w-full btn-emerald py-3 rounded-2xl text-xs font-extrabold shadow-lg">
                {editAddress ? 'Update Address' : 'Save & Select Address'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
