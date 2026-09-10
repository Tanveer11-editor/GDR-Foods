import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { MOCK_CATEGORIES } from '../data/mockCategories';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { ProductDetailModal } from '../components/catalog/ProductDetailModal';
import { Product } from '../types';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { products } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const currentCategory = MOCK_CATEGORIES.find((c) => c.slug === categorySlug) || MOCK_CATEGORIES[0];

  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === currentCategory.name.toLowerCase()
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-dark border border-emerald-500/30 p-6 sm:p-8 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {currentCategory.description}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{categoryProducts.length} items available for 25 min delivery</span>
          </div>
        </div>

        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-white/40 shadow-2xl shrink-0">
          <img
            src={currentCategory.image}
            alt={currentCategory.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
        {MOCK_CATEGORIES.map((cat) => {
          const isActive = cat.slug === categorySlug;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
                isActive
                  ? 'btn-emerald border-emerald-600 shadow-md'
                  : 'bg-white/80 text-slate-700 border-slate-200/80 hover:bg-white'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={categoryProducts}
        onSelectProduct={(p) => setSelectedProduct(p)}
        emptyTitle={`No items in ${currentCategory.name}`}
        emptyDescription="We are currently restocking this section. Check back shortly!"
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
