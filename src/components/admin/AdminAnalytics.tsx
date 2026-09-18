import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Package, RefreshCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Dummy analytics data
  const metrics = [
    { label: 'Total Revenue', value: 'GH₵124,500', change: '+12.5%', trend: 'up' },
    { label: 'Total Orders', value: '458', change: '+5.2%', trend: 'up' },
    { label: 'Average Order Value', value: 'GH₵271.83', change: '-1.4%', trend: 'down' },
    { label: 'Active Customers', value: '2,104', change: '+18.1%', trend: 'up' },
  ];

  const topProducts = [
    { name: 'Vanta Runner X1', sales: 142, revenue: 'GH₵35,500' },
    { name: 'Vanta Runner X2', sales: 98, revenue: 'GH₵24,500' },
    { name: 'Vanta Carbon Pro', sales: 85, revenue: 'GH₵29,750' },
    { name: 'Vanta Classic Low', sales: 64, revenue: 'GH₵12,800' }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-zinc-400 mt-1">Store performance and business intelligence.</p>
        </div>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-4 py-2.5 outline-none"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              {i === 0 ? <DollarSign className="w-16 h-16" /> : i === 1 ? <Package className="w-16 h-16" /> : i === 2 ? <RefreshCcw className="w-16 h-16" /> : <Users className="w-16 h-16" />}
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{metric.label}</p>
              <h3 className="text-2xl font-black text-white font-mono">{metric.value}</h3>
              <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${metric.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Revenue Overview</h3>
            </div>
          </div>
          <div className="h-[300px] w-full flex items-end justify-between gap-2">
            {/* Mock Chart Bars */}
            {[40, 70, 45, 90, 65, 85, 100, 60, 80, 50, 75, 95].map((h, i) => (
              <div key={i} className="w-full bg-zinc-900 rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                <div className="absolute inset-0 bg-sky-500/20 group-hover:bg-sky-500/40 transition-colors rounded-t-sm" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] font-mono px-2 py-1 rounded">
                  {h * 100}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>{timeRange === '7d' ? 'Mon' : 'Jan'}</span>
            <span>{timeRange === '7d' ? 'Sun' : 'Dec'}</span>
          </div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Top Products</h3>
          </div>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[150px]">{p.name}</span>
                  <span className="text-xs font-mono text-zinc-400">{p.revenue}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/50 rounded-full" style={{ width: `${(p.sales / topProducts[0].sales) * 100}%` }} />
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">{p.sales} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
