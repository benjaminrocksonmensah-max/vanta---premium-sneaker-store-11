import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useCMS } from '../../hooks/useCMS';
import vantaRunnerFlagship from '../../assets/images/vanta_flagship_sneaker_1789583432569.jpg';

export const Hero: React.FC = () => {
  const { setActivePage, viewProduct } = useStore();
  const { content, isLoading } = useCMS();

  if (!content.hero.active) return null;

  return (
    <section className="relative overflow-hidden bg-[#0A0A0C] border-b border-zinc-850">
      {/* Background visual atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-zinc-800/15 via-zinc-900/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Headline & Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 sm:space-y-8"
          >
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold tracking-wider uppercase text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Spring / Summer 2025 Capsule</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white uppercase font-['Syne',sans-serif] leading-[0.95]">
              {content.hero.heading.split(' ').slice(0, 2).join(' ')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                {content.hero.heading.split(' ').slice(2).join(' ')}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed font-normal">
              {content.hero.subheading}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  if (content.hero.ctaDestination.startsWith('/')) {
                    setActivePage(content.hero.ctaDestination.replace('/', '') as any || 'shop');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group px-7 py-4 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-[0.14em] hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>{content.hero.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActivePage('collections');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-4 rounded-xl bg-zinc-900/90 text-white border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 font-extrabold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Collections</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-zinc-850 flex flex-wrap items-center gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-300" />
                <span>Encrypted Authenticity Provenance</span>
              </div>
              <span>•</span>
              <div>
                <span className="text-white font-bold">500+</span> Five-Star Collector Reviews
              </div>
            </div>
          </motion.div>

          {/* Hero Sneaker Feature Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            {/* Subtle glow disk */}
            <div className="absolute inset-0 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

            {/* Hero Card Stage */}
            <div
              onClick={() => viewProduct('vanta-runner-x1')}
              className="relative w-full max-w-lg aspect-square sm:aspect-[4/3.5] bg-[#111114] border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl cursor-pointer group transition-all"
            >
              {/* Top Tag */}
              <div className="flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  FLAGSHIP SILHOUETTE
                </span>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                  GH₵ 240 GHS
                </span>
              </div>

              {/* Sneaker Image */}
              <div className="relative my-auto flex items-center justify-center">
                <img
                  src={vantaRunnerFlagship}
                  alt="Vanta Runner X1"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 sm:h-72 object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
                />
              </div>

              {/* Bottom Meta */}
              <div className="flex items-end justify-between z-10 pt-4 border-t border-zinc-850">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    VANTA LAB / CARBON PROPULSION
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white font-['Syne',sans-serif]">
                    Vanta Runner X1 Obsidian
                  </h3>
                </div>

                <div className="p-2.5 rounded-xl bg-white text-black group-hover:bg-zinc-200 transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
