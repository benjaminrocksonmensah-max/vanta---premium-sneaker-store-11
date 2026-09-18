import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';
import vantaCarbonBanner from '../../assets/images/vanta_carbon_banner_1789583447449.jpg';

export const CollectionsPage: React.FC = () => {
  const { products, setFilterState, setActivePage } = useStore();

  const collections = [
    {
      title: 'The Carbon Series',
      tagline: 'Kinetic Aerospace Engineering',
      desc: 'Infused with autoclaved 3K carbon fiber spring shanks for 18% greater kinetic energy return on every stride.',
      image: vantaCarbonBanner,
      category: 'running' as const,
      kicks: products.filter((p) => p.collection.includes('Carbon'))
    },
    {
      title: 'Obsidian Monolith',
      tagline: 'Brutalist Architectural Form',
      desc: 'Monochromatic black-on-black geometries crafted with full-grain Tuscan calfskin and stealth reflective 3M bindings.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
      category: 'lifestyle' as const,
      kicks: products.filter((p) => p.colors.some((c) => c.name.toLowerCase().includes('obsidian') || c.name.toLowerCase().includes('black')))
    },
    {
      title: 'Studio Pure',
      tagline: 'Minimalist Clean Geometry',
      desc: 'Stripped of extraneous paneling. Clean bone and optic white palettes for timeless everyday wear.',
      image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1200&q=80',
      category: 'luxury' as const,
      kicks: products.filter((p) => p.colors.some((c) => c.name.toLowerCase().includes('white') || c.name.toLowerCase().includes('chalk')))
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          CURATED CAPSULES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-['Syne',sans-serif]">
          Collections & Capsules
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Architectural capsules engineered at the intersection of haute horology precision and runway brutalism.
        </p>
      </div>

      {/* Collections Sections */}
      <div className="space-y-20">
        {collections.map((col, idx) => (
          <section key={col.title} className="space-y-8">
            {/* Banner Header */}
            <div className="relative rounded-3xl overflow-hidden bg-[#111114] border border-zinc-850 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-lg space-y-3 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono uppercase">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Capsule 0{idx + 1}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
                  {col.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {col.desc}
                </p>
                <button
                  onClick={() => {
                    setFilterState((p) => ({ ...p, category: col.category }));
                    setActivePage('shop');
                  }}
                  className="pt-2 text-xs font-bold uppercase tracking-wider text-white hover:text-zinc-300 flex items-center gap-1.5 underline"
                >
                  <span>View All in this Silhouette Line</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                <img src={col.image} alt={col.title} className="w-full h-full object-cover brightness-90" />
              </div>
            </div>

            {/* Sneakers in this collection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(col.kicks.length > 0 ? col.kicks : products.slice(0, 3)).slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
