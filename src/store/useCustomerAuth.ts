import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CustomerAuthState {
  isLoggedIn: boolean;
  user: CustomerUser | null;
  login: (emailOrPhone: string, pass: string) => { success: boolean; message: string };
  signup: (name: string, email: string, phone: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
}

const DEMO_CUSTOMER: CustomerUser = {
  id: 'cust-101',
  name: 'Mohammed Tanveer',
  email: 'customer@gdrfoods.com',
  phone: '+91 98765 43210',
};

export const useCustomerAuth = create<CustomerAuthState>()(
  persist(
    (set) => ({
      isLoggedIn: true, // Default seeded logged-in for seamless experience
      user: DEMO_CUSTOMER,

      login: (emailOrPhone, pass) => {
        const cleanedIdentifier = emailOrPhone.trim().toLowerCase();
        // Demo authentication validation
        if (
          (cleanedIdentifier === 'customer@gdrfoods.com' || cleanedIdentifier === '9876543210' || cleanedIdentifier === '+91 98765 43210' || cleanedIdentifier === 'customer') &&
          pass === 'Customer@123'
        ) {
          set({
            isLoggedIn: true,
            user: DEMO_CUSTOMER,
          });
          return { success: true, message: 'Welcome back to GDR Foods!' };
        }

        // Generic user fallback for custom entries
        if (pass.length >= 6 && (cleanedIdentifier.includes('@') || cleanedIdentifier.length >= 10)) {
          set({
            isLoggedIn: true,
            user: {
              id: `cust-${Date.now()}`,
              name: cleanedIdentifier.includes('@') ? cleanedIdentifier.split('@')[0] : 'GDR Customer',
              email: cleanedIdentifier.includes('@') ? cleanedIdentifier : 'customer@gdrfoods.com',
              phone: '+91 98765 43210',
            },
          });
          return { success: true, message: 'Logged in successfully!' };
        }

        return { success: false, message: 'Invalid credentials. Use demo: customer@gdrfoods.com / Customer@123' };
      },

      signup: (name, email, phone, pass) => {
        if (!name || !email || !pass) {
          return { success: false, message: 'Please fill in all required fields' };
        }
        const newUser: CustomerUser = {
          id: `cust-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || '+91 98765 43210',
        };
        set({ isLoggedIn: true, user: newUser });
        return { success: true, message: 'Account created successfully! Welcome to GDR Foods.' };
      },

      logout: () => {
        set({ isLoggedIn: false, user: null });
      },
    }),
    {
      name: 'gdr_customer_session',
    }
  )
);
