import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Clock,
  Truck
} from 'lucide-react';
import { SneakerProduct, SneakerSize, Order } from '../../types';

export const AccountPage: React.FC = () => {
  const {
    user,
    setUser,
    orders,
    wishlist,
    removeFromWishlist,
    addToCart,
    logout,
    setActivePage,
    setSelectedOrder,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses' | 'notifications'>('orders');

  // Editable Profile Form State
  const [name, setName] = useState(user?.fullName || user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredSize, setPreferredSize] = useState<SneakerSize>(user?.preferredSize || 'US 9');

  React.useEffect(() => {
    if (user) {
      setName(user.fullName || user.name || '');
      setPhone(user.phone || '');
      if (user.preferredSize) setPreferredSize(user.preferredSize);
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        fullName: name,
        name,
        phone,
        preferredSize
      });
      addToast('Profile updated', 'Your account settings were saved.', 'success');
    }
  };

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order);
    setActivePage('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayName = user?.fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'Collector');
  const userInitials = (displayName || 'VA')
    .split(' ')
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-zinc-850 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-white uppercase font-mono overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Syne',sans-serif]">
                {displayName}
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user?.email || 'Authenticated Collector'} • Member since 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 bg-zinc-900/60 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Account Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'orders'
                ? 'bg-zinc-900 text-white border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Vault Orders ({orders.length})</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-zinc-900 text-white border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4" />
              <span>Saved Wishlist ({wishlist.length})</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'profile'
                ? 'bg-zinc-900 text-white border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>Profile & Sizing</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'notifications'
                ? 'bg-zinc-900 text-white border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              <span>VIP Drop Alerts</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="lg:col-span-9">
          {/* 1. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  Vault Orders & Shipments
                </h2>
                <p className="text-xs text-zinc-400">View live tracking and authenticity certificates for all orders.</p>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center bg-zinc-900/40 border border-zinc-850 rounded-2xl">
                  <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white">No orders recorded</p>
                  <p className="text-xs text-zinc-400 mt-1 mb-4">You haven't ordered any silhouettes yet.</p>
                  <button
                    onClick={() => setActivePage('shop')}
                    className="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 bg-[#111114] border border-zinc-800 rounded-2xl space-y-4 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-850 gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">ORDER NUMBER</span>
                          <h3 className="text-sm font-black text-white font-mono">{order.orderNumber || order.id}</h3>
                          <span className="text-xs text-zinc-400">{order.createdAt || order.date}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono ${
                              order.status === 'delivered'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                                : order.status === 'shipped' || order.status === 'out_for_delivery'
                                ? 'bg-sky-950/60 text-sky-400 border border-sky-800'
                                : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {order.status.replace('_', ' ')}
                          </span>

                          <button
                            onClick={() => handleTrackOrder(order)}
                            className="px-3.5 py-1.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                          >
                            Track Live
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-zinc-850/60">
                        {order.items.map((item) => {
                          const itemSize = item.selectedSize || item.size || 'Standard';
                          const itemColor = item.selectedColor || item.color || { name: 'Standard', hex: '#111', imageIndex: 0 };
                          const itemPrice = item.product?.price ?? 0;
                          const itemQty = item.quantity || 1;
                          return (
                            <div
                              key={`${item.id || item.product?.id || Math.random()}-${itemSize}`}
                              className="py-3 flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-zinc-950 p-1 shrink-0">
                                  <img
                                    src={item.product?.images?.[itemColor.imageIndex || 0] || item.product?.images?.[0] || ''}
                                    alt=""
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-white">{item.product?.name}</h4>
                                  <p className="text-[11px] text-zinc-400">
                                    {itemColor.name} • {itemSize} • Qty {itemQty}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-mono font-bold text-white">
                                GH₵{((itemPrice * itemQty) || 0).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-400">
                        <span>Paid via {(order.paymentMethod || order.paymentDetails?.method || 'Card').toUpperCase()}</span>
                        <div className="flex items-center gap-2">
                          <span>Total:</span>
                          <span className="text-sm font-bold text-white font-mono">
                            GH₵{((order.totalAmount ?? order.total) || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  Saved Wishlist ({wishlist.length})
                </h2>
                <p className="text-xs text-zinc-400">Silhouettes bookmarked for future drops and restocks.</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="p-12 text-center bg-zinc-900/40 border border-zinc-850 rounded-2xl">
                  <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white">Your wishlist is empty</p>
                  <p className="text-xs text-zinc-400 mt-1 mb-4">Click the heart on any shoe to save it here.</p>
                  <button
                    onClick={() => setActivePage('shop')}
                    className="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200"
                  >
                    Explore Footwear
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-[#111114] border border-zinc-800 rounded-2xl flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] bg-zinc-950 rounded-xl p-3 flex items-center justify-center mb-3 relative">
                        <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-rose-400"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono text-zinc-500">{product.brand}</span>
                        <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                        <span className="text-xs font-mono font-bold text-white block mt-1">
                          GH₵{product.price}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-850 flex gap-2">
                        <button
                          onClick={() => {
                            addToCart(product, 'US 9', product.colors[0], 1);
                            addToast('Added to bag', `${product.name} added.`, 'success');
                          }}
                          className="flex-1 py-2 bg-white hover:bg-zinc-200 text-black font-bold text-[11px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="p-6 sm:p-8 bg-[#111114] border border-zinc-800 rounded-2xl max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider text-white">
                  Personal Specifications & Sizing Preferences
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  We customize stock alerts and drop allocations based on your primary footwear size.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-zinc-950 border border-zinc-850 text-zinc-500 rounded-xl px-3.5 py-2.5 text-xs outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Primary Sizing Preference (US Men/Unisex)
                  </label>
                  <select
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(e.target.value as SneakerSize)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                  >
                    <option value="US 7">US 7.0</option>
                    <option value="US 8">US 8.0</option>
                    <option value="US 8.5">US 8.5</option>
                    <option value="US 9">US 9.0</option>
                    <option value="US 9.5">US 9.5</option>
                    <option value="US 10">US 10.0</option>
                    <option value="US 10.5">US 10.5</option>
                    <option value="US 11">US 11.0</option>
                    <option value="US 12">US 12.0</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  VIP Notifications & Drops
                </h2>
                <p className="text-xs text-zinc-400">Exclusive communications and drop invites.</p>
              </div>

              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Vanta Eclipse [Drop 04] Allocations</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Your allocation pass has been provisioned. Priority access opens tomorrow at 10:00 UTC.
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">2 hours ago</span>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Vault Welcome Credit</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Welcome to Maison VANTA. Use voucher code <strong>VANTA10</strong> for 10% off your inaugural pair.
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
