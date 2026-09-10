import React, { useState } from 'react';
import { MapPin, Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { AddressModal } from './AddressModal';
import { Address } from '../../types';

export const AddressSelector: React.FC = () => {
  const { addresses, selectedAddressId, setSelectedAddress, deleteAddress } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEdit = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAddress(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <span>1. Select Delivery Address</span>
        </h3>
        <button
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => setSelectedAddress(addr.id)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all relative ${
                isSelected
                  ? 'glass-panel border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'bg-white/70 border-slate-200/70 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    addr.label === 'Home' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-md">
                      Default
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="mt-2.5 space-y-0.5 text-xs">
                <p className="font-extrabold text-slate-900">{addr.name}</p>
                <p className="text-slate-600 line-clamp-2">{addr.apartment ? `${addr.apartment}, ` : ''}{addr.street}</p>
                <p className="text-slate-500">{addr.city} — {addr.pincode}</p>
                <p className="text-slate-400 font-medium pt-1">Phone: {addr.phone}</p>
              </div>

              {/* Edit / Delete actions */}
              <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-100 text-[11px]">
                <button
                  onClick={(e) => handleEdit(addr, e)}
                  className="text-slate-500 hover:text-emerald-700 font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                {addresses.length > 1 && (
                  <button
                    onClick={(e) => handleDelete(addr.id, e)}
                    className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editAddress={editingAddress}
      />
    </div>
  );
};
