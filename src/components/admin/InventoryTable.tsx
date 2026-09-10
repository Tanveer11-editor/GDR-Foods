import React, { useState } from 'react';
import { Search, Plus, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';

export const InventoryTable: React.FC = () => {
  const { products, updateStock } = useProductStore();
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'out'>('all');

  const filteredProducts = products.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(filterQuery.toLowerCase()) || p.category.toLowerCase().includes(filterQuery.toLowerCase());
    if (filterStockStatus === 'low') return matchesQuery && p.stock > 0 && p.stock <= 25;
    if (filterStockStatus === 'out') return matchesQuery && p.stock === 0;
    return matchesQuery;
  });

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/80 space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by product name..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input focus:outline-none text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStockStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStockStatus === 'all' ? 'btn-emerald' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setFilterStockStatus('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStockStatus === 'low' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Low Stock ({products.filter((p) => p.stock > 0 && p.stock <= 25).length})
          </button>
          <button
            onClick={() => setFilterStockStatus('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStockStatus === 'out' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Out of Stock ({products.filter((p) => p.stock === 0).length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price / MRP</th>
              <th className="p-3">Stock Units</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 bg-white/60">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-white transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{p.weight}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 font-semibold text-slate-700">{p.category}</td>
                <td className="p-3">
                  <span className="font-extrabold text-slate-900">₹{p.price}</span>
                  <span className="text-slate-400 text-[10px] block line-through">₹{p.mrp}</span>
                </td>
                <td className="p-3">
                  <span className="font-black text-sm text-slate-900">{p.stock}</span>
                </td>
                <td className="p-3">
                  {p.stock === 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                      <XCircle className="w-3 h-3" /> Out of Stock
                    </span>
                  ) : p.stock <= 25 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                      <AlertTriangle className="w-3 h-3" /> Low Stock ({p.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" /> Healthy Stock
                    </span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => updateStock(p.id, p.stock - 5)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-slate-200 font-bold text-slate-700 text-[11px]"
                      title="Reduce stock by 5"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => updateStock(p.id, p.stock - 1)}
                      className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                      title="Reduce stock by 1"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => updateStock(p.id, p.stock + 1)}
                      className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                      title="Increase stock by 1"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => updateStock(p.id, p.stock + 10)}
                      className="px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-[11px]"
                      title="Increase stock by 10"
                    >
                      +10
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
