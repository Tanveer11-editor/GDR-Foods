import React, { useState } from 'react';
import { Truck, Clock, Calendar, Zap, Check } from 'lucide-react';

interface DeliverySelectorProps {
  onSelectOption: (option: { type: 'fast' | 'scheduled'; slot?: string }) => void;
}

export const DeliverySelector: React.FC<DeliverySelectorProps> = ({ onSelectOption }) => {
  const [selectedType, setSelectedType] = useState<'fast' | 'scheduled'>('fast');
  const [selectedSlot, setSelectedSlot] = useState<string>('Today, 4:00 PM - 6:00 PM');

  const timeSlots = [
    'Today, 4:00 PM - 6:00 PM',
    'Today, 6:00 PM - 8:00 PM',
    'Tomorrow, 8:00 AM - 10:00 AM',
    'Tomorrow, 10:00 AM - 12:00 PM',
  ];

  const handleSelectType = (type: 'fast' | 'scheduled') => {
    setSelectedType(type);
    onSelectOption({ type, slot: type === 'scheduled' ? selectedSlot : '20-30 Minutes Express' });
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    onSelectOption({ type: 'scheduled', slot });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
        <Truck className="w-5 h-5 text-emerald-600" />
        <span>2. Choose Delivery Timing</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Fast Delivery Card (Default) */}
        <div
          onClick={() => handleSelectType('fast')}
          className={`p-4 rounded-2xl cursor-pointer border transition-all relative ${
            selectedType === 'fast'
              ? 'glass-panel border-emerald-500 shadow-md shadow-emerald-500/10 bg-emerald-50/40'
              : 'bg-white/70 border-slate-200/70 hover:bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-sm text-slate-900">Express Fast Delivery</span>
            </div>
            {selectedType === 'fast' && (
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <p className="text-xs text-emerald-700 font-bold mt-2">⚡ Arriving in 20–30 Minutes</p>
          <p className="text-[11px] text-slate-500 mt-1">Live GPS tracking + temperature controlled delivery</p>
        </div>

        {/* Scheduled Slot Card */}
        <div
          onClick={() => handleSelectType('scheduled')}
          className={`p-4 rounded-2xl cursor-pointer border transition-all relative ${
            selectedType === 'scheduled'
              ? 'glass-panel border-emerald-500 shadow-md shadow-emerald-500/10 bg-emerald-50/40'
              : 'bg-white/70 border-slate-200/70 hover:bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="font-extrabold text-sm text-slate-900">Schedule Delivery Slot</span>
            </div>
            {selectedType === 'scheduled' && (
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <p className="text-xs text-slate-700 font-semibold mt-2">Choose convenient time window</p>
          <p className="text-[11px] text-slate-500 mt-1">Delivered exactly within your selected 2-hr slot</p>
        </div>
      </div>

      {/* Slots Selector dropdown/pills if scheduled */}
      {selectedType === 'scheduled' && (
        <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Available Delivery Windows:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => handleSelectSlot(slot)}
                className={`p-2.5 rounded-xl text-left font-semibold border transition-all ${
                  selectedSlot === slot
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
