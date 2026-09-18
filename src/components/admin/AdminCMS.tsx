import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { cmsService, HomepageContent } from '../../services/cmsService';
import { useStore } from '../../context/StoreContext';

const DEFAULT_CONTENT: HomepageContent = {
  hero: {
    heading: 'STEP INTO WHAT\'S NEXT.',
    subheading: 'Engineered for the fearless.',
    image: '',
    ctaText: 'SHOP NEW ARRIVALS',
    ctaDestination: '/shop',
    active: true
  },
  promo: {
    heading: 'MID-SEASON SALE',
    description: 'Up to 40% off selected styles.',
    image: '',
    ctaText: 'SHOP SALE',
    startDate: '',
    endDate: '',
    active: false
  },
  featuredProducts: [],
  trendingProducts: [],
  featuredCollections: []
};

export const AdminCMS: React.FC = () => {
  const { addToast } = useStore();
  const [content, setContent] = useState<HomepageContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      const data = await cmsService.getHomepageContent();
      if (data) {
        setContent(data);
      } else {
        await cmsService.updateHomepageContent(DEFAULT_CONTENT);
      }
      setIsLoading(false);
    };
    loadContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await cmsService.updateHomepageContent(content);
    if (success) {
      addToast('CMS Updated', 'Homepage content has been published live.', 'success');
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="text-zinc-500 py-10 text-center">Loading CMS...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Homepage Content</h1>
          <p className="text-sm text-zinc-400 mt-1">Control the customer storefront experience.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)] disabled:opacity-50"
        >
          {isSaving ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Publish Live</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <LayoutTemplate className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Hero Banner</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Main Heading</label>
              <input
                type="text"
                value={content.hero.heading}
                onChange={(e) => setContent({...content, hero: {...content.hero, heading: e.target.value}})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Subheading</label>
              <input
                type="text"
                value={content.hero.subheading}
                onChange={(e) => setContent({...content, hero: {...content.hero, subheading: e.target.value}})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">CTA Text</label>
                <input
                  type="text"
                  value={content.hero.ctaText}
                  onChange={(e) => setContent({...content, hero: {...content.hero, ctaText: e.target.value}})}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors uppercase text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Destination URL</label>
                <input
                  type="text"
                  value={content.hero.ctaDestination}
                  onChange={(e) => setContent({...content, hero: {...content.hero, ctaDestination: e.target.value}})}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Background Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="url"
                  value={content.hero.image}
                  onChange={(e) => setContent({...content, hero: {...content.hero, image: e.target.value}})}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-colors font-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <input
                type="checkbox"
                checked={content.hero.active}
                onChange={(e) => setContent({...content, hero: {...content.hero, active: e.target.checked}})}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-sky-500 focus:ring-0"
              />
              <span className="text-sm font-bold text-white">Show Hero Section</span>
            </label>
          </div>
        </div>

        {/* Promo Section */}
        <div className="bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <LayoutTemplate className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Promo Banner</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Heading</label>
              <input
                type="text"
                value={content.promo.heading}
                onChange={(e) => setContent({...content, promo: {...content.promo, heading: e.target.value}})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Description</label>
              <input
                type="text"
                value={content.promo.description}
                onChange={(e) => setContent({...content, promo: {...content.promo, description: e.target.value}})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">CTA Text</label>
              <input
                type="text"
                value={content.promo.ctaText}
                onChange={(e) => setContent({...content, promo: {...content.promo, ctaText: e.target.value}})}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors uppercase text-xs"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <input
                type="checkbox"
                checked={content.promo.active}
                onChange={(e) => setContent({...content, promo: {...content.promo, active: e.target.checked}})}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-sky-500 focus:ring-0"
              />
              <span className="text-sm font-bold text-white">Show Promo Banner</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
