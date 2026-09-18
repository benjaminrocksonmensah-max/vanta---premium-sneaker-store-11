import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, RotateCcw, Check } from 'lucide-react';
import { SneakerSize } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';

interface FilterSidebarProps {
  onCloseMobile?: () => void;
}

const KIDS_SIZES: SneakerSize[] = [
  'US 1Y', 'US 1.5Y', 'US 2Y', 'US 2.5Y', 'US 3Y', 'US 3.5Y', 'US 4Y', 'US 4.5Y', 'US 5Y', 'US 5.5Y', 'US 6Y'
];

const ADULT_SIZES: SneakerSize[] = [
  'US 5', 'US 5.5', 'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5', 'US 12', 'US 12.5'
];

const EXTENDED_SIZES: SneakerSize[] = [
  'US 13', 'US 13.5', 'US 14', 'US 14.5', 'US 15', 'US 16'
];

const ALL_AVAILABLE_SIZES: SneakerSize[] = [...KIDS_SIZES, ...ADULT_SIZES, ...EXTENDED_SIZES];

const BRANDS = ['VANTA LAB', 'VANTA STUDIO', 'VANTA ARCHIVE', 'VANTA COLLAB', 'VANTA KIDS'];

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'running', label: 'Running & Track' },
  { id: 'lifestyle', label: 'Lifestyle & Street' },
  { id: 'basketball', label: 'Court & Tennis' },
  { id: 'skate', label: 'Skate Heritage' },
  { id: 'luxury', label: 'High Luxury' },
  { id: 'limited', label: 'Limited Drops' }
];

const GENDERS = [
  { id: 'all', label: 'All Genders' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'unisex', label: 'Unisex' },
  { id: 'kids', label: 'Kids & Junior' }
];

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Grey', hex: '#8F9094' },
  { name: 'Bone', hex: '#EAE8E3' },
  { name: 'Taupe', hex: '#6D655F' },
  { name: 'Purple', hex: '#2A2038' }
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onCloseMobile }) => {
  const { filterState, setFilterState, resetFilters, products } = useStore();
  const [activeSizeCategory, setActiveSizeCategory] = React.useState<'adult' | 'extended' | 'kids' | 'all'>('adult');
  const { categories } = useCategories();
  const { brands } = useBrands();

  const dynamicCategories = useMemo(() => {
    const base = [{ id: 'all', label: 'All Categories' }];
    const activeCats = categories
      .filter(c => c.status === 'active')
      .map(c => ({ id: c.slug, label: c.name }));
    
    if (activeCats.length === 0) {
      return CATEGORIES;
    }
    return [...base, ...activeCats];
  }, [categories]);

  const dynamicBrands = useMemo(() => {
    const activeBrands = brands
      .filter(b => b.status === 'active')
      .map(b => b.name);
    
    if (activeBrands.length === 0) {
      return BRANDS;
    }
    return activeBrands;
  }, [brands]);

  const displayedSizes =
    activeSizeCategory === 'kids'
      ? KIDS_SIZES
      : activeSizeCategory === 'extended'
      ? EXTENDED_SIZES
      : activeSizeCategory === 'adult'
      ? ADULT_SIZES
      : ALL_AVAILABLE_SIZES;

  return (
    <aside className="w-full space-y-7 text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-wider text-white">Filters</span>
          <span className="text-xs text-zinc-500 font-mono">({products.length} styles)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="lg:hidden p-1 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Category</h4>
        <div className="space-y-1.5">
          {dynamicCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer py-1"
            >
              <input
                type="radio"
                name="category"
                checked={filterState.category === cat.id}
                onChange={() => setFilterState((p) => ({ ...p, category: cat.id as any }))}
                className="text-white focus:ring-0 bg-zinc-900 border-zinc-700"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Gender */}
      <div className="pt-4 border-t border-zinc-850">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Gender</h4>
        <div className="space-y-1.5">
          {GENDERS.map((g) => (
            <label
              key={g.id}
              className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer py-1"
            >
              <input
                type="radio"
                name="gender"
                checked={filterState.gender === g.id}
                onChange={() => setFilterState((p) => ({ ...p, gender: g.id }))}
                className="text-white focus:ring-0 bg-zinc-900 border-zinc-700"
              />
              <span>{g.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Sizes */}
      <div className="pt-4 border-t border-zinc-850">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Size (US)</h4>
          {filterState.size !== 'all' && (
            <button
              onClick={() => setFilterState((p) => ({ ...p, size: 'all' }))}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-mono"
            >
              Clear ({filterState.size})
            </button>
          )}
        </div>

        {/* Category switcher tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 mb-2.5">
          <button
            type="button"
            onClick={() => setActiveSizeCategory('adult')}
            className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${
              activeSizeCategory === 'adult'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Adult
          </button>
          <button
            type="button"
            onClick={() => setActiveSizeCategory('extended')}
            className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${
              activeSizeCategory === 'extended'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Grown (13-16)
          </button>
          <button
            type="button"
            onClick={() => setActiveSizeCategory('kids')}
            className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${
              activeSizeCategory === 'kids'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Kids (1Y-6Y)
          </button>
          <button
            type="button"
            onClick={() => setActiveSizeCategory('all')}
            className={`px-1.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
              activeSizeCategory === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            All
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-0.5 custom-scrollbar">
          {displayedSizes.map((sz) => (
            <button
              key={sz}
              onClick={() =>
                setFilterState((p) => ({
                  ...p,
                  size: p.size === sz ? 'all' : sz
                }))
              }
              className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                filterState.size === sz
                  ? 'border-white bg-white text-black shadow-sm'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white bg-zinc-900/50'
              }`}
            >
              {sz.replace('US ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Price Range */}
      <div className="pt-4 border-t border-zinc-850">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Max Price</h4>
          <span className="text-xs font-mono font-bold text-white">
            GH₵{filterState.priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="500"
          step="10"
          value={filterState.priceRange[1]}
          onChange={(e) =>
            setFilterState((p) => ({
              ...p,
              priceRange: [0, Number(e.target.value)]
            }))
          }
          className="w-full accent-white bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mt-2">
          <span>GH₵100</span>
          <span>GH₵500+</span>
        </div>
      </div>

      {/* 5. Brand Line */}
      <div className="pt-4 border-t border-zinc-850">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Brand Line</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer py-1">
            <input
              type="radio"
              name="brand"
              checked={filterState.brand === 'all'}
              onChange={() => setFilterState((p) => ({ ...p, brand: 'all' }))}
              className="text-white focus:ring-0 bg-zinc-900 border-zinc-700"
            />
            <span>All Lines</span>
          </label>
          {dynamicBrands.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer py-1"
            >
              <input
                type="radio"
                name="brand"
                checked={filterState.brand === b}
                onChange={() => setFilterState((p) => ({ ...p, brand: b }))}
                className="text-white focus:ring-0 bg-zinc-900 border-zinc-700"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 6. Availability & Sale Flags */}
      <div className="pt-4 border-t border-zinc-850 space-y-2">
        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={(e) => setFilterState((p) => ({ ...p, inStockOnly: e.target.checked }))}
            className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
          />
          <span>In Stock Only</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-rose-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filterState.onSaleOnly}
            onChange={(e) => setFilterState((p) => ({ ...p, onSaleOnly: e.target.checked }))}
            className="rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-0"
          />
          <span>On Sale / Archive Price</span>
        </label>
      </div>

      {onCloseMobile && (
        <div className="pt-4 lg:hidden">
          <button
            onClick={onCloseMobile}
            className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            Apply Filters
          </button>
        </div>
      )}
    </aside>
  );
};
