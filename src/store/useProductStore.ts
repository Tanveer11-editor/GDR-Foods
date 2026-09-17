import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { supabase } from '../lib/supabaseClient';

interface ProductState {
  products: Product[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  fetchProducts: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetProductsToDefault: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: MOCK_PRODUCTS,
      selectedCategory: null,
      searchQuery: '',
      isLoading: false,

      fetchProducts: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.from('products').select('*').order('name');
          if (!error && data && data.length > 0) {
            const mappedProducts: Product[] = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              image: item.image,
              description: item.description,
              weight: item.weight,
              price: Number(item.price),
              mrp: Number(item.mrp),
              discount: Number(item.discount),
              stock: Number(item.stock),
              rating: Number(item.rating),
              reviewsCount: Number(item.reviews_count || item.reviewsCount || 0),
              nutrition: item.nutrition,
              brand: item.brand,
              tags: item.tags || [],
              isOrganic: Boolean(item.is_organic),
              isBestSeller: Boolean(item.is_bestseller),
              isFreshPick: Boolean(item.is_fresh_pick),
              isTodayDeal: Boolean(item.is_today_deal),
              isQuickEssential: Boolean(item.is_quick_essential),
              isPremium: Boolean(item.is_premium),
            }));
            set({ products: mappedProducts, isLoading: false });
            return;
          }
        } catch (e) {
          console.warn('Supabase products fetch fallback to persistent state:', e);
        }
        set({ isLoading: false });
      },

      setProducts: (products) => set({ products }),

      addProduct: async (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `prod-${Date.now()}`,
        };
        // Optimistic UI update
        set((state) => ({ products: [newProduct, ...state.products] }));

        // Background sync to Supabase
        try {
          await supabase.from('products').insert([{
            id: newProduct.id,
            name: newProduct.name,
            category: newProduct.category,
            image: newProduct.image,
            description: newProduct.description,
            weight: newProduct.weight,
            price: newProduct.price,
            mrp: newProduct.mrp,
            discount: newProduct.discount,
            stock: newProduct.stock,
            rating: newProduct.rating,
            reviews_count: newProduct.reviewsCount,
            nutrition: newProduct.nutrition,
            brand: newProduct.brand,
            tags: newProduct.tags,
            is_organic: newProduct.isOrganic,
            is_bestseller: newProduct.isBestSeller,
            is_fresh_pick: newProduct.isFreshPick,
            is_today_deal: newProduct.isTodayDeal,
            is_quick_essential: newProduct.isQuickEssential,
            is_premium: newProduct.isPremium,
          }]);
        } catch (e) {
          console.warn('Supabase add product background sync error:', e);
        }
      },

      updateProduct: async (id, updated) => {
        // Optimistic UI update
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));

        // Background sync to Supabase
        try {
          const payload: any = {};
          if (updated.name !== undefined) payload.name = updated.name;
          if (updated.category !== undefined) payload.category = updated.category;
          if (updated.image !== undefined) payload.image = updated.image;
          if (updated.price !== undefined) payload.price = updated.price;
          if (updated.mrp !== undefined) payload.mrp = updated.mrp;
          if (updated.stock !== undefined) payload.stock = updated.stock;
          if (updated.discount !== undefined) payload.discount = updated.discount;
          if (updated.isOrganic !== undefined) payload.is_organic = updated.isOrganic;
          if (updated.isFreshPick !== undefined) payload.is_fresh_pick = updated.isFreshPick;

          await supabase.from('products').update(payload).eq('id', id);
        } catch (e) {
          console.warn('Supabase update product error:', e);
        }
      },

      deleteProduct: async (id) => {
        // Optimistic UI update
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        // Background sync to Supabase
        try {
          await supabase.from('products').delete().eq('id', id);
        } catch (e) {
          console.warn('Supabase delete product error:', e);
        }
      },

      updateStock: async (id, newStock) => {
        const safeStock = Math.max(0, newStock);
        // Optimistic UI update
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock: safeStock } : p)),
        }));

        // Background sync to Supabase
        try {
          await supabase.from('products').update({ stock: safeStock }).eq('id', id);
        } catch (e) {
          console.warn('Supabase update stock error:', e);
        }
      },

      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      resetProductsToDefault: () => set({ products: MOCK_PRODUCTS }),
    }),
    {
      name: 'gdr_products_store',
    }
  )
);
