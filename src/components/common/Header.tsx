import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, MapPin, ChevronDown, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { useCustomerAuth } from '../../store/useCustomerAuth';
import { LocationModal } from './LocationModal';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { items, toggleDrawer } = useCartStore();
  const { selectedLocationLabel, deliveryEtaLabel, wishlist } = useUserStore();
  const { isLoggedIn, user } = useCustomerAuth();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav shadow-sm transition-all">
        {/* Top banner strip */}
        <div className="bg-emerald-900 text-emerald-100 text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>⚡ GDR Fresh Promise: 100% Organic & Farm Picked • Free Delivery on orders over ₹499</span>
          <span className="hidden md:inline text-emerald-300">| Use Code: <strong className="text-white">FRESH50</strong></span>
        </div>

        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Main Desktop & Tablet Navigation */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 lg:gap-5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                G
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  GDR <span className="text-emerald-600">Foods</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  Freshness, Delivered
                </span>
              </div>
            </Link>

            {/* Location & ETA Selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-100/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300/80 transition-all text-left group shrink-0"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col max-w-[170px]">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-800">
                    {selectedLocationLabel.split('—')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <Clock className="w-3 h-3" />
                  <span>{deliveryEtaLabel}</span>
                </div>
              </div>
            </button>

            {/* Search Bar - Prominent & Long */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 min-w-[200px] max-w-xl lg:max-w-2xl xl:max-w-3xl relative">
              <input
                type="text"
                placeholder="Search fresh apples, organic milk, basmati, sourdough..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl glass-input text-sm text-slate-800 placeholder-slate-400 focus:outline-none shadow-inner"
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-slate-700 shrink-0">
              <Link to="/" className="whitespace-nowrap hover:text-emerald-600 transition-colors">Home</Link>
              <Link to="/category/fruits" className="whitespace-nowrap hover:text-emerald-600 transition-colors">Fruits</Link>
              <Link to="/category/vegetables" className="whitespace-nowrap hover:text-emerald-600 transition-colors">Vegetables</Link>
              <Link to="/category/dairy-eggs" className="whitespace-nowrap hover:text-emerald-600 transition-colors">Dairy & Eggs</Link>
              <Link to="/account" className="whitespace-nowrap hover:text-emerald-600 transition-colors">Deals</Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Location Switcher for Mobile/Tablet */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="max-w-[90px] truncate">{deliveryEtaLabel}</span>
              </button>

              {/* Wishlist Link */}
              <Link
                to="/account?tab=wishlist"
                className="relative p-2.5 rounded-2xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account / Login Link */}
              {isLoggedIn ? (
                <Link
                  to="/account"
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  title="My Account"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-bold hidden sm:inline max-w-[100px] truncate">
                    {user?.name.split(' ')[0]}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200/80 transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Admin Portal Button */}
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200/80 rounded-2xl transition-colors border border-slate-200/80"
              >
                Admin
              </Link>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={toggleDrawer}
                className="relative btn-emerald px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-2 shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm font-bold">Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-white text-emerald-700 text-xs font-extrabold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search fresh veggies, fruits, snacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </form>
          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  );
};
