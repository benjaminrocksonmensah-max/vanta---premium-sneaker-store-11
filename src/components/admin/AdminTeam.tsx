import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield, Plus } from 'lucide-react';

export const AdminTeam: React.FC = () => {
  const { adminAccounts, createAdminAccount } = useStore();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername && newPassword) {
      if (createAdminAccount(newUsername, newPassword)) {
        setNewUsername('');
        setNewPassword('');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Team & Roles</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage staff accounts and operational access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-850 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-medium">Username</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Added On</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {adminAccounts.map((account: any) => (
                  <tr key={account.id} className="text-zinc-300">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-white uppercase shrink-0 shadow-inner">
                          {account.username.charAt(0)}
                        </div>
                        <span className="font-bold text-white">{account.username}</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-xs">
                      {account.role === 'superadmin' ? (
                        <span className="text-amber-400">Super Admin</span>
                      ) : (
                        <span className="text-sky-400">Operator</span>
                      )}
                    </td>
                    <td className="py-4 text-zinc-500 font-mono text-xs">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <span className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-[#111114] border border-zinc-800 rounded-3xl space-y-4 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Add Staff Member</span>
          </h3>
          <p className="text-xs text-zinc-400 pb-2 border-b border-zinc-850">
            Create dedicated login credentials for store operators. They will have access to order fulfillment and catalog management.
          </p>
          
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">New Username</label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. operator_alex"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Temporary Passkey</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter passkey"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(14,165,233,0.2)] flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
