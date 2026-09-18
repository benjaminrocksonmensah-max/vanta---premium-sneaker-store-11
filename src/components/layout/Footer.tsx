import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Lock, Sparkles, Check, CreditCard } from 'lucide-react';
import { ActivePage } from '../../types';
import { PaymentProtocolModal } from '../common/PaymentProtocolModal';

export const Footer: React.FC = () => {
  const { setActivePage, addToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMethodForModal, setSelectedMethodForModal] = useState<string>('all');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Invalid email', 'Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Access Granted', 'Your 10% inaugural code: VANTA10', 'success');
  };

  const nav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08080A] text-zinc-400 border-t border-zinc-850 pt-16 pb-24 lg:pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Brand value propositions banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-zinc-850">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">NFC Authenticated</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Every pair embedded with encrypted cryptographic verification.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
              <Truck className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Global Express</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Complimentary express shipping on drops exceeding GH₵ 200.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
              <RefreshCw className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">30-Day Vault Returns</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Unworn pairs in original packaging eligible for instant exchange.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
              <Lock className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Encrypted Payments</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Supports Visa, Mastercard, MTN MoMo, Telecel & Bank Wire.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-sm rounded font-['Syne',sans-serif]">
                V
              </div>
              <span className="text-xl font-black tracking-[0.25em] font-['Syne',sans-serif] text-white">
                VANTA
              </span>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Move Different. An avant-garde footwear studio marrying architectural brutalism, computational knit mechanics, and bespoke artisanal Tuscan leather.
            </p>

            {/* Newsletter input */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                First Access to Rare Drops
              </span>
              <p className="text-[11px] text-zinc-500 mb-3">
                Subscribe to receive SMS/Email drop notifications 30 minutes before public releases.
              </p>

              {subscribed ? (
                <div className="p-3 bg-zinc-900 border border-emerald-800/80 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>You are on the VIP drop list. Use code <strong className="text-white">VANTA10</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-white rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black hover:bg-zinc-200 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Shop Footwear</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => nav('new-arrivals')} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors">
                  All Sneakers
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors">
                  Men's Collection
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors">
                  Women's Collection
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-white transition-colors">
                  Junior & Kids
                </button>
              </li>
              <li>
                <button onClick={() => nav('collections')} className="hover:text-white transition-colors">
                  Carbon Series
                </button>
              </li>
              <li>
                <button onClick={() => nav('sale')} className="hover:text-rose-400 transition-colors text-rose-400/90 font-semibold">
                  Archive Sale (Up to 30% off)
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge / Help */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Client Concierge</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => nav('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-white transition-colors">
                  FAQ & Authenticity
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-white transition-colors">
                  Worldwide Shipping
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-white transition-colors">
                  Sneaker Size Guide
                </button>
              </li>
              <li>
                <button onClick={() => nav('order-tracking')} className="hover:text-white transition-colors">
                  Track Existing Order
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Flagships */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Maison VANTA</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => nav('about')} className="hover:text-white transition-colors">
                  Brand Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => nav('about')} className="hover:text-white transition-colors">
                  Craftsmanship & Tannery
                </button>
              </li>
              <li>
                <button onClick={() => nav('about')} className="hover:text-white transition-colors">
                  Sustainability Standards
                </button>
              </li>
              <li>
                <button onClick={() => nav('contact')} className="hover:text-white transition-colors">
                  Flagship Stores
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li className="pt-2 border-t border-zinc-800/40">
                <button
                  onClick={() => nav('admin')}
                  className="hover:text-zinc-200 text-zinc-500 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-zinc-600" />
                  <span>Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <p>© {new Date().getFullYear()} VANTA FOOTWEAR CORP. All rights reserved.</p>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-zinc-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            256-Bit SSL Encrypted
          </span>
        </div>

        {/* Supported Payment Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 uppercase font-mono tracking-wider bg-zinc-950/90 border border-zinc-800/80 rounded-2xl px-3 py-1.5 shadow-inner">
          <div className="flex items-center gap-1.5 pr-2 border-r border-zinc-800 text-[10px] text-emerald-400 font-bold font-sans normal-case">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-normal font-mono text-[10px]">PAYMENTS ACTIVE</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedMethodForModal('card');
              setIsPaymentModalOpen(true);
            }}
            title="Visa Card Gateway Active"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/60 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 group"
          >
            <span>VISA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMethodForModal('card');
              setIsPaymentModalOpen(true);
            }}
            title="Mastercard Gateway Active"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/60 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 group"
          >
            <span>MASTERCARD</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMethodForModal('momo');
              setIsPaymentModalOpen(true);
            }}
            title="MTN Mobile Money Push Active"
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 font-bold transition-all cursor-pointer flex items-center gap-1 group shadow-[0_0_8px_rgba(245,158,11,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>MTN MOMO</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMethodForModal('momo');
              setIsPaymentModalOpen(true);
            }}
            title="Telecel Cash Active"
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-400 text-rose-300 font-bold transition-all cursor-pointer flex items-center gap-1 group shadow-[0_0_8px_rgba(244,63,94,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>TELECEL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMethodForModal('apple_pay');
              setIsPaymentModalOpen(true);
            }}
            title="Apple Pay & Google Pay 1-Tap Active"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/60 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 group"
          >
            <span>APPLE PAY</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMethodForModal('all');
              setIsPaymentModalOpen(true);
            }}
            className="ml-1 text-[10px] text-zinc-400 hover:text-white underline decoration-zinc-700 hover:decoration-white transition-all lowercase"
          >
            view modes
          </button>
        </div>
      </div>

      {/* Payment Modes & Protocols Modal */}
      <PaymentProtocolModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        initialMethod={selectedMethodForModal}
      />
    </footer>
  );
};
