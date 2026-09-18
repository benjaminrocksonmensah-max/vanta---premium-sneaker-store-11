import React, { useState } from 'react';
import { Settings, Save, Store, Globe, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { addToast } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    storeName: 'VANTA',
    supportEmail: 'support@vanta.com',
    phoneNumber: '+1 (555) 000-0000',
    address: '123 Innovation Drive, Tech District',
    timezone: 'UTC',
    maintenanceMode: false,
    orderPrefix: 'ORD-',
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings Saved', 'Global store settings updated successfully.', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">Global configuration for your storefront.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isSaving ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Store className="w-5 h-5 text-zinc-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">General Profile</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Business Address</label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 h-max">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Settings className="w-5 h-5 text-zinc-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">System Preference</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none"
              >
                <option value="UTC">UTC - Universal Time</option>
                <option value="EST">EST - Eastern Standard Time</option>
                <option value="PST">PST - Pacific Standard Time</option>
                <option value="GMT">GMT - Greenwich Mean Time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Order ID Prefix</label>
              <input
                type="text"
                value={settings.orderPrefix}
                onChange={(e) => setSettings({...settings, orderPrefix: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                className="w-4 h-4 rounded bg-zinc-950 border-rose-500/30 text-rose-500 focus:ring-0"
              />
              <span className="text-sm font-bold text-rose-400">Enable Maintenance Mode (Store Offline)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
