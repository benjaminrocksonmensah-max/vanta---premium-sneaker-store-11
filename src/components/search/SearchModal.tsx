import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight, Sparkles, Clock, Tag } from 'lucide-react';
import { SneakerProduct } from '../../types';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    products,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    viewProduct
  } = useStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SneakerProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const POPULAR_SEARCHES = ['Runner X1', 'Street Pro', 'Carbon Series', 'Triple Black', 'Court 01', 'Limited'];

  // Focus input on open
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchModalOpen]);

  // Keyboard shortcut ⌘K or Ctrl+K to open/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Live search filtering
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }

    const filtered = products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchCollection = p.collection.toLowerCase().includes(q);
      const matchColor = p.colors.some((c) => c.name.toLowerCase().includes(q));
      return matchName || matchBrand || matchCategory || matchSku || matchCollection || matchColor;
    });

    setResults(filtered);
  }, [query, products]);

  const handleSelectProduct = (productId: string, term: string) => {
    addRecentSearch(term);
    setIsSearchModalOpen(false);
    viewProduct(productId);
  };

  const handleSearchTermClick = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchModalOpen(false)}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-zinc-800 bg-[#0C0C0E]">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                addRecentSearch(query.trim());
              }
            }}
            placeholder="Search by name, model, color, SKU (e.g. VNTA-RN-001)..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-semibold text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/60"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* If no query yet: Show Recent and Popular */}
          {!query.trim() && (
            <>
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] text-zinc-500 hover:text-zinc-300"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearchTermClick(term)}
                        className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Popular Kicks & Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearchTermClick(term)}
                      className="px-3 py-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Tag className="w-3 h-3 text-zinc-500" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Results State */}
          {query.trim() && results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-zinc-400">
                <span>Matching Footwear ({results.length})</span>
                <span className="font-mono">Press item to view</span>
              </div>

              <div className="divide-y divide-zinc-850">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id, query)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-900/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center p-1 shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                            {product.brand}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">
                            {product.sku}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-zinc-200">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          <span className="capitalize">{product.category}</span>
                          <span>•</span>
                          <span>{product.colors.map((c) => c.name).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-white font-mono">
                        GH₵{product.price}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-500 group-hover:text-white justify-end mt-1">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results State (Mandated text: "We couldn't find that pair. Try another search.") */}
          {query.trim() && results.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No footwear found</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                We couldn't find that pair. Try another search or browse by category.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setQuery('Runner X1')}
                  className="text-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                >
                  Try "Runner X1"
                </button>
                <button
                  onClick={() => setQuery('Street Pro')}
                  className="text-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                >
                  Try "Street Pro"
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
