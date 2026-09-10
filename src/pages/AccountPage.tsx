import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Tag,
  HelpCircle,
  LogOut,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useOrderStore } from '../store/useOrderStore';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { MOCK_COUPONS } from '../data/mockCoupons';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductDetailModal } from '../components/catalog/ProductDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import { Product } from '../types';

export const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const { userName, userEmail, userPhone, addresses, wishlist } = useUserStore();
  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const { addItem, applyCoupon, toggleDrawer } = useCartStore();
  const { showToast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleReorder = (orderItems: any[]) => {
    orderItems.forEach((item) => {
      addItem(item.product, item.quantity);
    });
    showToast(`Added ${orderItems.length} items to cart`, 'success');
    toggleDrawer();
  };

  const handleApplyCouponCode = (code: string) => {
    const coupon = MOCK_COUPONS.find((c) => c.code === code);
    if (coupon) {
      const res = applyCoupon(coupon);
      showToast(res.message, res.success ? 'success' : 'error');
      if (res.success) toggleDrawer();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* User Header Profile Banner */}
      <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/40 border-2 border-white/20">
            {userName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{userName}</h1>
            <p className="text-xs text-emerald-200">{userEmail} • {userPhone}</p>
            <span className="inline-block mt-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              GDR Prime Member
            </span>
          </div>
        </div>

        <Link
          to="/admin"
          className="btn-emerald px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 shadow-md"
        >
          Open Admin Portal
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Tabs Menu */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-4 border border-white/80 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'profile' ? 'btn-emerald shadow-md' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'orders' ? 'btn-emerald shadow-md' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'wishlist' ? 'btn-emerald shadow-md' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4" />
              <span>Saved Wishlist</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">{wishlist.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'addresses' ? 'btn-emerald shadow-md' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'coupons' ? 'btn-emerald shadow-md' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons & Offers</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'help' ? 'btn-emerald shadow-md' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* Right Content Tab Container */}
        <div className="lg:col-span-3">
          {/* PROFILE OVERVIEW */}
          {activeTab === 'profile' && (
            <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-6">
              <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3">
                Account Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60">
                  <span className="text-slate-400 font-bold block mb-1">Full Name</span>
                  <p className="font-extrabold text-slate-900 text-sm">{userName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60">
                  <span className="text-slate-400 font-bold block mb-1">Email Address</span>
                  <p className="font-extrabold text-slate-900 text-sm">{userEmail}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60">
                  <span className="text-slate-400 font-bold block mb-1">Phone Number</span>
                  <p className="font-extrabold text-slate-900 text-sm">{userPhone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60">
                  <span className="text-slate-400 font-bold block mb-1">Default Delivery City</span>
                  <p className="font-extrabold text-slate-900 text-sm">Bengaluru (Tier 1 Express)</p>
                </div>
              </div>
            </div>
          )}

          {/* MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3">
                My Recent Orders ({orders.length})
              </h3>

              {orders.length === 0 ? (
                <EmptyState type="orders" />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{order.id}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-slate-400 font-medium text-[11px] mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-black text-slate-900 text-sm">₹{order.totalAmount}</span>
                      </div>

                      {/* Items Thumbnails */}
                      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex items-center gap-2 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 text-xs">
                            <img src={item.product.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-slate-800 line-clamp-1 max-w-[120px]">{item.product.name}</p>
                              <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <Link
                          to={`/order-tracking/${order.id}`}
                          className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                        >
                          <span>Track Live Status</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleReorder(order.items)}
                          className="btn-emerald px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3">
                Saved Favorite Items ({wishlist.length})
              </h3>

              {wishlistedProducts.length === 0 ? (
                <EmptyState type="wishlist" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onSelectProduct={(prod) => setSelectedProduct(prod)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3">
                Saved Delivery Addresses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {addresses.map((a) => (
                  <div key={a.id} className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 space-y-1">
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px]">
                      {a.label}
                    </span>
                    <p className="font-extrabold text-slate-900 text-sm mt-1">{a.name}</p>
                    <p className="text-slate-600">{a.apartment ? `${a.apartment}, ` : ''}{a.street}</p>
                    <p className="text-slate-500">{a.city} — {a.pincode}</p>
                    <p className="text-slate-400 font-medium">Phone: {a.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COUPONS */}
          {activeTab === 'coupons' && (
            <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3">
                Available Discount Coupons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_COUPONS.map((c) => (
                  <div key={c.code} className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 text-sm">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleApplyCouponCode(c.code)}
                        className="btn-emerald px-3 py-1 rounded-xl text-xs font-bold"
                      >
                        Apply to Cart
                      </button>
                    </div>
                    <p className="font-bold text-slate-900">{c.title}</p>
                    <p className="text-slate-500">{c.description}</p>
                    <p className="text-[10px] text-slate-400">Min Order: ₹{c.minOrder} • Valid till {c.expiresAt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HELP & SUPPORT */}
          {activeTab === 'help' && (
            <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4 text-xs">
              <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3">
                Help & Customer Support
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">What is the GDR Fresh Promise?</h4>
                  <p className="text-slate-600">If any fruit, vegetable or dairy product does not meet your high quality standards, request an instant 100% refund with zero questions asked.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">How fast is delivery?</h4>
                  <p className="text-slate-600">Our local express dark stores fulfill orders within 20 to 30 minutes using insulated temperature-controlled bags.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">Support Contact</h4>
                  <p className="text-slate-600">Toll Free: +91 1800-425-GDR • Email: care@gdrfoods.com</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
