import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, Sparkles, Plus, Minus, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { useProductStore } from '../../store/useProductStore';
import { useToast } from '../common/Toast';
import { ProductCard } from './ProductCard';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const { wishlist, toggleWishlist } = useUserStore();
  const { products } = useProductStore();
  const { showToast } = useToast();

  const [selectedWeight, setSelectedWeight] = useState<string>(product?.weight || '');

  if (!product) return null;

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isWishlisted = wishlist.includes(product.id);

  // Similar products from same category
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, 1);
    showToast(`${product.name} added to cart`, 'success', product.image);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    showToast(
      isWishlisted ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist`,
      'info'
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-3xl glass-panel rounded-3xl p-5 sm:p-8 shadow-2xl relative border border-white/80 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: Product Image Gallery */}
            <div className="space-y-3">
              <div className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden bg-slate-100 relative shadow-inner border border-slate-200/60">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
                    {product.discount}% OFF
                  </span>
                )}
                {product.isOrganic && (
                  <span className="absolute bottom-4 left-4 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Organic Certified
                  </span>
                )}
              </div>

              {/* Delivery ETA Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-emerald-900">20–30 Minutes Delivery</h5>
                  <p className="text-[11px] text-emerald-700">Delivered cold-packed directly from GDR hub</p>
                </div>
              </div>
            </div>

            {/* Right: Product Meta & Controls */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* Brand & Wishlist */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                    {product.brand}
                  </span>
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      isWishlisted
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                  </button>
                </div>

                {/* Name */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 leading-tight">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-200 font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">({product.reviewsCount} customer reviews)</span>
                </div>

                {/* Price & Savings */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">₹{product.price}</span>
                  {product.mrp > product.price && (
                    <>
                      <span className="text-base text-slate-400 line-through">₹{product.mrp}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Save ₹{product.mrp - product.price}
                      </span>
                    </>
                  )}
                </div>

                {/* Weight Selector */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Pack Size / Weight
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedWeight(product.weight)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm border border-emerald-600"
                    >
                      {product.weight}
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Description
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Nutrition Facts */}
                {product.nutrition && Object.keys(product.nutrition).length > 0 && (
                  <div className="mt-4 p-3 rounded-2xl bg-slate-100/70 border border-slate-200/60">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Nutritional Info (per serving)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {product.nutrition.calories && (
                        <div className="bg-white p-2 rounded-xl border border-slate-200/50">
                          <span className="text-slate-400 block text-[10px]">Calories</span>
                          <strong className="text-slate-800">{product.nutrition.calories}</strong>
                        </div>
                      )}
                      {product.nutrition.protein && (
                        <div className="bg-white p-2 rounded-xl border border-slate-200/50">
                          <span className="text-slate-400 block text-[10px]">Protein</span>
                          <strong className="text-slate-800">{product.nutrition.protein}</strong>
                        </div>
                      )}
                      {product.nutrition.carbs && (
                        <div className="bg-white p-2 rounded-xl border border-slate-200/50">
                          <span className="text-slate-400 block text-[10px]">Carbs</span>
                          <strong className="text-slate-800">{product.nutrition.carbs}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart Actions */}
              <div className="pt-4 border-t border-slate-200/80">
                {quantityInCart === 0 ? (
                  <button
                    onClick={handleAdd}
                    className="w-full btn-emerald py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-xl shadow-emerald-600/30"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-2xl bg-emerald-50 border border-emerald-300">
                    <span className="text-xs font-bold text-emerald-900 pl-3">Item in Basket</span>
                    <div className="flex items-center bg-emerald-600 text-white rounded-xl p-1 shadow-md">
                      <button
                        onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                        className="w-8 h-8 rounded-lg hover:bg-emerald-700 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-black text-sm">{quantityInCart}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                        className="w-8 h-8 rounded-lg hover:bg-emerald-700 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-4">
                Similar Fresh Items You Might Like
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarProducts.map((simProd) => (
                  <ProductCard key={simProd.id} product={simProd} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
