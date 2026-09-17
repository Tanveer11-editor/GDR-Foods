import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  // Sales trend data (Hourly)
  const salesData = [
    { time: '6 AM', sales: 2400, orders: 12 },
    { time: '8 AM', sales: 5800, orders: 28 },
    { time: '10 AM', sales: 9400, orders: 42 },
    { time: '12 PM', sales: 7200, orders: 31 },
    { time: '2 PM', sales: 6100, orders: 24 },
    { time: '4 PM', sales: 8900, orders: 38 },
    { time: '6 PM', sales: 12500, orders: 54 },
    { time: '8 PM', sales: 11200, orders: 46 },
  ];

  // Category distribution data
  const categoryData = [
    { name: 'Fruits', value: 35, color: '#10b981' },
    { name: 'Vegetables', value: 28, color: '#059669' },
    { name: 'Dairy & Eggs', value: 20, color: '#34d399' },
    { name: 'Staples', value: 12, color: '#6ee7b7' },
    { name: 'Bakery & Snacks', value: 5, color: '#a7f3d0' },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card rounded-3xl p-4 border border-white/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">₹42,850</h3>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% from yesterday</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4 border border-white/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">148</h3>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12 orders past hour</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4 border border-white/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">₹289.50</h3>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <span>+₹24 avg basket lift</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4 border border-white/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alert</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-600">3 Items</h3>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold mt-1">
            <span>Salmon & Sourdough low</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Hourly Sales Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-white/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">Hourly Revenue & Sales Volume</h4>
              <p className="text-xs text-slate-500">Real-time daily checkout activity</p>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Live Feed
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    border: '1px solid rgba(209, 250, 229, 0.8)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#emeraldGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="glass-panel rounded-3xl p-5 border border-white/80 flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-base text-slate-900">Revenue by Category</h4>
            <p className="text-xs text-slate-500">Percentage distribution</p>
          </div>
          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-700 font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
