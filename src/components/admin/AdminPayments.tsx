import React, { useState } from 'react';
import { CreditCard, Save } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminPayments: React.FC = () => {
  const { addToast } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const [gateways, setGateways] = useState([
    { id: 'paystack', name: 'Paystack', enabled: true, isTestMode: true },
    { id: 'flutterwave', name: 'Flutterwave', enabled: false, isTestMode: true },
    { id: 'mobilemoney', name: 'Mobile Money (Manual)', enabled: true, isTestMode: false }
  ]);

  const [currency, setCurrency] = useState('GHS');

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      addToast('Payment Settings Saved', 'Gateway configurations updated successfully.', 'success');
    }, 800);
  };

  const toggleGateway = (id: string) => {
    setGateways(gateways.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  };

  const toggleTestMode = (id: string) => {
    setGateways(gateways.map(g => g.id === id ? { ...g, isTestMode: !g.isTestMode } : g));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Payments</h1>
          <p className="text-sm text-zinc-400 mt-1">Configure payment gateways, currencies, and tax rates.</p>
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
        {/* Payment Gateways */}
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Payment Gateways</h3>
          </div>
          
          <div className="space-y-4">
            {gateways.map(gateway => (
              <div key={gateway.id} className={`p-5 rounded-xl border transition-colors ${gateway.enabled ? 'bg-zinc-900 border-indigo-500/30' : 'bg-[#121215] border-zinc-800'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{gateway.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      Status: {gateway.enabled ? <span className="text-emerald-400 font-bold">Active</span> : 'Disabled'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={gateway.enabled} onChange={() => toggleGateway(gateway.id)} />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>

                {gateway.enabled && (
                  <div className="pt-4 border-t border-zinc-800/50 space-y-4">
                    <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gateway.isTestMode}
                        onChange={() => toggleTestMode(gateway.id)}
                        className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-0"
                      />
                      <span>Enable Test Mode (Sandbox)</span>
                    </label>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Public Key</label>
                      <input type="password" placeholder="pk_test_..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secret Key</label>
                      <input type="password" placeholder="sk_test_..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none font-mono" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Store Currency & Tax */}
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 h-max">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs">$</div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Currency & Tax</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">Base Store Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none font-bold"
              >
                <option value="GHS">GHS - Ghanaian Cedi</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">VAT / Tax Rate (%)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0"
              />
              <span className="text-sm font-bold text-white">Prices include tax</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
