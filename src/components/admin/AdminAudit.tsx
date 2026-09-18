import React, { useState } from 'react';
import { History, Search, Filter } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminAudit: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy audit data
  const logs = [
    { id: 'LOG-092', action: 'Order Status Updated', resource: 'Order ORD-10903', user: 'Admin User', date: '2026-09-14 14:30:22', type: 'update' },
    { id: 'LOG-091', action: 'Product Price Changed', resource: 'Vanta Runner X1', user: 'Admin User', date: '2026-09-14 10:15:00', type: 'update' },
    { id: 'LOG-090', action: 'Promotion Created', resource: 'Summer Sale', user: 'Marketing Manager', date: '2026-09-13 16:45:12', type: 'create' },
    { id: 'LOG-089', action: 'System Login', resource: 'Admin Portal', user: 'Admin User', date: '2026-09-13 09:00:00', type: 'auth' },
    { id: 'LOG-088', action: 'Product Deleted', resource: 'Legacy Sneaker 2024', user: 'Super Admin', date: '2026-09-12 11:20:45', type: 'delete' },
    { id: 'LOG-087', action: 'Settings Updated', resource: 'Payment Gateways', user: 'Super Admin', date: '2026-09-11 15:10:30', type: 'update' }
  ];

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Audit Log</h1>
          <p className="text-sm text-zinc-400 mt-1">Track system events and administrative actions.</p>
        </div>
      </div>

      <div className="bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search logs by action, resource, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none"
            />
          </div>
          <button className="p-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/50">
              <tr className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Log ID & Time</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Resource Target</th>
                <th className="px-6 py-4 font-medium">Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                        log.type === 'create' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        log.type === 'delete' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                        log.type === 'auth' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        <History className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white font-mono text-[11px]">{log.id}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{log.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-300 text-xs px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700">
                      {log.user}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No matching logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
