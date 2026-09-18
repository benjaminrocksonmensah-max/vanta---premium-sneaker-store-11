import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Check, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleAuthModal } from './GoogleAuthModal';

type AuthView = 'signin' | 'signup' | 'forgot' | 'reset';

export const AuthPage: React.FC = () => {
  const { login, signUp, loginWithGoogle, loginAsGuest } = useStore();
  const [view, setView] = useState<AuthView>('signin');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Validation
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email or username.');
      return;
    }

    setIsLoading(true);
    try {
      await login(cleanEmail, password);
    } catch (err) {
      setErrorMessage('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(cleanName, cleanEmail, password);
    } catch (err) {
      setErrorMessage('Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    setSuccessMessage(`A 6-digit verification code has been sent to ${cleanEmail}`);
    setView('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!resetCode) {
      setErrorMessage('Please enter the verification code sent to your inbox.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    setSuccessMessage('Password successfully updated. Signing you in...');
    setTimeout(() => {
      login(email.trim() || 'collector@vanta.store', password);
    }, 400);
  };

  const handleQuickDemo = (role: 'customer' | 'admin') => {
    setIsLoading(true);
    if (role === 'admin') {
      login('admin@vanta.store', 'AdminAccess2026!', 'admin').finally(() => setIsLoading(false));
    } else {
      loginAsGuest();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col justify-between relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Google Auth Interactive Popup Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        prefilledEmail={email.includes('@') ? email : undefined}
      />

      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-zinc-800/20 via-zinc-900/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Bar with Brand Badge */}
      <header className="px-6 py-6 sm:px-12 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black tracking-tighter text-base rounded-md shadow-lg shadow-white/5 font-['Syne',sans-serif]">
            V
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-[0.2em] font-['Syne',sans-serif] text-white">
              VANTA
            </span>
            <span className="block text-[10px] tracking-[0.25em] text-zinc-400 font-medium uppercase">
              Move Different
            </span>
          </div>
        </div>

        {/* Guest access button */}
        <button
          onClick={loginAsGuest}
          className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 backdrop-blur-md"
        >
          <span>Continue as Guest</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative">
          {/* Subtle top subtle accent line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />

          {/* Header titles */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Syne',sans-serif]">
              {view === 'signin' && 'Welcome to the Vault'}
              {view === 'signup' && 'Create Your Access'}
              {view === 'forgot' && 'Reset Credentials'}
              {view === 'reset' && 'Create New Password'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
              {view === 'signin' && 'Sign in to access limited drops, express checkout, and your vault.'}
              {view === 'signup' && 'Join the VANTA circle. Curated footwear engineered with zero compromise.'}
              {view === 'forgot' && 'Enter your registered email to receive authentication instructions.'}
              {view === 'reset' && 'Enter your 6-digit authorization code and new security key.'}
            </p>
          </div>

          {/* Feedback messages */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VIEW: SIGN IN */}
          {view === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email Address / Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter email or username"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isLoading}
                />
                {email.toLowerCase().includes('@gmail') && (
                  <button
                    type="button"
                    onClick={() => setIsGoogleModalOpen(true)}
                    className="mt-1.5 text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>Gmail detected — Sign in with Google (1-Click)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3 px-4 rounded-lg text-sm tracking-wide transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <span className="relative bg-zinc-900 px-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Or Continue With
                </span>
              </div>

              {/* Social Login: Google */}
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                disabled={isLoading}
                className="w-full bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 py-2.5 px-4 rounded-lg text-xs font-semibold text-zinc-200 flex items-center justify-center gap-3 transition-colors group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* View Switch */}
              <div className="text-center pt-2 text-xs text-zinc-400">
                <span>New to VANTA? </span>
                <button
                  type="button"
                  onClick={() => {
                    setView('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-white font-semibold hover:underline"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* VIEW: SIGN UP */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Sterling"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@example.com"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3 px-4 rounded-lg text-sm tracking-wide transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Collector Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-zinc-400">
                <span>Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setView('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-white font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Your Registered Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@vanta.com"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3 px-4 rounded-lg text-sm tracking-wide transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Send Recovery Code</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* VIEW: RESET PASSWORD */}
          {view === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Verification Code (6 Digits)
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="e.g. 748291"
                  className="w-full tracking-widest text-center text-lg font-mono bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2 text-white outline-none transition-all"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3 px-4 rounded-lg text-sm tracking-wide transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Update Password & Enter</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* Fast Access / Guest Entry */}
          <div className="mt-8 pt-6 border-t border-zinc-850">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="w-full p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:bg-zinc-900 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <span className="block text-xs font-bold text-white group-hover:text-amber-300">
                  Quick Guest Access
                </span>
                <span className="block text-[11px] text-zinc-500">
                  Explore footwear, cart & checkout immediately
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </button>

            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors inline-flex items-center gap-1.5 font-mono"
              >
                <span>Staff & Operations Portal Access</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer reassurance */}
      <footer className="px-6 py-6 text-center text-xs text-zinc-500 flex flex-wrap items-center justify-center gap-6 z-10">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-zinc-300" />
          <span>100% Guaranteed Authentic Footwear</span>
        </div>
        <span>•</span>
        <span>Encrypted 256-bit SSL Checkout</span>
        <span>•</span>
        <span>Global Express Logistics</span>
      </footer>
    </div>
  );
};
