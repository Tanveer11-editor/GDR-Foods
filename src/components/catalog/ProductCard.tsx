import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Star, Heart, Check, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { useToast } from '../common/Toast';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const { wishlist, toggleWishlist } = useUserStore();
  const { showToast } = useToast();

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isWishlisted = wishlist.includes(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    showToast(`${product.name} added to cart`, 'success', product.image);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart - 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(
      isWishlisted ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist`,
      'info'
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="glass-card rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between h-full relative cursor-pointer group border border-white/80 select-none overflow-hidden"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.discount > 0 && (
          <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md shadow-emerald-600/30">
            {product.discount}% OFF
          </span>
        )}
        {product.isOrganic && (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Organic
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-rose-50 text-rose-500 shadow-md border border-rose-200'
            : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white border border-white/60'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="w-full h-36 sm:h-40 rounded-2xl overflow-hidden mb-3 bg-slate-100/60 relative flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Weight */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-emerald-700 truncate max-w-[110px]">{product.brand}</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">{product.weight}</span>
          </div>

          {/* Name */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors mb-1.5">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-3">
            <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md border border-amber-200/60 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & Add Control Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-900">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
              )}
            </div>
          </div>

          {/* Instant Morphed Add Button / Stepper */}
          {quantityInCart === 0 ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                product.stock > 0
                  ? 'btn-emerald'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'ADD' : 'Out of Stock'}
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center bg-emerald-600 text-white rounded-2xl p-1 shadow-md shadow-emerald-600/30"
            >
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-xl hover:bg-emerald-700 flex items-center justify-center text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-extrabold text-xs text-white">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-xl hover:bg-emerald-700 flex items-center justify-center text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
