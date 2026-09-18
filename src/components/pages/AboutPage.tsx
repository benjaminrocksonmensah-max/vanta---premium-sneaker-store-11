import React from 'react';
import { ShieldCheck, Compass, Sparkles, Feather, Recycle } from 'lucide-react';
import vantaCarbonBanner from '../../assets/images/vanta_carbon_banner_1789583447449.jpg';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Title & Manifesto */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          MAISON VANTA MANIFESTO
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-['Syne',sans-serif] leading-tight">
          Move Different.
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Founded in 2024, VANTA was born from a fundamental critique of modern mass-production sneakers: why should aesthetic audacity be traded for kinetic orthopedic engineering?
        </p>
      </div>

      {/* Hero Image */}
      <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
        <img
          src={vantaCarbonBanner}
          alt="VANTA Studio Engineering"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        <div className="p-6 bg-[#111114] border border-zinc-850 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
            <Feather className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-base font-bold text-white font-['Syne',sans-serif]">
            Aerospace Kinetic Foams
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every sole features dual-density supercritical nitrogen-infused foam calibrated to disperse ground strike forces while returning 78% energy upward.
          </p>
        </div>

        <div className="p-6 bg-[#111114] border border-zinc-850 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-base font-bold text-white font-['Syne',sans-serif]">
            Tuscan Full-Grain Leathers
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sourced exclusively from certified Gold-rated family tanneries in Santa Croce sull'Arno, Italy. Tumbled naturally for 48 hours for immediate supple break-in.
          </p>
        </div>

        <div className="p-6 bg-[#111114] border border-zinc-850 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
            <Recycle className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-base font-bold text-white font-['Syne',sans-serif]">
            Cryptographic Vault Twin
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Each pair contains an embedded, water-sealed NFC chip. A single tap verifies the provenance, serial allocation, and locks in your lifetime repair warranty.
          </p>
        </div>
      </div>

      {/* Sustainable Footwear Promise */}
      <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-white uppercase font-['Syne',sans-serif]">
          Our Circular Commitment
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Footwear waste is an industry epidemic. VANTA builds exclusively in small batch allocations (never exceeding demand), utilizes 100% bio-based memory foam insoles, and offers an end-of-life sole recycling rebate program for any worn pair returned to our flagships.
        </p>
      </div>
    </div>
  );
};
