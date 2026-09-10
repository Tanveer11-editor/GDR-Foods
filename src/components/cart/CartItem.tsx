import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store/useCartStore';

interface CartItemProps {
  item: CartItemType;
}

export const CartItemRow: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl glass-panel-subtle border border-white/60">
      {/* Product Thumbnail */}
      <img
        src={product.image}
        alt={product.name}
        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200/60"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">{product.name}</h4>
        <p className="text-[11px] text-slate-500 font-medium">{product.weight}</p>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-extrabold text-slate-900">₹{product.price * quantity}</span>
          {product.mrp > product.price && (
            <span className="text-[11px] text-slate-400 line-through">₹{product.mrp * quantity}</span>
          )}
        </div>
      </div>

      {/* Quantity Control Stepper */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-sm">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center font-bold text-xs text-slate-900">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={() => removeItem(product.id)}
          className="w-7 h-7 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
