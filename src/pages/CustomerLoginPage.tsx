import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Phone, User, ArrowRight, Sparkles, ShieldCheck, AlertCircle, KeyRound, Check } from 'lucide-react';
import { useCustomerAuth } from '../store/useCustomerAuth';
import { useToast } from '../components/common/Toast';

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const { login, signup } = useCustomerAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup extra fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFillDemoCredentials = () => {
    setIdentifier('customer@gdrfoods.com');
    setPassword('Customer@123');
    setErrorMsg(null);
    showToast('Demo customer credentials auto-filled', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const res = login(identifier, password);
        setIsLoading(false);
        if (res.success) {
          showToast(res.message, 'success');
          navigate(returnTo);
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = signup(signupName, signupEmail, signupPhone, signupPassword);
        setIsLoading(false);
        if (res.success) {
          showToast(res.message, 'success');
          navigate(returnTo);
        } else {
          setErrorMsg(res.message);
        }
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-emerald-500/30 text-white overflow-hidden space-y-6"
      >
        {/* Decorative ambient background orb */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40 border border-white/20">
            G
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            GDR <span className="text-emerald-400">Foods</span>
          </h1>
          <p className="text-xs text-emerald-200/90 font-medium">
            {mode === 'login' ? 'Sign in to access your cart, addresses & express orders' : 'Create a GDR Foods customer account'}
          </p>
        </div>

        {/* Demo Credentials Hint Box */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 space-y-2 shadow-inner">
          <div className="flex items-center justify-between font-extrabold text-emerald-300">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-400" /> Demo Credentials
            </span>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
              1-Click
            </span>
          </div>
          <p className="text-[11px] text-emerald-100/80">
            Email: <strong className="text-white">customer@gdrfoods.com</strong> | Password: <strong className="text-white">Customer@123</strong>
          </p>
          <button
            type="button"
            onClick={handleFillDemoCredentials}
            className="w-full btn-emerald py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Auto-fill Customer Demo Credentials</span>
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'signup' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'login' ? (
            <>
              <div>
                <label className="font-bold text-emerald-200 block mb-1.5">Phone Number or Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. customer@gdrfoods.com or 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-emerald-200">Password</label>
                  <button type="button" onClick={handleFillDemoCredentials} className="text-[11px] text-emerald-300 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 text-xs font-medium"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="font-bold text-emerald-200 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammed Tanveer"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-emerald-200 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@gdrfoods.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-emerald-200 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-emerald-200 block mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 text-xs font-medium"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-emerald py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{mode === 'login' ? 'Sign In to GDR Foods' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>
        </form>

        {/* Link to Admin Login */}
        <div className="pt-3 border-t border-white/10 text-center text-xs">
          <span className="text-emerald-200/60">Are you a store operations manager? </span>
          <Link to="/admin/login" className="text-emerald-300 font-bold hover:underline">
            Go to Admin Portal Login →
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
