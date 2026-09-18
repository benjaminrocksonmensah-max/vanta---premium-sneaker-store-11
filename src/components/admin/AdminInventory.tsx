import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Layers, Search, AlertTriangle, Check, Save } from 'lucide-react';
import { SneakerProduct, SneakerSize } from '../../types';

export const AdminInventory: React.FC = () => {
  const { products, updateProduct, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track local stock edits before saving
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  const handleStockChange = (productId: string, size: string, newStock: number) => {
    setStockEdits({
      ...stockEdits,
      [`${productId}_${size}`]: newStock
    });
  };

  const handleSaveStock = (product: SneakerProduct) => {
    let hasChanges = false;
    const updatedSizes = product.sizes.map(s => {
      const editKey = `${product.id}_${s.size}`;
      if (stockEdits[editKey] !== undefined && stockEdits[editKey] !== s.stock) {
        hasChanges = true;
        return { ...s, stock: stockEdits[editKey] };
      }
      return s;
    });

    if (hasChanges) {
      updateProduct({ ...product, sizes: updatedSizes });
      addToast('Inventory Updated', `Stock levels for ${product.name} have been updated.`, 'success');
      
      // Clear edits for this product
      const newEdits = { ...stockEdits };
      product.sizes.forEach(s => delete newEdits[`${product.id}_${s.size}`]);
      setStockEdits(newEdits);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Inventory</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage variant-level stock across your catalog.</p>
        </div>
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
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/50">
              <tr className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Product / SKU</th>
                <th className="px-6 py-4 font-medium">Variant (Size)</th>
                <th className="px-6 py-4 font-medium text-center">Current Stock</th>
                <th className="px-6 py-4 font-medium text-center">Adjust</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  {product.sizes.map((sizeObj, idx) => {
                    const editKey = `${product.id}_${sizeObj.size}`;
                    const currentEditVal = stockEdits[editKey];
                    const hasChanged = currentEditVal !== undefined && currentEditVal !== sizeObj.stock;
                    
                    return (
                      <tr key={`${product.id}-${sizeObj.size}`} className="hover:bg-zinc-900/30 transition-colors">
                        {idx === 0 && (
                          <td className="px-6 py-4 align-top" rowSpan={product.sizes.length}>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 mt-1">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-white text-xs">{product.name}</p>
                                <p className="text-[10px] text-zinc-500 font-mono mt-1">{product.sku}</p>
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <span className="font-mono text-zinc-300">{sizeObj.size}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {sizeObj.stock <= 3 ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <AlertTriangle className="w-3 h-3" />
                              {sizeObj.stock} Left
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-300">
                              {sizeObj.stock} Units
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            min="0"
                            value={currentEditVal !== undefined ? currentEditVal : sizeObj.stock}
                            onChange={(e) => handleStockChange(product.id, sizeObj.size, parseInt(e.target.value) || 0)}
                            className={`w-20 text-center bg-zinc-900 border ${hasChanged ? 'border-sky-500 text-sky-400' : 'border-zinc-800 text-white'} focus:border-zinc-500 rounded-lg px-2 py-1.5 text-xs outline-none font-mono transition-colors`}
                          />
                        </td>
                        {idx === 0 && (
                          <td className="px-6 py-4 text-right align-top" rowSpan={product.sizes.length}>
                            <button 
                              onClick={() => handleSaveStock(product)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save All</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </React.Fragment>
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
