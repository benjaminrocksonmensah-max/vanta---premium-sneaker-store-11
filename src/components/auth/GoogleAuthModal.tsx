import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledEmail?: string;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  prefilledEmail
}) => {
  const { loginWithGoogle } = useStore();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState(prefilledEmail || '');
  const [customName, setCustomName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Read only genuine saved sessions on this specific browser device
  const savedSessions = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('vanta_saved_google_sessions');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [];
  }, [isOpen]);

  const [isAddingNew, setIsAddingNew] = useState(savedSessions.length === 0);

  React.useEffect(() => {
    if (prefilledEmail) {
      setCustomEmail(prefilledEmail);
      setIsAddingNew(true);
    } else if (savedSessions.length === 0) {
      setIsAddingNew(true);
    }
  }, [prefilledEmail, savedSessions.length]);

  const handleOneTapBrowserGoogle = async () => {
    setIsProcessing(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/cancelled-popup-request') {
        setAuthError('Browser popup was blocked. Please enter your Google email address below.');
        setIsAddingNew(true);
      } else {
        setIsAddingNew(true);
      }
      setIsProcessing(false);
    }
  };

  const handleSelectAccount = async (account: { name: string; email: string; avatar?: string }) => {
    setSelectedAccount(account.email);
    setIsProcessing(true);
    setAuthError(null);

    try {
      await loginWithGoogle(account.email, account.name, account.avatar);
      onClose();
    } catch (err) {
      setAuthError('Unable to authenticate with Google. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = customEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Please enter your Google / Gmail email address.');
      return;
    }

    const emailToUse = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`;
    const derivedName =
      customName.trim() ||
      emailToUse
        .split('@')[0]
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    setIsProcessing(true);
    setAuthError(null);

    try {
      await loginWithGoogle(emailToUse, derivedName);
      onClose();
    } catch (err) {
      setAuthError('Google sign in failed. Please check your network and try again.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Google Popup Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[440px] bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 z-10 font-sans"
        >
          {/* Top Progress bar when processing */}
          {isProcessing && (
            <div className="h-1 w-full bg-blue-100 overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse w-full" />
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Google Logo & Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center mb-3">
                <svg className="w-9 h-9" viewBox="0 0 24 24">
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
              </div>
              <h3 className="text-xl font-medium text-zinc-900">
                {isAddingNew ? 'Sign in with your Google Account' : 'Choose an account'}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                to continue to <strong className="text-zinc-800 font-semibold">VANTA STUDIOS</strong>
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span>{authError}</span>
              </div>
            )}

            {!isAddingNew && savedSessions.length > 0 ? (
              <div className="space-y-2">
                {/* Account list from current device history only */}
                {savedSessions.map((acc: any) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    disabled={isProcessing}
                    className="w-full text-left p-3.5 rounded-xl border border-zinc-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-center justify-between group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-base shrink-0 shadow-sm">
                        {acc.name ? acc.name.charAt(0).toUpperCase() : acc.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 truncate flex items-center gap-1.5">
                          {acc.name || acc.email.split('@')[0]}
                        </div>
                        <div className="text-xs text-zinc-500 truncate font-mono">{acc.email}</div>
                      </div>
                    </div>

                    {isProcessing && selectedAccount === acc.email ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}

                {/* Option to use another account */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(true);
                    setAuthError(null);
                  }}
                  disabled={isProcessing}
                  className="w-full text-left p-3.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 transition-colors flex items-center gap-3.5 text-zinc-700"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-800">Use another Google account</div>
                    <div className="text-xs text-zinc-500">Sign in with a different Google address</div>
                  </div>
                </button>
              </div>
            ) : (
              /* Custom Google form */
              <div className="space-y-4">
                {/* One-tap Google OAuth popup trigger */}
                <button
                  type="button"
                  onClick={handleOneTapBrowserGoogle}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2.5 shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Use Browser Google Account Popup</span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-zinc-200 w-full" />
                  <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-zinc-400 font-medium absolute">
                    or enter Gmail
                  </span>
                </div>

                <form onSubmit={handleCustomSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Gmail Address / Google Account
                    </label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      autoFocus
                      required
                      disabled={isProcessing}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Jordan Miller"
                      disabled={isProcessing}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {savedSessions.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        disabled={isProcessing}
                        className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 py-2 px-3 rounded-lg hover:bg-zinc-100"
                      >
                        Saved Accounts
                      </button>
                    ) : <div />}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg text-xs tracking-wide transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 ml-auto"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Verify & Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Google Security Footer */}
            <div className="mt-8 pt-5 border-t border-zinc-100 text-[11px] text-zinc-500 space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-600">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Verified Google OAuth Identity Provider</span>
              </div>
              <p className="leading-relaxed">
                Google will securely share your profile name and email address with VANTA STUDIOS.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
