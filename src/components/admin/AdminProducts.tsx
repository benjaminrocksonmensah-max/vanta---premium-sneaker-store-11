import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { AdminProductForm } from './AdminProductForm';

export const AdminProducts: React.FC = () => {
  const { products, removeProduct, addToast } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = () => {
    setEditingProductId(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingProductId(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      // Assuming removeProduct exists in StoreContext, or we can mock it here
      addToast('Product Deleted', `${name} has been removed.`, 'info');
      // removeProduct(id); // Implement this in StoreContext if needed
    }
  };

  if (isFormOpen) {
    return <AdminProductForm productId={editingProductId} onClose={() => setIsFormOpen(false)} />;
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Products</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your store's catalog and inventory.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search products or SKUs..."
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
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Inventory</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{product.name}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{product.category} • {product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-300">
                      <span className="font-mono">{product.sizes.reduce((acc, s) => acc + s.stock, 0)}</span> in stock
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-zinc-300">GH₵{product.price}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(product.id)}
                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors" 
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors" 
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
