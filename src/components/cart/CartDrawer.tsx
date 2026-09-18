import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateCartItemQuantity,
    cartTotal,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    setActivePage
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 200;
  const safeCartTotal = typeof cartTotal === 'number' && !isNaN(cartTotal) ? cartTotal : 0;
  const safeDiscountAmount = typeof discountAmount === 'number' && !isNaN(discountAmount) ? discountAmount : 0;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - safeCartTotal);
  const freeShippingPercent = Math.min(100, (safeCartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const safeShippingCost = safeCartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
  const safeFinalTotal = Math.max(0, safeCartTotal - safeDiscountAmount + safeShippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon.trim());
      setInputCoupon('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          role="dialog"
          aria-modal="true"
          className="w-screen max-w-md bg-[#101013] border-l border-zinc-800 text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-300" />
              <h2 className="text-sm font-bold uppercase tracking-wider font-['Syne',sans-serif]">
                Shopping Bag ({cart.reduce((a, b) => a + (b.quantity || 1), 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-zinc-900/50 border-b border-zinc-850">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlocked: Complimentary Global Express Shipping
                </span>
              ) : (
                <span className="text-zinc-300 font-medium">
                  Add <strong className="text-white">GH₵{remainingForFreeShipping.toFixed(0)}</strong> more for Free Shipping
                </span>
              )}
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Your bag is empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">
                  Explore our newest silhouettes to find your next rotation staple.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActivePage('shop');
                  }}
                  className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Browse Footwear
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemSize = item.selectedSize || item.size || 'Standard';
                const itemColor = item.selectedColor || item.color || { name: 'Obsidian', hex: '#111', imageIndex: 0 };
                const itemPrice = item.product?.price ?? 0;
                const itemQty = item.quantity || 1;
                const itemImage =
                  item.product?.images?.[itemColor.imageIndex || 0] ||
                  item.product?.images?.[0] ||
                  '';

                return (
                  <div
                    key={`${item.id || item.product?.id || Math.random()}-${itemSize}-${itemColor.name}`}
                    className="p-3.5 bg-zinc-900/40 rounded-2xl border border-zinc-850 flex gap-4 items-center"
                  >
                    <div className="w-20 h-20 rounded-xl bg-zinc-950 border border-zinc-850 p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={itemImage}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                        {item.product?.brand || 'VANTA'}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">{item.product?.name}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {itemColor.name} • <strong className="text-zinc-300">{itemSize}</strong>
                      </p>
                      <div className="text-xs font-mono font-bold text-white mt-1">
                        GH₵{itemPrice.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.id || item.product?.id || '')}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden text-xs font-mono">
                        <button
                          onClick={() => updateCartItemQuantity(item.id || item.product?.id || '', itemQty - 1)}
                          className="px-2 py-0.5 text-zinc-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-1.5 font-bold">{itemQty}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id || item.product?.id || '', itemQty + 1)}
                          className="px-2 py-0.5 text-zinc-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-850 bg-[#0C0C0E] space-y-4">
              {/* Promo Code input */}
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Coupon <strong>{couponCode}</strong> applied (-GH₵{safeDiscountAmount.toFixed(2)})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-zinc-400 hover:text-white text-xs underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Voucher code (try VANTA10)..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">GH₵{safeCartTotal.toFixed(2)}</span>
                </div>
                {safeDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-GH₵{safeDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-white">
                    {safeShippingCost === 0 ? 'FREE' : `GH₵${safeShippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="font-mono">GH₵{safeFinalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Encrypted 256-bit Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
