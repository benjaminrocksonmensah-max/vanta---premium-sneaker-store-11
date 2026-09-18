import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  Bell,
  User,
  Menu,
  X,
  Sparkles,
  Shield,
  ChevronDown,
  ArrowRight,
  Package,
  MapPin,
  LogOut,
  SlidersHorizontal,
  Compass,
  Flame,
  HelpCircle,
  Layers,
  Sparkle
} from 'lucide-react';
import { ActivePage, Gender } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { formatCediCompact } from '../../utils/currency';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    wishlist,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsSearchModalOpen,
    user,
    logout,
    setFilterState
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShopGender = (gender: Gender) => {
    setFilterState((prev) => ({ ...prev, gender, category: 'all' }));
    setActivePage('shop');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D0D0F]/95 backdrop-blur-xl border-b border-zinc-800/80">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-900/90 text-center text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-zinc-400 flex items-center justify-center gap-3 sm:gap-4 overflow-hidden">
        <span className="flex items-center gap-1.5 whitespace-nowrap text-zinc-300">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          WORLDWIDE EXPRESS SHIPPING ON ORDERS OVER GH₵ 200
        </span>
        <span className="hidden md:inline text-zinc-700">•</span>
        <span className="hidden md:inline text-zinc-400 whitespace-nowrap">EVERY PAIR CERTIFIED 100% AUTHENTIC</span>
        <span className="hidden lg:inline text-zinc-700">•</span>
        <span className="hidden lg:inline text-zinc-400 whitespace-nowrap">NEW DROP LIVE: VANTA ECLIPSE</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-xl hover:bg-zinc-800/70 transition-colors"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <button
              onClick={() => navigateTo('home')}
              className="group flex items-center gap-2 sm:gap-2.5 text-left text-white"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-black flex items-center justify-center font-black text-xs sm:text-sm rounded tracking-tighter font-['Syne',sans-serif] group-hover:scale-105 transition-transform shadow-md">
                V
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-black tracking-[0.16em] font-['Syne',sans-serif] leading-none text-white">
                  VANTA
                </span>
                <span className="text-[7.5px] sm:text-[8px] tracking-[0.22em] uppercase text-zinc-400 font-semibold mt-0.5 whitespace-nowrap hidden sm:block">
                  Move Different
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3 2xl:gap-5 text-[11px] xl:text-xs font-bold uppercase tracking-[0.08em] xl:tracking-[0.12em] text-zinc-300 whitespace-nowrap">
            <button
              onClick={() => navigateTo('home')}
              className={`px-2 py-1 rounded-lg hover:text-white transition-colors border-b-2 ${
                activePage === 'home' ? 'text-white border-white font-black' : 'border-transparent text-zinc-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setFilterState((p) => ({ ...p, category: 'all', gender: 'all' }));
                navigateTo('shop');
              }}
              className={`px-2 py-1 rounded-lg hover:text-white transition-colors border-b-2 ${
                activePage === 'shop' ? 'text-white border-white font-black' : 'border-transparent text-zinc-400'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => navigateTo('new-arrivals')}
              className={`px-2 py-1 rounded-lg hover:text-white transition-colors border-b-2 ${
                activePage === 'new-arrivals' ? 'text-white border-white font-black' : 'border-transparent text-zinc-400'
              }`}
            >
              New Drops
            </button>
            <button
              onClick={() => navigateToShopGender('men')}
              className="px-2 py-1 rounded-lg hover:text-white transition-colors text-zinc-400 pb-1 border-b-2 border-transparent"
            >
              Men
            </button>
            <button
              onClick={() => navigateToShopGender('women')}
              className="px-2 py-1 rounded-lg hover:text-white transition-colors text-zinc-400 pb-1 border-b-2 border-transparent"
            >
              Women
            </button>
            <button
              onClick={() => navigateToShopGender('kids')}
              className="hidden 2xl:inline-block px-2 py-1 rounded-lg hover:text-white transition-colors text-zinc-400 pb-1 border-b-2 border-transparent"
            >
              Kids
            </button>
            <button
              onClick={() => navigateTo('collections')}
              className={`hidden xl:inline-block px-2 py-1 rounded-lg hover:text-white transition-colors border-b-2 ${
                activePage === 'collections' ? 'text-white border-white font-black' : 'border-transparent text-zinc-400'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => navigateTo('sale')}
              className={`px-2 py-1 rounded-lg hover:text-rose-400 transition-colors border-b-2 ${
                activePage === 'sale' ? 'text-rose-400 border-rose-400 font-black' : 'border-transparent text-rose-400/90'
              }`}
            >
              Sale
            </button>
          </nav>

          {/* Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full p-2 xl:px-3 xl:py-1.5 transition-all text-xs"
              aria-label="Search sneakers"
              title="Search catalog (⌘K)"
            >
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="hidden xl:inline text-xs text-zinc-400 font-medium">Search...</span>
              <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/70 rounded-full transition-colors relative"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-zinc-950" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-88 bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 text-zinc-200"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">Notifications</span>
                        {unreadNotificationsCount > 0 && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                            {unreadNotificationsCount} new
                          </span>
                        )}
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={() => markAllNotificationsAsRead()}
                          className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-zinc-800/60 max-h-72 overflow-y-auto my-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-6 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                              n.read ? 'hover:bg-zinc-800/40' : 'bg-zinc-800/30 hover:bg-zinc-800/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-white leading-snug">{n.title}</span>
                              <span className="text-[10px] text-zinc-500 shrink-0">{n.date}</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-zinc-800 text-center">
                      <button
                        onClick={() => {
                          setIsNotificationOpen(false);
                          navigateTo('new-arrivals');
                        }}
                        className="text-xs text-zinc-400 hover:text-white font-medium"
                      >
                        Explore latest drops →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/70 rounded-full transition-colors relative"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/70 border border-zinc-800 hover:border-zinc-700 rounded-full transition-all group shadow-sm"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-mono font-bold text-white tracking-wide">
                {formatCediCompact(cartSubtotal)}
              </span>
            </button>

            {/* User Account / Profile Dropdown - ALWAYS VISIBLE */}
            <div className="relative shrink-0" ref={userRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-1.5 sm:py-1 rounded-full border border-zinc-700/80 hover:border-zinc-500 bg-zinc-900/95 hover:bg-zinc-800 transition-all cursor-pointer shadow-sm ring-1 ring-white/10"
                aria-label="User Account Menu"
                title="Account Menu"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-zinc-600"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200 font-bold text-xs">
                    {user?.fullName?.charAt(0) || <User className="w-4 h-4" />}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-zinc-400 mr-0.5 hidden sm:inline" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 text-zinc-200"
                  >
                    {/* User Info Header */}
                    <div className="p-3 border-b border-zinc-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[140px]">
                          {user?.fullName || 'Collector'}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                          {user?.role === 'admin' ? 'Staff' : 'Member'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">{user?.email}</p>
                    </div>

                    {/* Menu links */}
                    <div className="py-1 space-y-0.5 text-xs">
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('admin');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold flex items-center gap-2 transition-colors border border-zinc-800/80 my-1"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Staff Management Console</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('account');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Account & Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('account');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Orders & Tracking</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('wishlist');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Saved Wishlist ({wishlist.length})</span>
                      </button>
                    </div>

                    {/* Sign out */}
                    <div className="pt-1 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/30 text-rose-300 flex items-center gap-2 text-xs transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of VANTA</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Mobile & Tablet Slide Drawer Layout */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm sm:max-w-md bg-[#0D0D10] border-r border-zinc-800/90 z-50 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto lg:hidden shadow-2xl"
            >
              <div className="space-y-6">
                {/* Header with Brand and Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-sm rounded tracking-tighter font-['Syne',sans-serif] shadow">
                      V
                    </div>
                    <div>
                      <span className="font-extrabold tracking-[0.2em] font-['Syne',sans-serif] text-white text-lg block leading-none">
                        VANTA
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-mono">
                        Luxury Footwear
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Search inside Drawer */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-zinc-500" />
                    <span>Search silhouettes, sizes...</span>
                  </div>
                  <kbd className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                    ⌘K
                  </kbd>
                </button>

                {/* Structured Navigation Groups */}
                <div className="space-y-5">
                  {/* Category 1: Discover & Shop */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-2 px-1 font-mono">
                      Discover & Shop
                    </span>
                    <div className="space-y-1">
                      <button
                        onClick={() => navigateTo('home')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                          activePage === 'home' ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        <span>Home</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                      </button>
                      <button
                        onClick={() => {
                          setFilterState((p) => ({ ...p, category: 'all', gender: 'all' }));
                          navigateTo('shop');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                          activePage === 'shop' ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-zinc-400" />
                          <span>Shop All Catalog</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                      </button>
                      <button
                        onClick={() => navigateTo('new-arrivals')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                          activePage === 'new-arrivals' ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkle className="w-4 h-4 text-amber-400" />
                          <span>New Arrivals</span>
                        </div>
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono uppercase font-bold">New</span>
                      </button>
                      <button
                        onClick={() => navigateTo('collections')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                          activePage === 'collections' ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-zinc-400" />
                          <span>Curated Drops</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                      </button>
                      <button
                        onClick={() => navigateTo('sale')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                          activePage === 'sale' ? 'bg-rose-950/40 text-rose-300 border border-rose-900/60' : 'text-rose-400 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-rose-400" />
                          <span>Archive & Vault Sale</span>
                        </div>
                        <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-mono uppercase font-bold">Sale</span>
                      </button>
                    </div>
                  </div>

                  {/* Category 2: Footwear Silhouettes by Gender */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-2 px-1 font-mono">
                      Silhouettes by Gender
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => navigateToShopGender('men')}
                        className="py-2.5 px-2 text-center rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
                      >
                        Men
                      </button>
                      <button
                        onClick={() => navigateToShopGender('women')}
                        className="py-2.5 px-2 text-center rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
                      >
                        Women
                      </button>
                      <button
                        onClick={() => navigateToShopGender('kids')}
                        className="py-2.5 px-2 text-center rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
                      >
                        Kids
                      </button>
                    </div>
                  </div>

                  {/* Category 3: Maison & Client Concierge */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-2 px-1 font-mono">
                      Maison & Support
                    </span>
                    <div className="space-y-1">
                      <button
                        onClick={() => navigateTo('order-tracking')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Live Order Tracking</span>
                      </button>
                      <button
                        onClick={() => navigateTo('faq')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Sizing & Verification FAQ</span>
                      </button>
                      <button
                        onClick={() => navigateTo('about')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-zinc-500" />
                        <span>About Brand & Craft</span>
                      </button>
                      <button
                        onClick={() => navigateTo('contact')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Concierge & Stores</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Drawer Bottom User Details & Region Info */}
              <div className="pt-4 border-t border-zinc-800/80 space-y-3 mt-4">
                {/* Currency & Region Badge */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇬🇭</span>
                    <span className="font-medium text-zinc-300">Ghana (GHS • GH₵)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">NFC Active</span>
                </div>

                {/* Profile row */}
                <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs font-bold">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="max-w-[130px] truncate">
                      <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Collector'}</p>
                      <p className="text-[10px] text-zinc-400 uppercase font-mono">{user?.role === 'admin' ? 'Staff Admin' : 'VIP Member'}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo(user?.role === 'admin' ? 'admin' : 'account');
                  }}
                  className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl text-center shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {user?.role === 'admin' ? (
                    <>
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>Open Staff Console</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>My Account & Orders</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

