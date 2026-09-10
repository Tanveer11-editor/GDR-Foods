import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Check, X, Search, Clock } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { addresses, selectedAddressId, setSelectedAddress, setSelectedLocation } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [customLoc, setCustomLoc] = useState('');

  if (!isOpen) return null;

  const popularLocations = [
    { label: 'Home — Indiranagar, Bengaluru', eta: '20–25 min', pincode: '560038' },
    { label: 'Work — GDR Tech Park, Whitefield', eta: '25–30 min', pincode: '560066' },
    { label: 'Koramangala, 5th Block, Bengaluru', eta: '15–20 min', pincode: '560095' },
    { label: 'HSR Layout, Sector 3, Bengaluru', eta: '20–25 min', pincode: '560102' },
    { label: 'Jayanagar, 4th Block, Bengaluru', eta: '30–35 min', pincode: '560041' },
  ];

  const handleSelectPopular = (label: string, eta: string) => {
    setSelectedLocation(label, eta);
    onClose();
  };

  const handleSelectAddress = (id: string, label: string) => {
    setSelectedAddress(id);
    setSelectedLocation(label, '20–25 min');
    onClose();
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLoc.trim()) return;
    setSelectedLocation(customLoc.trim(), '25–30 min');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl relative border border-white/80"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Select Delivery Location</h3>
                <p className="text-xs text-slate-500">Fast 20-30 min delivery available in your area</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current GPS detection button */}
          <div className="mt-4">
            <button
              onClick={() => handleSelectPopular('Current Location (Indiranagar, Bengaluru)', '18–22 min')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 text-emerald-800 font-medium transition-all group"
            >
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-emerald-600 group-hover:rotate-45 transition-transform" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-emerald-900">Use Current GPS Location</p>
                  <p className="text-xs text-emerald-600">Detecting location automatically...</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-600 text-white rounded-full">
                Fastest
              </span>
            </button>
          </div>

          {/* Saved Addresses */}
          {addresses.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Your Saved Addresses
              </h4>
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr.id, `${addr.label} — ${addr.street}`)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-emerald-50/80 border-emerald-500/60 shadow-sm'
                        : 'bg-white/60 border-slate-200/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-4 h-4 mt-0.5 ${selectedAddressId === addr.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{addr.street}, {addr.city}</p>
                      </div>
                    </div>
                    {selectedAddressId === addr.id && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Areas */}
          <div className="mt-5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Popular Nearby Areas
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {popularLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPopular(loc.label, loc.eta)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span className="text-xs font-medium text-slate-700">{loc.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>{loc.eta}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Search Form */}
          <form onSubmit={handleApplyCustom} className="mt-4 pt-3 border-t border-slate-200/60 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter street, area, or pincode..."
                value={customLoc}
                onChange={(e) => setCustomLoc(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input focus:outline-none text-slate-800"
              />
            </div>
            <button type="submit" className="btn-emerald px-4 py-2 text-xs rounded-xl shrink-0">
              Set
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
