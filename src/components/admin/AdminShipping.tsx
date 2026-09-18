import React, { useState } from 'react';
import { Truck, Save, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminShipping: React.FC = () => {
  const { addToast } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const [zones, setZones] = useState([
    { id: 1, name: 'Domestic (Ghana)', rate: 50, enabled: true },
    { id: 2, name: 'West Africa (ECOWAS)', rate: 150, enabled: true },
    { id: 3, name: 'International (Rest of World)', rate: 350, enabled: false }
  ]);

  const [settings, setSettings] = useState({
    freeShippingThreshold: 1000,
    enableFreeShipping: true,
    handlingFee: 0
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings Saved', 'Shipping configuration updated successfully.', 'success');
    }, 800);
  };

  const toggleZone = (id: number) => {
    setZones(zones.map(z => z.id === id ? { ...z, enabled: !z.enabled } : z));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Shipping</h1>
          <p className="text-sm text-zinc-400 mt-1">Configure delivery zones, rates, and thresholds.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isSaving ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Zones */}
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Delivery Zones</h3>
          </div>
          
          <div className="space-y-4">
            {zones.map(zone => (
              <div key={zone.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div>
                  <h4 className="text-sm font-bold text-white">{zone.name}</h4>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Base Rate: GH₵{zone.rate}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={zone.enabled} onChange={() => toggleZone(zone.id)} />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Truck className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Global Rules</h3>
          </div>
          
          <div className="space-y-6">
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <input
                type="checkbox"
                checked={settings.enableFreeShipping}
                onChange={(e) => setSettings({...settings, enableFreeShipping: e.target.checked})}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-sky-500 focus:ring-0"
              />
              <span className="text-sm font-bold text-white">Enable Free Shipping Threshold</span>
            </label>

            {settings.enableFreeShipping && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Free Shipping Minimum (GH₵)</label>
                <input
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({...settings, freeShippingThreshold: parseInt(e.target.value) || 0})}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Handling Fee (GH₵)</label>
              <input
                type="number"
                value={settings.handlingFee}
                onChange={(e) => setSettings({...settings, handlingFee: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
