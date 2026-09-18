import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { Gender } from '../../types';

export const CategoriesSection: React.FC = () => {
  const { setFilterState, setActivePage } = useStore();

  const handleCategoryClick = (gender: Gender | 'limited') => {
    if (gender === 'limited') {
      setFilterState((prev) => ({ ...prev, category: 'limited', gender: 'all' }));
    } else {
      setFilterState((prev) => ({ ...prev, gender, category: 'all' }));
    }
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    {
      id: 'men',
      title: "Men's Silhouette",
      subtitle: 'Brutalist volumes & track geometry',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      action: () => handleCategoryClick('men')
    },
    {
      id: 'women',
      title: "Women's Line",
      subtitle: 'Parametric knit & featherweight foam',
      image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80',
      action: () => handleCategoryClick('women')
    },
    {
      id: 'limited',
      title: 'Limited Vault',
      subtitle: 'Numbered drops & bespoke NFC tags',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
      action: () => handleCategoryClick('limited')
    },
    {
      id: 'kids',
      title: 'Junior Collection',
      subtitle: 'Scaled luxury for young pioneers',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
      action: () => handleCategoryClick('kids')
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
            CURATED ARCHETYPES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
            Shop by Category
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
          Engineered for distinct gaits, velocities, and urban environments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={cat.action}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-700 shadow-xl transition-all"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Text Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
                DISCOVER ARCHIVE
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase font-['Syne',sans-serif] leading-tight">
                {cat.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                {cat.subtitle}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
