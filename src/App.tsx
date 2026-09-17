import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CustomerLoginPage } from './pages/CustomerLoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';

import { useProductStore } from './store/useProductStore';
import { useCustomerAuth } from './store/useCustomerAuth';
import { useCartStore } from './store/useCartStore';
import { useUserStore } from './store/useUserStore';
import { useOrderStore } from './store/useOrderStore';

export const App: React.FC = () => {
  const { fetchProducts } = useProductStore();
  const { user, isLoggedIn } = useCustomerAuth();
  const { syncWithSupabase: syncCart } = useCartStore();
  const { fetchUserData } = useUserStore();
  const { fetchOrders } = useOrderStore();

  React.useEffect(() => {
    fetchProducts();
    if (isLoggedIn && user?.id) {
      syncCart(user.id);
      fetchUserData(user.id);
      fetchOrders(user.id);
    }
  }, [isLoggedIn, user?.id]);

  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 relative">
          {/* Header */}
          <Header />

          {/* Main Container */}
          <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 sm:pt-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              
              {/* Separate Login Routes */}
              <Route path="/login" element={<CustomerLoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Customer Protected Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-success/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-tracking/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderTrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardPage />
                  </AdminProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Slide-over Cart Drawer */}
          <CartDrawer />

          {/* Mobile Bottom Navigation */}
          <BottomNav />

          {/* Footer */}
          <Footer />
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;
