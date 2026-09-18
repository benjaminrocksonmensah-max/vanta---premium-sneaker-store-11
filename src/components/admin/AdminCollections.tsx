import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { collectionService, CollectionData } from '../../services/collectionService';
import { useStore } from '../../context/StoreContext';

export const AdminCollections: React.FC = () => {
  const { addToast } = useStore();
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionData | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    coverImage: '',
    status: 'active' as 'active' | 'archived' | 'disabled',
    displayOrder: 0,
    featured: false,
    productIds: [] as string[]
  });

  const loadCollections = async () => {
    setIsLoading(true);
    const data = await collectionService.getAll();
    if (data.length === 0) {
       const initial: Omit<CollectionData, 'id' | 'createdAt' | 'updatedAt'> = {
         name: 'New Season',
         slug: 'new-season',
         description: 'The latest drops for this season.',
         coverImage: '',
         status: 'active',
         displayOrder: 1,
         featured: true,
         productIds: []
       };
       await collectionService.create(initial);
       const newData = await collectionService.getAll();
       setCollections(newData);
    } else {
       setCollections(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleOpenForm = (collectionData?: CollectionData) => {
    if (collectionData) {
      setEditingCollection(collectionData);
      setFormData({
        name: collectionData.name,
        slug: collectionData.slug,
        description: collectionData.description,
        coverImage: collectionData.coverImage,
        status: collectionData.status,
        displayOrder: collectionData.displayOrder,
        featured: collectionData.featured,
        productIds: collectionData.productIds || []
      });
    } else {
      setEditingCollection(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        coverImage: '',
        status: 'active',
        displayOrder: collections.length + 1,
        featured: false,
        productIds: []
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCollection) {
      const success = await collectionService.update(editingCollection.id, formData);
      if (success) {
        addToast('Collection Updated', `${formData.name} updated successfully.`, 'success');
      }
    } else {
      const created = await collectionService.create(formData);
      if (created) {
        addToast('Collection Created', `${formData.name} created successfully.`, 'success');
      }
    }
    setIsFormOpen(false);
    loadCollections();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const success = await collectionService.delete(id);
      if (success) {
        addToast('Collection Deleted', `${name} has been removed.`, 'info');
        loadCollections();
      }
    }
  };

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Collections</h1>
          <p className="text-sm text-zinc-400 mt-1">Curate and group products for merchandising.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </button>
      </div>

      <div className="bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search collections..."
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
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Collection</th>
                <th className="px-6 py-4 font-medium">Products</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : filteredCollections.map((col) => (
                <tr key={col.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-zinc-500">{col.displayOrder}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                        {col.coverImage ? <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-zinc-600">{col.name.charAt(0)}</div>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{col.name}</p>
                          {col.featured && <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">Featured</span>}
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">/{col.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-zinc-400">{col.productIds?.length || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${col.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                      {col.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenForm(col)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(col.id, col.name)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No collections found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <div className="relative bg-[#121215] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold uppercase tracking-wider text-white">
                {editingCollection ? 'Edit Collection' : 'Add Collection'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Slug</label>
                <input type="text" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 outline-none font-mono" />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none resize-none" rows={3} />
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 rounded bg-zinc-900 border-zinc-800" />
                <label htmlFor="featured" className="font-semibold text-zinc-300">Featured Collection</label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Display Order</label>
                  <input type="number" required value={formData.displayOrder} onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none font-mono" />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none">
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
              <div className="pt-3">
                <button type="submit" className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors">
                  {editingCollection ? 'Update Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
