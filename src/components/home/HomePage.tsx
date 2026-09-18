import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Hero } from './Hero';
import { ExclusiveDropTicker } from './ExclusiveDropTicker';
import { CategoriesSection } from './CategoriesSection';
import { FeaturedCollectionBanner } from './FeaturedCollectionBanner';
import { TestimonialsSection } from './TestimonialsSection';
import { BrandsSection } from './BrandsSection';
import { ProductCard } from '../shop/ProductCard';
import { ArrowRight, Sparkles, Flame, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, setActivePage, setFilterState } = useStore();

  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const trendingKicks = products.filter((p) => p.isTrending || p.isSale).slice(0, 4);

  const goToShop = () => {
    setFilterState((p) => ({ ...p, category: 'all', gender: 'all' }));
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Limited Drop Countdown Ticker */}
      <ExclusiveDropTicker />

      {/* 3. New Arrivals Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                JUST RELEASED
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
              New Arrivals
            </h2>
          </div>

          <button
            onClick={() => {
              setActivePage('new-arrivals');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white"
          >
            <span>View All New Releases</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Shop by Category */}
      <CategoriesSection />

      {/* 5. Featured Collection Banner (Carbon Series) */}
      <FeaturedCollectionBanner />

      {/* 6. Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                HIGH ROTATION
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
              Best Sellers
            </h2>
          </div>

          <button
            onClick={goToShop}
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Trending & Archive Picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                STREET LEVEL MOMENTUM
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
              Trending Silhouettes
            </h2>
          </div>

          <button
            onClick={goToShop}
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingKicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Collector Testimonials */}
      <TestimonialsSection />

      {/* 9. Technical Collaborator Brands */}
      <BrandsSection />
    </div>
  );
};
