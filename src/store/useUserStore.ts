import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address } from '../types';
import { MOCK_ADDRESSES } from '../data/mockAddresses';

interface UserState {
  userName: string;
  userEmail: string;
  userPhone: string;
  addresses: Address[];
  selectedAddressId: string;
  wishlist: string[]; // product IDs
  selectedLocationLabel: string;
  deliveryEtaLabel: string;
  recentSearches: string[];

  // Actions
  setUserInfo: (name: string, email: string, phone: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setSelectedAddress: (id: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setSelectedLocation: (label: string, eta?: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userName: 'Mohammed Tanveer',
      userEmail: 'tanveer@gdrfoods.com',
      userPhone: '+91 98765 43210',
      addresses: MOCK_ADDRESSES,
      selectedAddressId: 'addr-1',
      wishlist: ['prod-1', 'prod-4', 'prod-7', 'prod-13'],
      selectedLocationLabel: 'Home - Indiranagar, Bengaluru',
      deliveryEtaLabel: '25–30 min',
      recentSearches: ['Tomato', 'Basmati Rice', 'Organic Milk', 'Croissant'],

      setUserInfo: (name, email, phone) => set({ userName: name, userEmail: email, userPhone: phone }),

      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: `addr-${Date.now()}`,
        };
        set((state) => {
          const updated = [...state.addresses, newAddress];
          return {
            addresses: updated,
            selectedAddressId: newAddress.isDefault ? newAddress.id : state.selectedAddressId,
          };
        });
      },

      updateAddress: (id, updated) => {
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...updated } : a)),
        }));
      },

      deleteAddress: (id) => {
        set((state) => {
          const filtered = state.addresses.filter((a) => a.id !== id);
          const newSelected = state.selectedAddressId === id && filtered.length > 0 ? filtered[0].id : state.selectedAddressId;
          return { addresses: filtered, selectedAddressId: newSelected };
        });
      },

      setSelectedAddress: (id) => set({ selectedAddressId: id }),

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        });
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      setSelectedLocation: (label, eta = '20–30 min') => set({ selectedLocationLabel: label, deliveryEtaLabel: eta }),

      addRecentSearch: (query) => {
        const cleaned = query.trim();
        if (!cleaned) return;
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s.toLowerCase() !== cleaned.toLowerCase());
          return { recentSearches: [cleaned, ...filtered].slice(0, 8) };
        });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'gdr_user_store',
    }
  )
);
