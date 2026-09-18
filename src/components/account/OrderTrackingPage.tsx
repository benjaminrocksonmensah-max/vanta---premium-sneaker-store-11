import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Order } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const { orders, selectedOrder, setSelectedOrder, setActivePage, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState(selectedOrder?.id || '');

  // Find order by search
  const currentOrder =
    selectedOrder ||
    orders.find(
      (o) =>
        o.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        o.trackingNumber.toLowerCase() === searchQuery.trim().toLowerCase()
    ) ||
    orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        o.trackingNumber.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (found) {
      setSelectedOrder(found);
      addToast('Order located', `Showing shipment status for ${found.id}`, 'success');
    } else {
      addToast('Order not found', 'Please check the order or tracking identifier.', 'error');
    }
  };

  const STEPS = [
    { key: 'placed', label: 'Order Confirmed', icon: Clock, desc: 'Payment received & vault allocation locked' },
    { key: 'processing', label: 'NFC Authentication', icon: ShieldCheck, desc: 'Artisanal inspection and cryptographic tag encoding' },
    { key: 'shipped', label: 'Handed to Courier', icon: Truck, desc: 'Express air transit initiated' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin, desc: 'Courier on final route to destination' },
    { key: 'delivered', label: 'Delivered to Vault', icon: CheckCircle2, desc: 'Signed and safely received' }
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'placed': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const activeStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 2;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title & Lookup */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          LOGISTICS & VAULT PROVENANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Syne',sans-serif]">
          Track Your Silhouette
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Enter your Order Number (e.g. {orders[0]?.id || 'VNTA-ORD-83921'}) or Tracking Number to inspect transit milestones.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID (e.g. VNTA-ORD-...)"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {currentOrder && (
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-850 gap-4">
            <div>
              <span className="text-xs font-mono text-zinc-500">ESTIMATED DELIVERY</span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-['Syne',sans-serif]">
                {currentOrder.estimatedDelivery}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Carrier: DHL Express Worldwide</p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-mono text-zinc-500">TRACKING NUMBER</span>
              <p className="text-sm font-mono font-bold text-white">{currentOrder.trackingNumber}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-zinc-300">
                Status: {currentOrder.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-4">
            <div className="relative">
              {/* Connector line */}
              <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-zinc-800 -z-0" />
              <div
                className="hidden sm:block absolute top-5 left-8 h-0.5 bg-white transition-all duration-500 -z-0"
                style={{ width: `${(activeStepIdx / (STEPS.length - 1)) * 90}%` }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
                {STEPS.map((s, idx) => {
                  const isCompleted = idx <= activeStepIdx;
                  const isCurrent = idx === activeStepIdx;
                  const Icon = s.icon;

                  return (
                    <div key={s.key} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isCompleted
                            ? 'bg-white text-black border-white'
                            : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                        } ${isCurrent ? 'ring-4 ring-white/20' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <h4 className={`text-xs font-bold ${isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                          {s.label}
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2 max-w-[130px]">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shipment Details & Contents */}
          <div className="pt-6 border-t border-zinc-850 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-zinc-500 font-mono block mb-1">SHIPPING DESTINATION</span>
              <p className="text-zinc-200 font-medium leading-relaxed">
                {currentOrder.shippingAddress?.fullName}<br />
                {currentOrder.shippingAddress?.street || currentOrder.shippingAddress?.addressLine1}<br />
                {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state || currentOrder.shippingAddress?.stateOrRegion} {currentOrder.shippingAddress?.postalCode}<br />
                {currentOrder.shippingAddress?.country}
              </p>
            </div>

            <div>
              <span className="text-zinc-500 font-mono block mb-1">AUTHENTICATION CREDENTIALS</span>
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>VANTA Cryptographic Chip #9921-X</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Touch your smartphone to the tongue logo upon unboxing to verify provenance and claim your digital twin.
                </p>
              </div>
            </div>
          </div>

          {/* Items in this shipment */}
          <div className="pt-6 border-t border-zinc-850">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              Silhouettes in Shipment ({currentOrder.items?.length || 0})
            </span>
            <div className="space-y-2">
              {currentOrder.items?.map((item) => {
                const itemSize = item.selectedSize || item.size || 'Standard';
                const itemColor = item.selectedColor || item.color || { name: 'Standard', hex: '#111', imageIndex: 0 };
                const itemPrice = item.product?.price ?? 0;
                const itemQty = item.quantity || 1;
                return (
                  <div
                    key={`${item.id || item.product?.id || Math.random()}-${itemSize}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-850"
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
          </div>

          {/* Need help footer */}
          <div className="pt-6 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-400">
            <span>Any issues with your delivery?</span>
            <button
              onClick={() => setActivePage('contact')}
              className="text-white hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Contact Vault Concierge</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
