import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Tag } from 'lucide-react';
import { promotionService, Promotion, DiscountType } from '../../services/promotionService';
import { useStore } from '../../context/StoreContext';

export const AdminPromotions: React.FC = () => {
  const { addToast } = useStore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage' as DiscountType,
    discountValue: 10,
    startDate: '',
    endDate: '',
    status: 'active' as 'active' | 'paused' | 'archived',
    applicableProducts: [] as string[],
    applicableCategories: [] as string[],
    applicableCollections: [] as string[],
  });

  const loadPromotions = async () => {
    setIsLoading(true);
    const data = await promotionService.getAll();
    setPromotions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleOpenForm = (promo?: Promotion) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        name: promo.name,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        startDate: promo.startDate,
        endDate: promo.endDate,
        status: promo.status,
        applicableProducts: promo.applicableProducts || [],
        applicableCategories: promo.applicableCategories || [],
        applicableCollections: promo.applicableCollections || [],
      });
    } else {
      setEditingPromo(null);
      setFormData({
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active',
        applicableProducts: [],
        applicableCategories: [],
        applicableCollections: [],
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingPromo) {
      const success = await promotionService.update(editingPromo.id, formData);
      if (success) {
        addToast('Promotion Updated', `${formData.name} updated.`, 'success');
      }
    } else {
      const created = await promotionService.create(formData);
      if (created) {
        addToast('Promotion Created', `${formData.name} created.`, 'success');
      }
    }
    setIsFormOpen(false);
    loadPromotions();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const success = await promotionService.delete(id);
      if (success) {
        addToast('Promotion Deleted', `${name} has been removed.`, 'info');
        loadPromotions();
      }
    }
  };

  const filteredPromos = promotions.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Promotions</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage sales, markdowns, and automatic discounts.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Promotion</span>
        </button>
      </div>

      <div className="bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search promotions..."
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
                <th className="px-6 py-4 font-medium">Promotion Name</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Active Dates</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : filteredPromos.map((promo) => (
                <tr key={promo.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{promo.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 max-w-[200px] truncate">{promo.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-sky-400">
                      {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `GH₵${promo.discountValue} OFF`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-zinc-400 font-mono">
                      <div>{new Date(promo.startDate).toLocaleDateString()}</div>
                      {promo.endDate && <div>to {new Date(promo.endDate).toLocaleDateString()}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${promo.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenForm(promo)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(promo.id, promo.name)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredPromos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No promotions active.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <div className="relative bg-[#121215] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold uppercase tracking-wider text-white">
                {editingPromo ? 'Edit Promotion' : 'New Promotion'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Promotion Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none" placeholder="e.g. Summer Sale 2026" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Discount Type</label>
                  <select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value as any})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (GH₵)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Value</label>
                  <input type="number" required min="1" value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Start Date</label>
                  <input type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none font-mono" />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">End Date (Optional)</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none font-mono" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-3">
                <button type="submit" className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors">
                  {editingPromo ? 'Save Changes' : 'Create Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
