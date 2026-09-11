import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Award, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">20–30 Min Express</h4>
              <p className="text-xs text-slate-400">Delivered hot & fresh to door</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Farm Fresh</h4>
              <p className="text-xs text-slate-400">Direct from local growers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Zero Quality Compromise</h4>
              <p className="text-xs text-slate-400">Inspected at 3 checkpoints</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Always On Time</h4>
              <p className="text-xs text-slate-400">Live order tracking updates</p>
            </div>
          </div>
        </div>

        {/* Links & Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/30">
                G
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                GDR <span className="text-emerald-400">Foods</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Freshness, delivered beautifully." GDR Foods is your premier grocery commerce experience for orchard-fresh fruits, hydroponic vegetables, pure A2 dairy, artisanal bakery, and daily kitchen essentials.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Operational in Bengaluru & Tier-1 Hubs</span>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/category/fruits" className="hover:text-emerald-400 transition-colors">Fresh Organic Fruits</Link></li>
              <li><Link to="/category/vegetables" className="hover:text-emerald-400 transition-colors">Farm Hydroponic Veggies</Link></li>
              <li><Link to="/category/dairy-eggs" className="hover:text-emerald-400 transition-colors">A2 Milk, Curd & Eggs</Link></li>
              <li><Link to="/category/staples" className="hover:text-emerald-400 transition-colors">Basmati Rice & Atta</Link></li>
              <li><Link to="/category/bakery" className="hover:text-emerald-400 transition-colors">Artisan Sourdough & Breads</Link></li>
              <li><Link to="/category/beverages" className="hover:text-emerald-400 transition-colors">Cold Pressed Juices</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Account */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/account?tab=orders" className="hover:text-emerald-400 transition-colors">Track Active Order</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-emerald-400 transition-colors">Order History & Reorder</Link></li>
              <li><Link to="/account?tab=addresses" className="hover:text-emerald-400 transition-colors">Saved Addresses</Link></li>
              <li><Link to="/account?tab=coupons" className="hover:text-emerald-400 transition-colors">Promo Coupons & Deals</Link></li>
              <li><Link to="/account?tab=help" className="hover:text-emerald-400 transition-colors">Help & Instant Support</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition-colors text-emerald-400 font-semibold">GDR Foods Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Store Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact GDR Foods
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>GDR Foods Commerce HQ, 100 Ft Road, Indiranagar, Bengaluru 560038</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 1800-425-GDR (1800-425-437)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>care@gdrfoods.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GDR Foods Commerce Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">FSSAI License #11223344556677</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
