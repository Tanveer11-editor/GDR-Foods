import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, X, Sparkles, Clock, Trash2 } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useUserStore } from '../store/useUserStore';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { ProductDetailModal } from '../components/catalog/ProductDetailModal';
import { MOCK_CATEGORIES } from '../data/mockCategories';
import { Product } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const { products } = useProductStore();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useUserStore();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState<'relevance' | 'price-asc' | 'price-desc' | 'discount' | 'rating'>('relevance');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
  }, [query]);

  // Autocomplete search suggestions (e.g. typing "tom" -> Tomato, Country Hydroponic Tomatoes)
  const autocompleteSuggestions = query.trim().length >= 2
    ? Array.from(new Set(
        products
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
          .map((p) => p.name)
      )).slice(0, 5)
    : [];

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    const matchesQuery = query.trim() === '' ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesOrganic = !organicOnly || p.isOrganic;
    const matchesDiscount = !discountOnly || p.discount >= 20;

    return matchesQuery && matchesCategory && matchesOrganic && matchesDiscount;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'price-asc') return a.price - b.price;
    if (selectedSort === 'price-desc') return b.price - a.price;
    if (selectedSort === 'discount') return b.discount - a.discount;
    if (selectedSort === 'rating') return b.rating - a.rating;
    return 0; // relevance
  });

  const popularSearches = ['Tomato', 'Basmati Rice', 'Milk', 'Organic Apple', 'Avocado', 'Sourdough', 'Salmon'];

  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    setSearchParams({ q: text, category: selectedCategory });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/80 space-y-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search fresh apples, tomatoes, milk, basmati..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams({ q: e.target.value, category: selectedCategory });
            }}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl glass-input text-base text-slate-800 focus:outline-none shadow-sm"
          />
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSearchParams({});
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown Pills */}
        {autocompleteSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/60">
            <span className="text-xs font-bold text-slate-400 self-center">Suggestions:</span>
            {autocompleteSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSuggestion(sug)}
                className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Recent & Popular Search Pills when query is empty */}
        {!query && (
          <div className="space-y-3 pt-2">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Recent Searches
                  </span>
                  <button onClick={clearRecentSearches} className="text-slate-400 hover:text-slate-600">
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((rec, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(rec)}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200"
                    >
                      {rec}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-2">Popular Trending Items:</span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((pop, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(pop)}
                    className="px-3 py-1 rounded-xl bg-emerald-50/60 text-emerald-800 text-xs font-medium hover:bg-emerald-100 border border-emerald-200/60"
                  >
                    🔥 {pop}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'all' ? 'btn-emerald' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              All Items
            </button>
            {MOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'btn-emerald'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Organic filter toggle */}
            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all ${
                organicOnly ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Organic</span>
            </button>

            {/* Discount filter toggle */}
            <button
              onClick={() => setDiscountOnly(!discountOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                discountOnly ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              20%+ OFF
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg text-slate-900">
          {query ? `Results for "${query}"` : 'All Catalog Items'}
          <span className="text-xs text-slate-500 font-normal ml-2">({sortedProducts.length} items found)</span>
        </h3>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={sortedProducts}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
