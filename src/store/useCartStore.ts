import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Coupon } from '../types';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isDrawerOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
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

      addItem: (product, quantity = 1) => {
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
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

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
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getMrpTotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
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
