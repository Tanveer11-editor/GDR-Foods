import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'StoreManager';
}

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  adminLogin: (username: string, pass: string) => Promise<{ success: boolean; message: string }>;
  adminLogout: () => void;
}

export const DEMO_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'GDR Operations Admin',
  email: 'admin@gdrfoods.com',
  role: 'SuperAdmin',
};

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      adminUser: null,

      adminLogin: async (username, pass) => {
        const cleaned = username.trim().toLowerCase();

        // Strict Isolation: Explicitly reject customer credentials on admin login
        if (
          cleaned === 'customer@gdrfoods.com' ||
          cleaned === 'customer' ||
          cleaned === '9876543210' ||
          pass === 'Customer@123'
        ) {
          return { success: false, message: 'Invalid email or password' };
        }

        // 1. Try server-side Supabase Postgres RPC verification
        try {
          const { data, error } = await supabase.rpc('verify_admin_password', {
            p_username: cleaned,
            p_password: pass,
          });

          if (!error && data && data.length > 0) {
            const res = data[0];
            if (res.success) {
              const admin: AdminUser = {
                id: res.id || 'admin-001',
                name: res.name || 'GDR Operations Admin',
                email: res.username || cleaned,
                role: (res.role as any) || 'SuperAdmin',
              };
              set({ isAdminLoggedIn: true, adminUser: admin });
              return { success: true, message: 'Authenticated to GDR Admin Console' };
            }
          }
        } catch (e) {
          console.warn('Supabase admin RPC call fallback:', e);
        }

        // 2. Demo admin credentials validation (local/offline fallback)
        if ((cleaned === 'admin@gdrfoods.com' || cleaned === 'admin') && pass === 'Admin@123') {
          set({
            isAdminLoggedIn: true,
            adminUser: DEMO_ADMIN,
          });
          return { success: true, message: 'Authenticated to GDR Admin Console' };
        }

        // Custom admin account login (must use Admin password)
        if (cleaned.length >= 3 && pass === 'Admin@123') {
          set({
            isAdminLoggedIn: true,
            adminUser: {
              id: `admin-${Date.now()}`,
              name: 'GDR Admin Manager',
              email: cleaned.includes('@') ? cleaned : `${cleaned}@gdrfoods.com`,
              role: 'StoreManager',
            },
          });
          return { success: true, message: 'Admin login successful!' };
        }

        return { success: false, message: 'Invalid email or password' };
      },

      adminLogout: () => {
        set({ isAdminLoggedIn: false, adminUser: null });
      },
    }),
    {
      name: 'gdr_admin_session',
    }
  )
);
