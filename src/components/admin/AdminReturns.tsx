import React, { useState } from 'react';
import { RotateCcw, Search, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminReturns: React.FC = () => {
  const { addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for returns
  const [returns, setReturns] = useState([
    { id: 'RMA-9002', orderId: 'ORD-10903', customer: 'David Osei', items: 1, reason: 'Wrong Size', status: 'pending', date: '2026-09-14' },
    { id: 'RMA-9001', orderId: 'ORD-10850', customer: 'Sarah Mensah', items: 2, reason: 'Changed Mind', status: 'approved', date: '2026-09-12' },
    { id: 'RMA-9000', orderId: 'ORD-10822', customer: 'Kofi Annan', items: 1, reason: 'Defective', status: 'rejected', date: '2026-09-10' }
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setReturns(returns.map(r => r.id === id ? { ...r, status: newStatus } : r));
    addToast('Return Updated', `RMA status changed to ${newStatus}.`, 'success');
  };

  const filtered = returns.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Returns & Refunds</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage RMA requests and process refunds.</p>
        </div>
      </div>

      <div className="bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search RMA or Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/50">
              <tr className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">RMA ID</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((ret) => (
                <tr key={ret.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-rose-400 shrink-0">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white font-mono">{ret.id}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{ret.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors">
                      {ret.orderId}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    {ret.customer}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {ret.reason} ({ret.items} item)
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                      ret.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      ret.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {ret.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ret.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateStatus(ret.id, 'approved')} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded font-bold text-[10px] uppercase tracking-wider transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleUpdateStatus(ret.id, 'rejected')} className="px-3 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded font-bold text-[10px] uppercase tracking-wider transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No returns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
