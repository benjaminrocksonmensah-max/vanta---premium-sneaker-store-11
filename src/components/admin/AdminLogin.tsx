import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Eye, EyeOff, AlertTriangle, KeyRound, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setActivePage, addToast } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate network request
    setTimeout(() => {
      const success = loginAdmin(username.trim(), password.trim());
      if (success) {
        // Successful authentication state handled by context (setting adminUser)
      } else {
        setError('Invalid credentials. Please check your username and password.');
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0C] font-['Syne',sans-serif]">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-sky-900/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111114]/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-black text-2xl mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            V
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 mb-2">
            Operations Control Center
          </span>
          <h1 className="text-2xl font-black text-white mb-2">
            Welcome back.
          </h1>
          <p className="text-sm text-zinc-400 font-sans">
            Sign in to manage your store.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 font-sans">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder="Enter your admin username"
              className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-sky-500 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:ring-1 focus:ring-sky-500/50"
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <button
                type="button"
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
                onClick={() => addToast('Reset Password', 'Please contact the Super Admin to reset your password.', 'info')}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your password"
                className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-sky-500 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all pr-12 focus:ring-1 focus:ring-sky-500/50"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 pb-2">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                rememberMe ? 'bg-sky-500 border-sky-500 text-white' : 'border-zinc-700 bg-zinc-900'
              }`}
            >
              {rememberMe && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round"><path d="M11.667 3.5L5.25 9.917 2.333 7" /></svg>}
            </button>
            <span className="text-xs text-zinc-400 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
              Remember me on this device
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed text-black font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setActivePage('home')}
            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to storefront</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
