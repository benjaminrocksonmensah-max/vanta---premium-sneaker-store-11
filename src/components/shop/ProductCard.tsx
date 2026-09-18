import React, { useState } from 'react';
import { SneakerProduct, SneakerSize } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: SneakerProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { viewProduct, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isQuickSizeOpen, setIsQuickSizeOpen] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const activeColor = product.colors[selectedColorIndex] || product.colors[0];

  // Secondary image for hover toggle
  const primaryImg = product.images[activeColor.imageIndex] || product.images[0];
  const secondaryImg = product.images[1] || primaryImg;

  const handleQuickAdd = (size: SneakerSize, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, size, activeColor, 1);
    setIsQuickSizeOpen(false);
  };

  const handleCardClick = () => {
    viewProduct(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsQuickSizeOpen(false);
      }}
      className="group relative bg-[#121215] border border-zinc-850 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Top Badges & Wishlist Action */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.isLimited && (
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black rounded-full shadow-md">
              Limited 500
            </span>
          )}
          {product.isNew && !product.isLimited && (
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-white text-black rounded-full shadow-md">
              New
            </span>
          )}
          {product.isSale && (
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white rounded-full shadow-md">
              Save GH₵{product.originalPrice ? product.originalPrice - product.price : ''}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="pointer-events-auto p-2 rounded-full bg-zinc-950/70 hover:bg-zinc-900 backdrop-blur-md border border-zinc-800 text-zinc-300 hover:text-white transition-transform active:scale-90 shadow-md"
          aria-label="Save to wishlist"
        >
          <motion.div whileTap={{ scale: 1.3 }}>
            <Heart
              className={`w-4 h-4 transition-colors ${
                inWishlist ? 'fill-rose-500 text-rose-500' : 'text-zinc-300 hover:text-white'
              }`}
            />
          </motion.div>
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="relative aspect-[4/3.8] bg-[#0A0A0C] overflow-hidden flex items-center justify-center p-6">
        <img
          src={primaryImg}
          alt={product.name}
          className="w-full h-full object-contain object-center"
          loading="lazy"
        />

        {/* Quick View Button overlay */}
        <div
          className={`absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/80 rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsQuickSizeOpen(!isQuickSizeOpen);
            }}
            className="p-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-semibold shadow-lg transition-colors"
            aria-label="Select size and add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Size Selection Overlay */}
        {isQuickSizeOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-2 bottom-2 bg-zinc-950/95 border border-zinc-700 backdrop-blur-xl rounded-xl p-3 z-30 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                Select Size (US)
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickSizeOpen(false);
                }}
                className="text-[10px] text-zinc-500 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1 max-h-28 overflow-y-auto">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={(e) => handleQuickAdd(s.size, e)}
                  className={`py-1 text-[11px] font-bold rounded border transition-colors ${
                    s.stock === 0
                      ? 'border-zinc-850 text-zinc-600 cursor-not-allowed line-through'
                      : 'border-zinc-800 hover:border-white text-zinc-200 hover:bg-white hover:text-black'
                  }`}
                >
                  {s.size.replace('US ', '')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            <span>{product.brand}</span>
            <span className="capitalize">{product.category}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug group-hover:text-zinc-200 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-normal">
            {product.tagline}
          </p>
        </div>

        {/* Color Swatches & Price */}
        <div className="mt-4 pt-3 border-t border-zinc-850/80 flex items-center justify-between">
          {/* Color preview swatches */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setSelectedColorIndex(i)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIndex === i
                    ? 'border-white scale-125 ring-1 ring-white/50'
                    : 'border-zinc-700 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={c.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-zinc-500 font-medium ml-0.5">
                +{product.colors.length - 3}
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            {product.originalPrice && (
              <span className="text-xs text-zinc-500 line-through font-mono">
                GH₵{product.originalPrice}
              </span>
            )}
            <span className="text-sm sm:text-base font-extrabold text-white font-mono tracking-tight">
              GH₵{product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
