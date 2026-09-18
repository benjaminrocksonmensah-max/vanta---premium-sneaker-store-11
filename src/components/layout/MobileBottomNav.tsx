import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { ActivePage } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { activePage, setActivePage, cartCount, wishlist, setIsCartDrawerOpen } = useStore();

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0F]/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-2">
      <div className="flex items-center justify-around">
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
            activePage === 'home' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigateTo('shop')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
            activePage === 'shop' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => navigateTo('wishlist')}
          className={`relative flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
            activePage === 'wishlist' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-zinc-500 hover:text-white transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-zinc-400">Bag</span>
        </button>

        <button
          onClick={() => navigateTo('account')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
            activePage === 'account' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </button>
      </div>
    </nav>
  );
};
