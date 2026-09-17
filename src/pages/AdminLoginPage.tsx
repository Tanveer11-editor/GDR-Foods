import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, User, ArrowRight, KeyRound, Check, AlertCircle, Building2 } from 'lucide-react';
import { useAdminAuth } from '../store/useAdminAuth';
import { useToast } from '../components/common/Toast';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFillDemoCredentials = () => {
    setUsername('admin@gdrfoods.com');
    setPassword('Admin@123');
    setErrorMsg(null);
    showToast('Demo admin credentials auto-filled', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await adminLogin(username, password);
      setIsLoading(false);
      if (res.success) {
        showToast(res.message, 'success');
        navigate('/admin');
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('An unexpected authentication error occurred.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/40 text-white relative overflow-hidden space-y-6"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Visually Distinct Back-office Console Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Restricted Back-Office Console</span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            GDR Foods <span className="text-emerald-400">Admin Portal</span>
          </h1>
          <p className="text-xs text-slate-400">
            Internal console for store operations, inventory management & order pipeline
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between font-extrabold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" /> Admin Demo Credentials
            </span>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
              1-Click
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Username: <strong className="text-white">admin@gdrfoods.com</strong> | Password: <strong className="text-white">Admin@123</strong>
          </p>
          <button
            type="button"
            onClick={handleFillDemoCredentials}
            className="w-full btn-emerald py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Auto-fill Admin Demo Credentials</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Admin Email or Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. admin@gdrfoods.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Admin Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-emerald py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating Console...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Log In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>
        </form>

        {/* Link back to Customer Storefront */}
        <div className="pt-3 border-t border-slate-800 text-center text-xs">
          <Link to="/" className="text-slate-400 hover:text-white font-semibold">
            ← Exit to GDR Foods Storefront
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
