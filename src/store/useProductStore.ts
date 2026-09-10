import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface ProductState {
  products: Product[];
  selectedCategory: string | null;
  searchQuery: string;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetProductsToDefault: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      selectedCategory: null,
      searchQuery: '',

      setProducts: (products) => set({ products }),

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `prod-${Date.now()}`,
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
      },

      updateProduct: (id, updated) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      updateStock: (id, newStock) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p)),
        }));
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
