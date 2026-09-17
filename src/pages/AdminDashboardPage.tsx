import React, { useState } from 'react';
import { Plus, Package, Edit, Trash2, ShieldCheck, AlertTriangle, Users, MapPin, Tag } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useOrderStore } from '../store/useOrderStore';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AnalyticsCharts } from '../components/admin/AnalyticsCharts';
import { InventoryTable } from '../components/admin/InventoryTable';
import { OrderStatusManager } from '../components/admin/OrderStatusManager';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { MOCK_COUPONS } from '../data/mockCoupons';
import { Product } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { products, deleteProduct } = useProductStore();
  const { orders } = useOrderStore();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const mockCustomers = [
    { id: 'c-1', name: 'Mohammed Tanveer', email: 'tanveer@gdrfoods.com', phone: '+91 98765 43210', orders: 12, totalSpent: 4850, status: 'VIP' },
    { id: 'c-2', name: 'Ananya Sharma', email: 'ananya@example.com', phone: '+91 98111 22334', orders: 6, totalSpent: 2190, status: 'Active' },
    { id: 'c-3', name: 'Vikram Sethi', email: 'vikram@example.com', phone: '+91 99222 33445', orders: 4, totalSpent: 1420, status: 'Active' },
  ];

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 pb-16">
      {/* Admin Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Admin Content Area */}
      <div className="flex-1 space-y-6">
        {/* OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && <AnalyticsCharts />}

        {/* PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Products Catalog Management</h3>
                <p className="text-xs text-slate-500">Add, edit prices, MRPs, discounts & inventory</p>
              </div>
              <button
                onClick={handleAddProduct}
                className="btn-emerald px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Selling Price</th>
                    <th className="p-3">MRP</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 bg-white/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium block">{p.weight}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{p.category}</td>
                      <td className="p-3 font-extrabold text-slate-900">₹{p.price}</td>
                      <td className="p-3 text-slate-400 line-through">₹{p.mrp}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {p.discount}% OFF
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">{p.stock} units</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {activeTab === 'inventory' && <InventoryTable />}

        {/* ORDERS PIPELINE */}
        {activeTab === 'orders' && <OrderStatusManager />}

        {/* CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Customer Directory</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Total Orders</th>
                    <th className="p-3">Total Spend</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 bg-white/60">
                  {mockCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-slate-900">{c.name}</td>
                      <td className="p-3 text-slate-600">{c.email} • {c.phone}</td>
                      <td className="p-3 font-bold text-slate-900">{c.orders} orders</td>
                      <td className="p-3 font-black text-emerald-700">₹{c.totalSpent}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          c.status === 'VIP' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COUPONS */}
        {activeTab === 'coupons' && (
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Promotions & Coupons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_COUPONS.map((c) => (
                <div key={c.code} className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 text-sm">
                      {c.code}
                    </span>
                    <span className="text-slate-400 font-medium">Valid till {c.expiresAt}</span>
                  </div>
                  <p className="font-bold text-slate-900">{c.title}</p>
                  <p className="text-slate-500">{c.description}</p>
                  <p className="text-slate-700 font-semibold">Min Order: ₹{c.minOrder}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editProduct={editingProduct}
      />
    </div>
  );
};
