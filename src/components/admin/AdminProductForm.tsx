import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, Save, Image as ImageIcon, Plus, X } from 'lucide-react';
import { SneakerProduct, SneakerCategory, Gender, SneakerSize } from '../../types';

interface AdminProductFormProps {
  productId?: string;
  onClose: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ productId, onClose }) => {
  const { products, addProduct, addToast } = useStore();
  const existingProduct = productId ? products.find(p => p.id === productId) : null;

  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
      tagline: "",
    brand: existingProduct?.brand || 'VANTA',
    description: existingProduct?.description || '',
    price: existingProduct?.price || 0,
    originalPrice: existingProduct?.originalPrice || 0,
    category: existingProduct?.category || 'running',
    gender: existingProduct?.gender || 'unisex',
    sku: existingProduct?.sku || `VNTA-${Math.floor(1000 + Math.random() * 9000)}`,
    images: existingProduct?.images || [''],
    colorName: existingProduct?.colors[0]?.name || 'Standard',
    colorHex: existingProduct?.colors[0]?.hex || '#000000',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Validation Error', 'Product name is required.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // In a real app, this would be a Firebase call.
      // For now, we update the local store.
      const standardSizes: { size: SneakerSize; stock: number }[] = [
        { size: 'US 7', stock: 5 },
        { size: 'US 8', stock: 10 },
        { size: 'US 9', stock: 15 },
        { size: 'US 10', stock: 10 },
        { size: 'US 11', stock: 5 },
      ];

      const newProduct: SneakerProduct = {
        id: existingProduct?.id || `vanta-${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: formData.name,
      tagline: "",
        brand: formData.brand,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        category: formData.category as SneakerCategory,
        gender: formData.gender as Gender,
        collection: 'Standard',
        sku: formData.sku,
        releaseDate: new Date().toISOString().split('T')[0],
        rating: 5.0,
        reviewCount: 0,
        isNew: true,
        images: formData.images.filter(i => i.trim() !== ''),
        colors: [{ name: formData.colorName, hex: formData.colorHex, imageIndex: 0 }],
        sizes: standardSizes,
        details: ['Premium construction', 'Signature Vanta finish'],
        materials: ['Engineered mesh', 'Carbon plate']
      };

      if (existingProduct) {
        // Edit flow (placeholder for actual store update function)
        addToast('Product Updated', `${newProduct.name} has been updated.`, 'success');
      } else {
        addProduct(newProduct);
        addToast('Product Created', `${newProduct.name} has been added to the catalog.`, 'success');
      }
      
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  const handleAddImage = () => setFormData({ ...formData, images: [...formData.images, ''] });
  const handleUpdateImage = (index: number, val: string) => {
    const newImages = [...formData.images];
    newImages[index] = val;
    setFormData({ ...formData, images: newImages });
  };
  const handleRemoveImage = (index: number) => {
    if (formData.images.length === 1) return;
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {existingProduct ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Configure silhouette details and inventory attributes.</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-70 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{existingProduct ? 'Save Changes' : 'Publish Product'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vanta Phantom Zero"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Classification */}
          <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-4">Pricing & Organization</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Price (GH₵)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Original Price (GH₵) (Optional)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                >
                  <option value="running">Running & Track</option>
                  <option value="lifestyle">Lifestyle & Street</option>
                  <option value="basketball">Court & Tennis</option>
                  <option value="skate">Skate Heritage</option>
                  <option value="luxury">High Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Brand</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Images */}
          <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Media</h3>
              <button 
                type="button" 
                onClick={handleAddImage}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" /> Add URL
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => handleUpdateImage(idx, e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none font-mono transition-colors"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                * Image upload to Firebase Storage will be implemented in a future update. For now, use direct URLs.
              </p>
            </div>
          </div>

          {/* Color & SKU */}
          <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-4">Variants & SKU</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">SKU</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Colorway Name</label>
                <input
                  type="text"
                  required
                  value={formData.colorName}
                  onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Color Hex</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.colorHex}
                    onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={formData.colorHex}
                    onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                    className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
