import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Layers, Award } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';
import vantaCarbonBanner from '../../assets/images/vanta_carbon_banner_1789583447449.jpg';

export const FeaturedCollectionBanner: React.FC = () => {
  const { setActivePage, setFilterState } = useStore();
  const { content } = useCMS();

  if (!content.promo.active) return null;

  const handleExplore = () => {
    setFilterState((prev) => ({ ...prev, category: 'running' }));
    setActivePage('collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-[#131317] to-zinc-950 border border-zinc-800 p-8 sm:p-12 lg:p-16">
        {/* Background Image Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 lg:opacity-50 pointer-events-none overflow-hidden">
          <img
            src={vantaCarbonBanner}
            alt="Carbon Series"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131317] via-[#131317]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-zinc-300" />
            <span>FEATURED COLLECTION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-['Syne',sans-serif] leading-tight">
            {content.promo.heading}
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed">
            {content.promo.description}
          </p>

          <div className="grid grid-cols-2 gap-6 pt-2 pb-2">
            <div>
              <span className="block text-2xl font-black text-white font-mono">210g</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Ultra-Low Mass Chassis</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-white font-mono">+18%</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Propulsive Spring Force</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExplore}
              className="px-7 py-3.5 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              <span>{content.promo.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
