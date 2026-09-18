import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Maximize2,
  X,
  ChevronRight,
  ChevronDown,
  Info,
  Check,
  Send,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';
import { SneakerSize, ProductColor, Review } from '../../types';
import { ProductCard } from './ProductCard';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActivePage,
    reviews,
    addReview,
    addToast
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Gallery states
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Purchase states
  const [selectedSize, setSelectedSize] = useState<SneakerSize>('US 9');
  const [quantity, setQuantity] = useState(1);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string>('specs');

  // Review Form state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  const activeColor: ProductColor = product.colors[selectedColorIdx] || product.colors[0];
  const inWishlist = isInWishlist(product.id);

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Size stock info
  const selectedSizeInfo = product.sizes.find((s) => s.size === selectedSize);
  const isSelectedSizeInStock = (selectedSizeInfo?.stock || 0) > 0;

  const handleAddToCart = () => {
    if (!isSelectedSizeInStock) {
      addToast('Size unavailable', 'Please select an in-stock size.', 'error');
      return;
    }
    addToCart(product, selectedSize, activeColor, quantity);
  };

  const handleBuyNow = () => {
    if (!isSelectedSizeInStock) {
      addToast('Size unavailable', 'Please select an in-stock size.', 'error');
      return;
    }
    addToCart(product, selectedSize, activeColor, quantity);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewTitle.trim() || !reviewContent.trim()) {
      addToast('Incomplete review', 'Please fill out all review fields.', 'error');
      return;
    }
    addReview({
      productId: product.id,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      title: reviewTitle.trim(),
      content: reviewContent.trim()
    });
    setIsWritingReview(false);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewContent('');
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 mb-8 font-mono">
        <button onClick={() => setActivePage('home')} className="hover:text-white">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => setActivePage('shop')} className="hover:text-white">Footwear</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-300 font-semibold">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery on left, Specs on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Stage Image */}
          <div className="relative aspect-[4/3.5] bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden p-6 sm:p-12 flex items-center justify-center group">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain drop-shadow-2xl cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {product.isLimited && (
                <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-amber-400 text-black rounded-full shadow">
                  Numbered Drop
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-white text-black rounded-full shadow">
                  New Arrival
                </span>
              )}
            </div>

            {/* Lightbox trigger */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 backdrop-blur-md transition-colors"
              aria-label="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-900 border p-2 shrink-0 transition-all ${
                  selectedImageIdx === idx
                    ? 'border-white ring-1 ring-white/50'
                    : 'border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Value props under gallery */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-850 text-center">
            <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-850">
              <ShieldCheck className="w-4 h-4 text-zinc-300 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-white block">100% Authentic</span>
              <span className="text-[10px] text-zinc-500">NFC Vault Verified</span>
            </div>
            <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-850">
              <Truck className="w-4 h-4 text-zinc-300 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-white block">Global Express</span>
              <span className="text-[10px] text-zinc-500">3-5 Business Days</span>
            </div>
            <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-850">
              <RotateCcw className="w-4 h-4 text-zinc-300 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-white block">30-Day Returns</span>
              <span className="text-[10px] text-zinc-500">Original Box Required</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Information & Purchase Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Specs */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-mono tracking-widest mb-1.5">
              <span>{product.brand}</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif] tracking-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Review link */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-white">{product.rating}</span>
              <span className="text-xs text-zinc-500">•</span>
              <a href="#reviews" className="text-xs text-zinc-400 hover:text-white underline">
                {productReviews.length} Verified Collector Reviews
              </a>
            </div>

            {/* Pricing block */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-white font-mono">
                GH₵{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-base text-zinc-500 line-through font-mono">
                  GH₵{product.originalPrice}
                </span>
              )}
              {product.isSale && (
                <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2.5 py-0.5 rounded-full">
                  Archive Pricing
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Colorway Selection */}
          <div className="pt-4 border-t border-zinc-850">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Colorway: <span className="text-white font-normal">{activeColor.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setSelectedColorIdx(i);
                    setSelectedImageIdx(c.imageIndex || 0);
                  }}
                  className={`p-1 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                    selectedColorIdx === i
                      ? 'border-white bg-zinc-800 text-white shadow'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 bg-zinc-900/50'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-lg border border-zinc-700 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="pr-1.5 font-medium">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          <div className="pt-4 border-t border-zinc-850">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Select Size ({product.gender === 'kids' ? 'US Kids & Youth' : product.gender === 'women' ? 'US Women' : 'US Men / Unisex & Grown'})
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 underline"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Size Guide & Conversion</span>
              </button>
            </div>

            {/* Grid of sizes */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() => setSelectedSize(s.size)}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    selectedSize === s.size
                      ? 'border-white bg-white text-black shadow-lg scale-[1.02]'
                      : s.stock === 0
                      ? 'border-zinc-850 text-zinc-600 line-through cursor-not-allowed bg-zinc-950/40'
                      : 'border-zinc-800 text-zinc-300 hover:border-zinc-700 bg-zinc-900/60'
                  }`}
                >
                  {s.size.replace('US ', '')}
                </button>
              ))}
            </div>

            {/* Live Stock Notification */}
            <div className="mt-2.5 flex items-center gap-2 text-xs">
              {selectedSizeInfo && selectedSizeInfo.stock > 0 ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  In Stock in {selectedSize} (
                  {selectedSizeInfo.stock < 5
                    ? `Only ${selectedSizeInfo.stock} pairs left`
                    : 'Ready to Dispatch'}
                  )
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Currently out of stock in {selectedSize}
                </span>
              )}
            </div>
          </div>

          {/* Quantity & Action Controls */}
          <div className="pt-4 border-t border-zinc-850 space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-900 overflow-hidden shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-zinc-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-zinc-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!isSelectedSizeInStock}
                className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag — GH₵{(((product?.price ?? 0) * (quantity || 1)) || 0).toFixed(0)}</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3.5 border border-zinc-800 hover:border-zinc-700 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now instant checkout */}
            <button
              onClick={handleBuyNow}
              disabled={!isSelectedSizeInStock}
              className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
            >
              Instant Express Checkout
            </button>
          </div>

          {/* Expandable Accordions: Materials, Shipping, Care */}
          <div className="pt-6 border-t border-zinc-850 space-y-2 text-xs">
            {/* Specs & Tech */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'specs' ? '' : 'specs')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-white"
              >
                <span>Materials & Kinetic Engineering</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordion === 'specs' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'specs' && (
                <div className="p-4 pt-0 text-zinc-400 space-y-2 leading-relaxed border-t border-zinc-800/40">
                  <ul className="list-disc pl-4 space-y-1">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <strong className="text-zinc-300 block mb-1">Composition:</strong>
                    {product.materials.map((m, i) => (
                      <p key={i} className="text-[11px] text-zinc-500">• {m}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-white"
              >
                <span>Worldwide Shipping & Authenticity</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'shipping' && (
                <div className="p-4 pt-0 text-zinc-400 space-y-2 leading-relaxed border-t border-zinc-800/40">
                  <p>
                    All pairs ship in high-density acrylic reinforced presentation cases with embedded NFC authentication certificates.
                  </p>
                  <p>
                    • Standard Delivery: 3-5 business days (GH₵ 15, or free over GH₵ 200)
                    <br />
                    • DHL Express Priority: 1-2 business days (GH₵ 35)
                  </p>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-white"
              >
                <span>Care & Tannery Maintenance</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordion === 'care' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'care' && (
                <div className="p-4 pt-0 text-zinc-400 space-y-1.5 leading-relaxed border-t border-zinc-800/40">
                  <p>• Wipe clean with a soft, dry micro-fiber cloth after each wear.</p>
                  <p>• Apply natural beeswax conditioner to tumbled calfskin quarters every 6 months.</p>
                  <p>• Avoid submerging in water or washing machine cycles.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="mt-20 pt-16 border-t border-zinc-850">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
              COMMUNITY FEEDBACK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-['Syne',sans-serif]">
              Collector Reviews ({productReviews.length})
            </h2>
          </div>

          <button
            onClick={() => setIsWritingReview(!isWritingReview)}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
          >
            {isWritingReview ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form */}
        {isWritingReview && (
          <form
            onSubmit={handleSubmitReview}
            className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl mb-8 space-y-4 max-w-2xl animate-in fade-in duration-200"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Share Your Verification & Fit Notes
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Star Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-zinc-600 hover:text-amber-400"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono text-zinc-400 ml-2">{reviewRating} / 5 Stars</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Marcus T."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Unbelievable comfort and silhouette"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Review Comments</label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={3}
                placeholder="How did the fit feel? How is the leather or knit quality?"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                Verified collector review status applied automatically
              </span>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Publish Review</span>
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productReviews.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6">Be the first to review this pair.</p>
          ) : (
            productReviews.map((r) => (
              <div
                key={r.id}
                className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-zinc-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{r.date}</span>
                </div>

                <h4 className="text-sm font-bold text-white">{r.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{r.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-850/60 text-[11px] text-zinc-500">
                  <span className="font-semibold text-zinc-300">{r.author}</span>
                  {r.verified && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recommended Related Silhouettes */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-16 border-t border-zinc-850">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
              PARALLEL SILHOUETTES
            </span>
            <h2 className="text-2xl font-black uppercase text-white font-['Syne',sans-serif]">
              You May Also Consider
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsSizeGuideOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Footwear Sizing & International Conversion
              </h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              VANTA silhouettes are built on true-to-size European lasts. If you possess a wider foot, we recommend ordering a half-size up.
            </p>

            <div className="overflow-x-auto max-h-64 overflow-y-auto custom-scrollbar">
              <table className="w-full text-xs text-left text-zinc-300 font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase sticky top-0 bg-zinc-900">
                    <th className="py-2">US Standard</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">UK</th>
                    <th className="py-2">EU</th>
                    <th className="py-2">CM Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {/* Kids / Youth */}
                  <tr className="bg-zinc-950/40"><td className="py-1.5 font-bold text-amber-400">1Y - 2Y</td><td>Youth / Junior</td><td>0.5 - 1.5</td><td>32 - 33.5</td><td>20.0 - 21.0 cm</td></tr>
                  <tr className="bg-zinc-950/40"><td className="py-1.5 font-bold text-amber-400">3Y - 4Y</td><td>Youth / Junior</td><td>2.5 - 3.5</td><td>35 - 36</td><td>22.0 - 23.0 cm</td></tr>
                  <tr className="bg-zinc-950/40"><td className="py-1.5 font-bold text-amber-400">5Y - 6Y</td><td>Youth / Junior</td><td>4.5 - 5.5</td><td>37.5 - 38.5</td><td>23.5 - 24.5 cm</td></tr>
                  {/* Standard Adult */}
                  <tr><td className="py-1.5 font-bold text-white">US 6.0</td><td>Adult</td><td>5.5</td><td>39</td><td>24.0 cm</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">US 7.0</td><td>Adult</td><td>6.5</td><td>40</td><td>25.0 cm</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">US 8.0</td><td>Adult</td><td>7.5</td><td>41</td><td>26.0 cm</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">US 9.0</td><td>Adult</td><td>8.5</td><td>42.5</td><td>27.0 cm</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">US 10.0</td><td>Adult</td><td>9.5</td><td>44</td><td>28.0 cm</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">US 11.0</td><td>Adult</td><td>10.5</td><td>45</td><td>29.0 cm</td></tr>
                  <tr><td className="py-1.5 font-bold text-white">US 12.0</td><td>Adult</td><td>11.5</td><td>46</td><td>30.0 cm</td></tr>
                  {/* Extended Grown Sizes */}
                  <tr className="bg-zinc-950/40"><td className="py-1.5 font-bold text-indigo-300">US 13.0</td><td>Grown / Big Size</td><td>12.5</td><td>47.5</td><td>31.0 cm</td></tr>
                  <tr className="bg-zinc-950/40"><td className="py-1.5 font-bold text-indigo-300">US 14.0</td><td>Grown / Big Size</td><td>13.5</td><td>48.5</td><td>32.0 cm</td></tr>
                  <tr className="bg-zinc-950/40"><td className="py-1.5 font-bold text-indigo-300">US 15.0</td><td>Grown / Big Size</td><td>14.5</td><td>49.5</td><td>33.0 cm</td></tr>
                  <tr className="bg-zinc-950/40"><td className="py-1.5 font-bold text-indigo-300">US 16.0</td><td>Grown / Big Size</td><td>15.5</td><td>51.0</td><td>34.0 cm</td></tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.images[selectedImageIdx] || product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
};
