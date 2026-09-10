import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'StoreManager';
}

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  adminLogin: (username: string, pass: string) => { success: boolean; message: string };
  adminLogout: () => void;
}

const DEMO_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'GDR Operations Admin',
  email: 'admin@gdrfoods.com',
  role: 'SuperAdmin',
};

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: true, // Default seeded logged-in for seamless testing
      adminUser: DEMO_ADMIN,

      adminLogin: (username, pass) => {
        const cleaned = username.trim().toLowerCase();
        if ((cleaned === 'admin@gdrfoods.com' || cleaned === 'admin') && pass === 'Admin@123') {
          set({
            isAdminLoggedIn: true,
            adminUser: DEMO_ADMIN,
          });
          return { success: true, message: 'Authenticated to GDR Admin Console' };
        }

        if (cleaned.length >= 3 && pass.length >= 6) {
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

        return { success: false, message: 'Invalid admin credentials. Use demo: admin@gdrfoods.com / Admin@123' };
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
