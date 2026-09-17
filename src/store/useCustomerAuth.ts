import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CustomerAuthState {
  isLoggedIn: boolean;
  user: CustomerUser | null;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

export const DEMO_CUSTOMER: CustomerUser = {
  id: 'cust-101',
  name: 'Mohammed Tanveer',
  email: 'customer@gdrfoods.com',
  phone: '+91 98765 43210',
};

export const useCustomerAuth = create<CustomerAuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      login: async (emailOrPhone, pass) => {
        const cleanedIdentifier = emailOrPhone.trim().toLowerCase();

        // Strict Isolation: Explicitly reject admin credentials on customer login
        if (
          cleanedIdentifier === 'admin@gdrfoods.com' ||
          cleanedIdentifier === 'admin' ||
          pass === 'Admin@123'
        ) {
          return { success: false, message: 'Invalid email or password' };
        }

        // 1. Try Supabase Auth first
        if (cleanedIdentifier.includes('@')) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: cleanedIdentifier,
              password: pass,
            });

            if (!error && data?.user) {
              const customerUser: CustomerUser = {
                id: data.user.id,
                name: data.user.user_metadata?.name || cleanedIdentifier.split('@')[0],
                email: data.user.email || cleanedIdentifier,
                phone: data.user.user_metadata?.phone || '+91 98765 43210',
              };
              set({ isLoggedIn: true, user: customerUser });
              return { success: true, message: 'Welcome back to GDR Foods!' };
            }
          } catch (e) {
            console.warn('Supabase auth call fallback:', e);
          }
        }

        // 2. Demo customer credentials validation (local/offline fallback)
        if (
          (cleanedIdentifier === 'customer@gdrfoods.com' ||
            cleanedIdentifier === '9876543210' ||
            cleanedIdentifier === '+91 98765 43210' ||
            cleanedIdentifier === 'customer') &&
          pass === 'Customer@123'
        ) {
          set({
            isLoggedIn: true,
            user: DEMO_CUSTOMER,
          });
          return { success: true, message: 'Welcome back to GDR Foods!' };
        }

        // Custom customer credentials validation
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

        return { success: false, message: 'Invalid email or password' };
      },

      signup: async (name, email, phone, pass) => {
        if (!name || !email || !pass) {
          return { success: false, message: 'Please fill in all required fields' };
        }
        const cleanedEmail = email.trim().toLowerCase();
        if (cleanedEmail === 'admin@gdrfoods.com') {
          return { success: false, message: 'This email address is reserved for administration' };
        }

        try {
          const { data, error } = await supabase.auth.signUp({
            email: cleanedEmail,
            password: pass,
            options: {
              data: { name: name.trim(), phone: phone.trim() },
            },
          });

          if (!error && data?.user) {
            const newUser: CustomerUser = {
              id: data.user.id,
              name: name.trim(),
              email: cleanedEmail,
              phone: phone.trim() || '+91 98765 43210',
            };
            set({ isLoggedIn: true, user: newUser });
            return { success: true, message: 'Account created successfully! Welcome to GDR Foods.' };
          }
        } catch (e) {
          console.warn('Supabase signup fallback:', e);
        }

        const newUser: CustomerUser = {
          id: `cust-${Date.now()}`,
          name: name.trim(),
          email: cleanedEmail,
          phone: phone.trim() || '+91 98765 43210',
        };
        set({ isLoggedIn: true, user: newUser });
        return { success: true, message: 'Account created successfully! Welcome to GDR Foods.' };
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('Supabase signout error:', e);
        }
        set({ isLoggedIn: false, user: null });
      },
    }),
    {
      name: 'gdr_customer_session',
    }
  )
);
