import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Search, Clock, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const BottomNav: React.FC = () => {
  const { items, getTotalAmount, toggleDrawer } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = getTotalAmount();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Floating Sticky Cart Indicator Bar if Cart is Non-Empty */}
      {cartItemCount > 0 && (
        <div className="px-4 pb-2 pointer-events-auto">
          <button
            onClick={toggleDrawer}
            className="w-full btn-emerald p-3 rounded-2xl flex items-center justify-between shadow-2xl shadow-emerald-600/40 border border-emerald-400/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs text-white">
                {cartItemCount}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-emerald-100">{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart</p>
                <p className="text-sm font-extrabold text-white">₹{totalAmount}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-xl">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="glass-nav border-t border-slate-200/80 px-2 py-2.5 flex items-center justify-around pointer-events-auto bg-white/90 backdrop-blur-xl">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition-all ${
              isActive ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/category/fruits"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition-all ${
              isActive ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Grid className="w-5 h-5" />
          <span>Categories</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition-all ${
              isActive ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </NavLink>

        <NavLink
          to="/account?tab=orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition-all ${
              isActive ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Clock className="w-5 h-5" />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition-all ${
              isActive ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </NavLink>
      </nav>
    </div>
  );
};
