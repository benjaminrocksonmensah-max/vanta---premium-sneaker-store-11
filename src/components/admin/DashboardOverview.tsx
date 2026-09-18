import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { products, orders } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + ((o.totalAmount ?? o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) =>
    p.sizes.some((s) => s.stock > 0 && s.stock <= 3)
  ).length;

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Store performance and operational metrics.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111114] border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider">
            <span>Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono pt-2">
            GH₵{(totalRevenue || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">+14.2% this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111114] border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider">
            <span>Orders</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono pt-2">
            {totalOrdersCount}
          </div>
          <span className="text-[11px] text-zinc-500">100% fulfilment rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111114] border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider">
            <span>Products</span>
            <Package className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black text-white font-mono pt-2">
            {products.length}
          </div>
          <span className="text-[11px] text-zinc-500">Active catalog</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111114] border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider">
            <span>Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono pt-2">
            {lowStockCount}
          </div>
          <span className="text-[11px] text-zinc-500">Action required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-[#111114] border border-zinc-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Top Performing Products</span>
          </h3>
          <div className="space-y-4 pt-2">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-medium">{p.name}</span>
                  <span className="text-zinc-400 font-mono">GH₵{p.price * 14}</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.max(15, Math.random() * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-[#111114] border border-zinc-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-sky-400" />
            <span>Recent Orders</span>
          </h3>
          <div className="space-y-3 pt-2">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div>
                  <p className="text-xs font-bold text-white font-mono uppercase">#{o.id.substring(0, 6)}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{new Date(o.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-emerald-400">GH₵{(o.totalAmount ?? o.total).toFixed(2)}</p>
                  <p className="text-[10px] uppercase font-bold text-sky-400 mt-0.5">{o.status}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-sm text-zinc-500 text-center py-6">
                No orders yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
