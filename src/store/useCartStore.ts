import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Coupon } from '../types';
import { supabase } from '../lib/supabaseClient';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isDrawerOpen: boolean;
  
  // Actions
  syncWithSupabase: (customerId: string) => Promise<void>;
  addItem: (product: Product, quantity?: number, customerId?: string) => void;
  removeItem: (productId: string, customerId?: string) => void;
  updateQuantity: (productId: string, quantity: number, customerId?: string) => void;
  clearCart: (customerId?: string) => void;
  applyCoupon: (coupon: Coupon) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  
  // Calculated getters
  getSubtotal: () => number;
  getMrpTotal: () => number;
  getItemDiscount: () => number;
  getCouponDiscount: () => number;
  getDeliveryFee: () => number;
  getPlatformFee: () => number;
  getTotalSavings: () => number;
  getTotalAmount: () => number;
  getFreeDeliveryThreshold: () => number;
  getRemainingForFreeDelivery: () => number;
}

const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 29;
const PLATFORM_FEE = 5;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isDrawerOpen: false,

      syncWithSupabase: async (customerId) => {
        if (!customerId) return;
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('product_id, quantity, products(*)')
            .eq('customer_id', customerId);

          if (!error && data) {
            const remoteItems: CartItem[] = data.map((row: any) => ({
              product: row.products ? {
                id: row.products.id,
                name: row.products.name,
                category: row.products.category,
                image: row.products.image,
                description: row.products.description,
                weight: row.products.weight,
                price: Number(row.products.price),
                mrp: Number(row.products.mrp),
                discount: Number(row.products.discount),
                stock: Number(row.products.stock),
                rating: Number(row.products.rating),
                reviewsCount: Number(row.products.reviews_count || 0),
                brand: row.products.brand,
                tags: row.products.tags || [],
              } : { id: row.product_id, name: 'Product', price: 0, mrp: 0, category: 'General', image: '', description: '', weight: '', discount: 0, stock: 0, rating: 5, reviewsCount: 0, brand: 'GDR', tags: [] },
              quantity: row.quantity,
            }));
            if (remoteItems.length > 0) {
              set({ items: remoteItems });
            }
          }
        } catch (e) {
          console.warn('Cart Supabase sync warning:', e);
        }
      },

      addItem: (product, quantity = 1, customerId) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.product.id === product.id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            return { items: [...state.items, { product, quantity }] };
          }
        });

        if (customerId) {
          (async () => {
            try {
              const currentItem = get().items.find((i) => i.product.id === product.id);
              const totalQty = currentItem ? currentItem.quantity : quantity;
              await supabase
                .from('cart_items')
                .upsert({ customer_id: customerId, product_id: product.id, quantity: totalQty });
            } catch (e) {
              console.warn('Supabase cart insert error:', e);
            }
          })();
        }
      },

      removeItem: (productId, customerId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));

        if (customerId) {
          (async () => {
            try {
              await supabase
                .from('cart_items')
                .delete()
                .match({ customer_id: customerId, product_id: productId });
            } catch (e) {
              console.warn('Supabase cart delete error:', e);
            }
          })();
        }
      },

      updateQuantity: (productId, quantity, customerId) => {
        if (quantity <= 0) {
          get().removeItem(productId, customerId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));

        if (customerId) {
          (async () => {
            try {
              await supabase
                .from('cart_items')
                .update({ quantity })
                .match({ customer_id: customerId, product_id: productId });
            } catch (e) {
              console.warn('Supabase cart update error:', e);
            }
          })();
        }
      },

      clearCart: (customerId) => {
        set({ items: [], appliedCoupon: null });
        if (customerId) {
          (async () => {
            try {
              await supabase
                .from('cart_items')
                .delete()
                .eq('customer_id', customerId);
            } catch (e) {
              console.warn('Supabase cart clear error:', e);
            }
          })();
        }
      },

      applyCoupon: (coupon) => {
        const subtotal = get().getSubtotal();
        if (subtotal < coupon.minOrder) {
          return {
            success: false,
            message: `Minimum order amount of ₹${coupon.minOrder} required for coupon ${coupon.code}`,
          };
        }
        set({ appliedCoupon: coupon });
        return {
          success: true,
          message: `Coupon ${coupon.code} applied successfully!`,
        };
      },

      removeCoupon: () => set({ appliedCoupon: null }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
      },

      getMrpTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.product?.mrp || item.product?.price || 0) * item.quantity, 0);
      },

      getItemDiscount: () => {
        return get().getMrpTotal() - get().getSubtotal();
      },

      getCouponDiscount: () => {
        const coupon = get().appliedCoupon;
        const subtotal = get().getSubtotal();
        if (!coupon || subtotal < coupon.minOrder) return 0;

        if (coupon.discountType === 'flat') {
          return coupon.discountValue;
        } else if (coupon.discountType === 'percentage') {
          const discount = (subtotal * coupon.discountValue) / 100;
          return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
        }
        return 0;
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const coupon = get().appliedCoupon;
        if (coupon?.code === 'FREEDELIVERY' || subtotal >= FREE_DELIVERY_THRESHOLD) {
          return 0;
        }
        return STANDARD_DELIVERY_FEE;
      },

      getPlatformFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 0 ? PLATFORM_FEE : 0;
      },

      getTotalSavings: () => {
        return get().getItemDiscount() + get().getCouponDiscount();
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const couponDiscount = get().getCouponDiscount();
        const deliveryFee = get().getDeliveryFee();
        const platformFee = get().getPlatformFee();
        return Math.max(0, subtotal - couponDiscount + deliveryFee + platformFee);
      },

      getFreeDeliveryThreshold: () => FREE_DELIVERY_THRESHOLD,

      getRemainingForFreeDelivery: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
      },
    }),
    {
      name: 'gdr_cart_store',
      partialize: (state) => ({ items: state.items, appliedCoupon: state.appliedCoupon }),
    }
  )
);
