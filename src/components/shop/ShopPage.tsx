import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { SneakerProduct } from '../../types';

export const ShopPage: React.FC = () => {
  const { products, filterState, setFilterState, resetFilters } = useStore();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filterState.category !== 'all' && product.category !== filterState.category) {
        return false;
      }
      // Gender filter
      if (filterState.gender !== 'all') {
        if (product.gender !== filterState.gender && product.gender !== 'unisex') {
          return false;
        }
      }
      // Brand filter
      if (filterState.brand !== 'all' && product.brand !== filterState.brand) {
        return false;
      }
      // Size filter
      if (filterState.size !== 'all') {
        const hasSize = product.sizes.some(
          (s) => s.size === filterState.size && s.stock > 0
        );
        if (!hasSize) return false;
      }
      // Price range filter
      if (product.price > filterState.priceRange[1]) {
        return false;
      }
      // In stock only
      if (filterState.inStockOnly) {
        const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
        if (totalStock === 0) return false;
      }
      // On sale only
      if (filterState.onSaleOnly && !product.isSale) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'newest') {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
      if (filterState.sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (filterState.sortBy === 'price_desc') {
        return b.price - a.price;
      }
      if (filterState.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filterState.sortBy === 'best_selling') {
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
      // Recommended default
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    });
  }, [products, filterState]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-zinc-850 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
            FOOTWEAR DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
            All Footwear Catalog
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Showing {filteredProducts.length} silhouettes engineered for avant-garde motion.
          </p>
        </div>

        {/* Controls: Mobile Filter Button & Desktop Sort */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Sheet Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold text-zinc-400 hidden sm:inline">Sort by:</span>
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState((p) => ({
                  ...p,
                  sortBy: e.target.value as any
                }))
              }
              className="bg-transparent text-white font-bold outline-none cursor-pointer pr-2"
            >
              <option value="recommended" className="bg-zinc-900 text-white">Recommended</option>
              <option value="newest" className="bg-zinc-900 text-white">Newest Drops</option>
              <option value="price_asc" className="bg-zinc-900 text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-zinc-900 text-white">Price: High to Low</option>
              <option value="best_selling" className="bg-zinc-900 text-white">Best Selling</option>
              <option value="rating" className="bg-zinc-900 text-white">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(filterState.category !== 'all' ||
        filterState.gender !== 'all' ||
        filterState.brand !== 'all' ||
        filterState.size !== 'all' ||
        filterState.inStockOnly ||
        filterState.onSaleOnly) && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs text-zinc-500 font-mono">Active:</span>

          {filterState.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
              <span className="capitalize">{filterState.category}</span>
              <button
                onClick={() => setFilterState((p) => ({ ...p, category: 'all' }))}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.gender !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
              <span className="capitalize">{filterState.gender}</span>
              <button
                onClick={() => setFilterState((p) => ({ ...p, gender: 'all' }))}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.brand !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
              <span>{filterState.brand}</span>
              <button
                onClick={() => setFilterState((p) => ({ ...p, brand: 'all' }))}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.size !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
              <span>Size: {filterState.size}</span>
              <button
                onClick={() => setFilterState((p) => ({ ...p, size: 'all' }))}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.onSaleOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
              <span>On Sale</span>
              <button
                onClick={() => setFilterState((p) => ({ ...p, onSaleOnly: false }))}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-zinc-400 hover:text-white underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/30 border border-zinc-850 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">No silhouettes match this criteria</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
                Try widening your price range, clearing size restrictions, or switching categories.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 z-10 animate-in slide-in-from-bottom duration-200">
            <FilterSidebar onCloseMobile={() => setIsMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
