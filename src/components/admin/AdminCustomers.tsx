import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Mail, Phone, MapPin } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { UserProfile } from '../../types';

export const AdminCustomers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Customers</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage collectors and view profiles from Firebase.</p>
        </div>
      </div>

      <div className="bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search by name or email..."
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
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : filteredCustomers.map((customer) => (
                <tr key={customer.uid} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white uppercase shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{customer.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">UID: {customer.uid.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      {customer.address ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="max-w-[200px] truncate">{customer.address.city}, {customer.address.country}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">No Address</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs font-mono">
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {!isLoading && filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
