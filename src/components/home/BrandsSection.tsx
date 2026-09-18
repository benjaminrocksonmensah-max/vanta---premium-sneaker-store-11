import React from 'react';

export const BrandsSection: React.FC = () => {
  const brands = [
    { name: 'VANTA LAB', desc: 'Kinetic Engineering' },
    { name: 'VIBRAM® SOLES', desc: 'Lugged Traction Systems' },
    { name: 'MARGOM IT', desc: 'Monolithic Italian Rubber' },
    { name: 'CORDURA® BALLISTIC', desc: 'Hydrophobic Weaves' },
    { name: 'ORTHOLITE® ECO', desc: 'Bio-Memory Cushioning' },
    { name: 'RIRI SWISS', desc: 'M6 Solid Brass Zippers' }
  ];

  return (
    <section className="border-t border-zinc-850 py-12 bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-8">
          MATERIAL COLLABORATORS & TECHNICAL INTEGRATION
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {brands.map((b) => (
            <div
              key={b.name}
              className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850/60 hover:border-zinc-700 text-center transition-all group"
            >
              <h4 className="text-xs font-black tracking-wider text-zinc-300 group-hover:text-white font-['Syne',sans-serif]">
                {b.name}
              </h4>
              <p className="text-[9px] text-zinc-500 uppercase tracking-tight mt-0.5">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
