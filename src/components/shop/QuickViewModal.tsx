import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShoppingBag, Heart, Star, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { SneakerSize } from '../../types';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    viewProduct
  } = useStore();

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SneakerSize>('US 9');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const inWishlist = isInWishlist(product.id);
  const activeColor = product.colors[selectedColorIdx] || product.colors[0];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, activeColor, quantity);
    setQuickViewProduct(null);
  };

  const handleFullView = () => {
    setQuickViewProduct(null);
    viewProduct(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-4xl bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Side */}
        <div className="p-6 bg-[#0B0B0D] flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-850">
          <div className="aspect-square relative flex items-center justify-center overflow-hidden rounded-xl bg-zinc-950/60 p-4">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-14 h-14 rounded-lg bg-zinc-900 border overflow-hidden shrink-0 transition-all ${
                  activeImageIdx === idx ? 'border-white ring-1 ring-white/50' : 'border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Details Side */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-mono tracking-wider mb-2">
              <span>{product.brand}</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white font-['Syne',sans-serif]">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-black text-white font-mono">
                GH₵{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-zinc-500 line-through font-mono">
                  GH₵{product.originalPrice}
                </span>
              )}
              {product.isSale && (
                <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-full">
                  Sale Drop
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400 mt-3 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mt-5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                Colorway: <span className="text-white font-normal">{activeColor.name}</span>
              </span>
              <div className="flex items-center gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColorIdx(i);
                      setActiveImageIdx(c.imageIndex || 0);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                      selectedColorIdx === i
                        ? 'border-white bg-zinc-800 text-white'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Select Size ({product.gender === 'kids' ? 'US Kids' : product.gender === 'women' ? 'US Women' : 'US Men / Unisex & Grown'})
                </span>
                <span className="text-[11px] text-zinc-500">True to size</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedSize === s.size
                        ? 'border-white bg-white text-black font-extrabold shadow-sm'
                        : s.stock === 0
                        ? 'border-zinc-850 text-zinc-600 line-through cursor-not-allowed bg-zinc-950/40'
                        : 'border-zinc-800 text-zinc-300 hover:border-zinc-700 bg-zinc-900/60'
                    }`}
                  >
                    {s.size.replace('US ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-6 border-t border-zinc-800 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-900 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-zinc-400 hover:text-white text-sm font-bold"
                >
                  -
                </button>
                <span className="px-2 text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-zinc-400 hover:text-white text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-white hover:bg-zinc-200 text-black py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag — GH₵{(((product?.price ?? 0) * (quantity || 1)) || 0).toFixed(0)}</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="p-3 border border-zinc-800 hover:border-zinc-700 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* View Full Product Page */}
            <button
              type="button"
              onClick={handleFullView}
              className="w-full text-center text-xs font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 py-1 transition-colors"
            >
              <span>View complete specifications & high-res gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
