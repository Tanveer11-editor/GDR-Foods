import React from 'react';
import { LayoutDashboard, Package, Warehouse, ShoppingBag, Users, Tag, BarChart3, Settings, ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../store/useAdminAuth';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'products', label: 'Products Catalog', icon: <Package className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory & Stock', icon: <Warehouse className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders Pipeline', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'coupons', label: 'Coupons & Offers', icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full lg:w-64 glass-panel rounded-3xl p-4 sm:p-5 flex flex-col justify-between shrink-0 border border-white/80">
      <div>
        {/* Header */}
        <div className="pb-4 mb-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
              G
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">GDR Admin</h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Store Operations</p>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'btn-emerald shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Return to Customer App & Admin Logout Links */}
      <div className="pt-4 border-t border-slate-200/80 mt-6 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Admin to Storefront</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200/60"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Admin</span>
        </button>
      </div>
    </aside>
  );
};
