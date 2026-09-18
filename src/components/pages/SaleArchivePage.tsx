import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { Tag, ArrowRight } from 'lucide-react';

export const SaleArchivePage: React.FC = () => {
  const { products, setActivePage } = useStore();
  const saleKicks = products.filter((p) => p.isSale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-zinc-850 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
              ARCHIVE DROP & SEASONAL REALLOCATION
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
            Archive Vault (Up to 30% Off)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Last-call pairs and historical capsules available at preferential collector rates.
          </p>
        </div>

        <button
          onClick={() => setActivePage('shop')}
          className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1.5"
        >
          <span>View Regular Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {saleKicks.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
