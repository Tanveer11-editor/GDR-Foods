import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PackagePlus } from 'lucide-react';
import { Product } from '../../types';
import { useProductStore } from '../../store/useProductStore';
import { MOCK_CATEGORIES } from '../../data/mockCategories';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  editProduct,
}) => {
  const { addProduct, updateProduct } = useProductStore();

  const [name, setName] = useState(editProduct?.name || '');
  const [category, setCategory] = useState(editProduct?.category || MOCK_CATEGORIES[0].name);
  const [image, setImage] = useState(
    editProduct?.image || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80'
  );
  const [description, setDescription] = useState(editProduct?.description || '');
  const [weight, setWeight] = useState(editProduct?.weight || '500 g');
  const [price, setPrice] = useState(editProduct?.price || 100);
  const [mrp, setMrp] = useState(editProduct?.mrp || 120);
  const [stock, setStock] = useState(editProduct?.stock || 50);
  const [brand, setBrand] = useState(editProduct?.brand || 'GDR Fresh');
  const [isOrganic, setIsOrganic] = useState(editProduct?.isOrganic || false);
  const [isFreshPick, setIsFreshPick] = useState(editProduct?.isFreshPick || false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const productPayload = {
      name,
      category,
      image,
      description,
      weight,
      price: Number(price),
      mrp: Number(mrp),
      discount,
      stock: Number(stock),
      rating: editProduct?.rating || 4.8,
      reviewsCount: editProduct?.reviewsCount || 10,
      brand,
      tags: [category, isOrganic ? 'Organic' : 'Fresh'],
      isOrganic,
      isFreshPick,
    };

    if (editProduct) {
      updateProduct(editProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl relative border border-white/80 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <PackagePlus className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                {editProduct ? 'Edit Product' : 'Add New Product to Store'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Red Fuji Apples"
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none bg-white"
                >
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">MRP (₹)</label>
                <input
                  type="number"
                  required
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Stock Units</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Weight / Unit (e.g. 500g)</label>
              <input
                type="text"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Image URL</label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Product Description</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-700">Organic Certified</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFreshPick}
                  onChange={(e) => setIsFreshPick(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-700">Fresh Pick Banner</span>
              </label>
            </div>

            <div className="pt-3">
              <button type="submit" className="w-full btn-emerald py-3 rounded-2xl text-xs font-extrabold shadow-lg">
                {editProduct ? 'Save Product Changes' : 'Publish Product to Store'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
