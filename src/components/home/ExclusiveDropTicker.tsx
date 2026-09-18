import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Bell, ArrowRight, ShieldCheck } from 'lucide-react';

export const ExclusiveDropTicker: React.FC = () => {
  const { viewProduct, addToast } = useStore();
  const [reminderSet, setReminderSet] = useState(false);

  // Simulated countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReminder = () => {
    setReminderSet(true);
    addToast('Drop Reminder Set', 'You will receive priority SMS alert 30 mins before drop.', 'success');
  };

  return (
    <section className="bg-gradient-to-r from-zinc-950 via-[#101014] to-zinc-950 border-y border-zinc-800/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Drop details */}
        <div className="flex items-center gap-4 sm:gap-5 text-left">
          {/* Drop Badge */}
          <div className="flex flex-col items-center justify-center px-3.5 py-2 rounded-xl bg-amber-400 text-black shadow-lg shadow-amber-400/10 shrink-0 select-none">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none opacity-80">DROP</span>
            <span className="text-base font-black font-mono leading-none mt-0.5 tracking-tight">04</span>
          </div>

          <div className="flex flex-col justify-center">
            {/* Eyebrow / Meta */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                Limited Global Allocation
              </span>
              <span className="text-zinc-700 text-xs hidden sm:inline">•</span>
              <span className="text-[11px] text-zinc-400 font-mono tracking-wide">
                500 Pairs Worldwide
              </span>
            </div>

            {/* Main Drop Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Syne',sans-serif] tracking-[0.08em] uppercase mt-1 leading-tight">
              VANTA ECLIPSE TITANIUM
            </h3>
          </div>
        </div>

        {/* Real-time countdown blocks */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 min-w-[56px]">
            <span className="text-lg sm:text-xl font-black font-mono text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase font-bold text-zinc-500">HRS</span>
          </div>
          <span className="text-zinc-600 font-black text-xl">:</span>
          <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 min-w-[56px]">
            <span className="text-lg sm:text-xl font-black font-mono text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase font-bold text-zinc-500">MIN</span>
          </div>
          <span className="text-zinc-600 font-black text-xl">:</span>
          <div className="flex flex-col items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 min-w-[56px]">
            <span className="text-lg sm:text-xl font-black font-mono text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase font-bold text-zinc-500">SEC</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {reminderSet ? (
            <div className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-zinc-900 border border-emerald-800/80 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Priority Drop VIP Confirmed</span>
            </div>
          ) : (
            <button
              onClick={handleReminder}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Set Reminder</span>
            </button>
          )}

          <button
            onClick={() => viewProduct('vanta-eclipse-limited')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <span>View Drop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
