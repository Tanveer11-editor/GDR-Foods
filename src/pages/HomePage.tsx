import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Clock, ShieldCheck, ArrowRight, Zap, Flame, Award, RefreshCw } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { MOCK_CATEGORIES } from '../data/mockCategories';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCarousel } from '../components/catalog/ProductCarousel';
import { ProductDetailModal } from '../components/catalog/ProductDetailModal';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Curated collections
  const freshPicks = products.filter((p) => p.isFreshPick);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const todaysDeals = products.filter((p) => p.discount >= 20 || p.isTodayDeal);
  const quickEssentials = products.filter((p) => p.isQuickEssential);
  const premiumSelection = products.filter((p) => p.isPremium);

  return (
    <div className="space-y-8 pb-12">
      {/* HERO SECTION — Emerald Flow Organic Motion */}
      <section className="relative rounded-3xl overflow-hidden glass-panel-dark border border-emerald-500/30 p-6 sm:p-12 shadow-2xl text-white">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-float pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-extrabold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>20–30 Min Express Delivery Guaranteed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Freshness, delivered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 drop-shadow-sm">
              straight to your door.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed max-w-xl">
            Orchard-fresh fruits, hydroponic crisp vegetables, pure A2 dairy, artisan sourdough, and everyday kitchen essentials — packed cold and delivered fast.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => navigate('/search')}
              className="btn-emerald px-6 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-emerald-500/40"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#fresh-picks"
              className="px-6 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 transition-all flex items-center gap-2 shadow-sm"
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>Explore Fresh Picks</span>
            </a>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-800/80 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-bold text-emerald-100">25 Min ETA</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-bold text-emerald-100">100% Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-bold text-emerald-100">Quality Checked</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">Handpicked farm produce and pantry essentials</p>
          </div>
          <Link
            to="/category/fruits"
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All (12)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid (Swipeable / Scrollable on mobile) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3 sm:gap-4">
          {MOCK_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* TODAY'S DEALS SECTION */}
      {todaysDeals.length > 0 && (
        <ProductCarousel
          title="Today's Super Deals"
          subtitle="Extra savings on everyday staples & fresh fruits"
          products={todaysDeals}
          badge="Up to 28% OFF"
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* FRESH PICKS SECTION */}
      <div id="fresh-picks">
        <ProductCarousel
          title="Fresh Orchard & Farm Picks"
          subtitle="Harvested this morning & delivered within hours"
          products={freshPicks}
          badge="Farm Fresh"
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      </div>

      {/* BEST SELLERS SECTION */}
      <ProductCarousel
        title="Bestsellers in Your Neighborhood"
        subtitle="Top rated items ordered most frequently by customers"
        products={bestSellers}
        badge="Popular"
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* QUICK ESSENTIALS SECTION */}
      <ProductCarousel
        title="Quick Daily Essentials"
        subtitle="Daily top-ups: milk, eggs, bread, atta & curd"
        products={quickEssentials}
        badge="Daily Top-up"
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* PREMIUM SELECTION SECTION */}
      {premiumSelection.length > 0 && (
        <ProductCarousel
          title="GDR Reserve — Premium Gourmet"
          subtitle="Artisanal sourdough, salmon fillets & imported avocados"
          products={premiumSelection}
          badge="Premium"
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
