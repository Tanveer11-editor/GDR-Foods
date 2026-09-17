import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address } from '../types';
import { MOCK_ADDRESSES } from '../data/mockAddresses';
import { supabase } from '../lib/supabaseClient';

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
  fetchUserData: (customerId: string) => Promise<void>;
  setUserInfo: (name: string, email: string, phone: string) => void;
  addAddress: (address: Omit<Address, 'id'>, customerId?: string) => void;
  updateAddress: (id: string, address: Partial<Address>, customerId?: string) => void;
  deleteAddress: (id: string, customerId?: string) => void;
  setSelectedAddress: (id: string) => void;
  toggleWishlist: (productId: string, customerId?: string) => void;
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

      fetchUserData: async (customerId) => {
        if (!customerId) return;
        try {
          // Fetch addresses
          const { data: addrData } = await supabase.from('addresses').select('*').eq('customer_id', customerId);
          if (addrData && addrData.length > 0) {
            const mappedAddresses: Address[] = addrData.map((a: any) => ({
              id: a.id,
              label: a.label,
              name: a.name,
              phone: a.phone,
              street: a.street,
              apartment: a.apartment,
              city: a.city,
              pincode: a.pincode,
              isDefault: a.is_default,
            }));
            const defaultAddr = mappedAddresses.find((a) => a.isDefault) || mappedAddresses[0];
            set({ addresses: mappedAddresses, selectedAddressId: defaultAddr.id });
          }

          // Fetch wishlist
          const { data: wishData } = await supabase.from('wishlist_items').select('product_id').eq('customer_id', customerId);
          if (wishData) {
            set({ wishlist: wishData.map((w: any) => w.product_id) });
          }
        } catch (e) {
          console.warn('User data Supabase sync warning:', e);
        }
      },

      setUserInfo: (name, email, phone) => set({ userName: name, userEmail: email, userPhone: phone }),

      addAddress: (addressData, customerId) => {
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

        if (customerId) {
          (async () => {
            try {
              await supabase.from('addresses').insert([{
                id: newAddress.id,
                customer_id: customerId,
                label: newAddress.label,
                name: newAddress.name,
                phone: newAddress.phone,
                street: newAddress.street,
                apartment: newAddress.apartment,
                city: newAddress.city,
                pincode: newAddress.pincode,
                is_default: newAddress.isDefault,
              }]);
            } catch (e) {
              console.warn('Supabase add address error:', e);
            }
          })();
        }
      },

      updateAddress: (id, updated, customerId) => {
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...updated } : a)),
        }));

        if (customerId) {
          (async () => {
            try {
              await supabase.from('addresses').update(updated).eq('id', id);
            } catch (e) {
              console.warn('Supabase update address error:', e);
            }
          })();
        }
      },

      deleteAddress: (id, customerId) => {
        set((state) => {
          const filtered = state.addresses.filter((a) => a.id !== id);
          const newSelected = state.selectedAddressId === id && filtered.length > 0 ? filtered[0].id : state.selectedAddressId;
          return { addresses: filtered, selectedAddressId: newSelected };
        });

        if (customerId) {
          (async () => {
            try {
              await supabase.from('addresses').delete().eq('id', id);
            } catch (e) {
              console.warn('Supabase delete address error:', e);
            }
          })();
        }
      },

      setSelectedAddress: (id) => set({ selectedAddressId: id }),

      toggleWishlist: (productId, customerId) => {
        const exists = get().wishlist.includes(productId);
        set((state) => ({
          wishlist: exists
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        }));

        if (customerId) {
          (async () => {
            try {
              if (exists) {
                await supabase.from('wishlist_items').delete().match({ customer_id: customerId, product_id: productId });
              } else {
                await supabase.from('wishlist_items').insert([{ customer_id: customerId, product_id: productId }]);
              }
            } catch (e) {
              console.warn('Supabase wishlist toggle error:', e);
            }
          })();
        }
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
