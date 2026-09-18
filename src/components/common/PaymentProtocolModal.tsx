import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, CreditCard, Smartphone, Check, Zap, Globe2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PaymentProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMethod?: string;
}

export const PaymentProtocolModal: React.FC<PaymentProtocolModalProps> = ({
  isOpen,
  onClose,
  initialMethod = 'all'
}) => {
  const { setActivePage, cart } = useStore();
  const [selectedGateway, setSelectedGateway] = React.useState<string>(initialMethod);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedGateway(initialMethod || 'all');
    }
  }, [isOpen, initialMethod]);

  if (!isOpen) return null;

  const paymentGateways = [
    {
      id: 'momo',
      name: 'Mobile Money (MTN & Telecel)',
      type: 'Instant Handset STK Push',
      badge: 'Zero Transaction Fee',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Smartphone,
      accent: 'amber',
      status: 'Online & Active',
      speed: '< 3 Seconds',
      description:
        'Instant mobile billing via Ghana Interbank Payment and Settlement Systems (GhIPSS). Prompt delivered directly to your device for instant pin authorization.',
      features: ['MTN MoMo Instant Push', 'Telecel Cash USSD & Voucher', 'AT Money Direct', 'Instant Receipt via SMS']
    },
    {
      id: 'card',
      name: 'Credit & Debit Cards (Visa / Mastercard)',
      type: '256-Bit TLS 1.3 Encryption',
      badge: '3D Secure 2.0 Enabled',
      badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      icon: CreditCard,
      accent: 'blue',
      status: 'Online & Active',
      speed: 'Instant Verification',
      description:
        'Direct PCI-DSS Level 1 compliant gateway processing. Global cards issued anywhere worldwide (Visa, Mastercard, American Express) are cleared in GH₵ or local currency.',
      features: ['Tokenized Vault Security', 'Zero Cardholder Surcharge', 'Fraud Guard AI Protection', 'Worldwide Issuers Accepted']
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay & Google Pay',
      type: 'Biometric 1-Tap Authorization',
      badge: 'FaceID / TouchID',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: Lock,
      accent: 'emerald',
      status: 'Online & Active',
      speed: '1-Tap Instant',
      description:
        'Seamless device-native tokenized payment without entering numbers manually. Uses encrypted device account numbers for maximum privacy.',
      features: ['No Card Number Transmission', 'Instant 1-Click Vault Checkout', 'Biometric Authorization', 'Full Transaction Isolation']
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-2xl bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 font-['Plus_Jakarta_Sans',sans-serif] text-zinc-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-zinc-850">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black uppercase text-white font-['Syne',sans-serif] tracking-wide">
                    VANTA Payment Modes & Security
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  PCI-DSS Level 1 compliant gateway protocols & GhIPSS Mobile Money routing
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Gateway Selector Cards */}
          <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {paymentGateways.map((gw) => {
              const Icon = gw.icon;
              const isSelected = selectedGateway === gw.id || selectedGateway === 'all';

              return (
                <div
                  key={gw.id}
                  onClick={() => setSelectedGateway(gw.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900/90 border-zinc-700 shadow-lg ring-1 ring-white/10'
                      : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-800 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-white shrink-0 border border-zinc-700/60">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {gw.name}
                        </h4>
                        <span className="text-[11px] text-zinc-400 font-mono">{gw.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${gw.badgeColor}`}>
                        {gw.badge}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {gw.speed}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mt-2 pl-12">
                    {gw.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3 pl-12">
                    {gw.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Globe2 className="w-4 h-4 text-zinc-500" />
              <span>Multi-Currency settlement: GH₵ (Ghana Cedis), USD, EUR, GBP</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Close
              </button>
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    setActivePage('checkout');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
