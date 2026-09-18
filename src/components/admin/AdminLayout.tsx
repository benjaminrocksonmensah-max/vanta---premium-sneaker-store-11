import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tags,
  ShoppingBag,
  Users,
  MessageSquare,
  Megaphone,
  Ticket,
  Image as ImageIcon,
  Bell,
  Truck,
  CreditCard,
  RotateCcw,
  BarChart3,
  Shield,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const SIDEBAR_SECTIONS = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'STORE',
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'inventory', label: 'Inventory', icon: Layers },
      { id: 'categories', label: 'Categories', icon: Tags },
      { id: 'brands', label: 'Brands', icon: Tags },
      { id: 'collections', label: 'Collections', icon: Layers }
    ]
  },
  {
    title: 'SALES',
    items: [
      { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '12' },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'reviews', label: 'Reviews', icon: MessageSquare }
    ]
  },
  {
    title: 'MARKETING',
    items: [
      { id: 'promotions', label: 'Promotions', icon: Megaphone },
      { id: 'coupons', label: 'Coupons', icon: Ticket },
      { id: 'cms', label: 'Homepage Content', icon: ImageIcon },
      { id: 'notifications', label: 'Notifications', icon: Bell }
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'shipping', label: 'Shipping', icon: Truck },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'returns', label: 'Returns', icon: RotateCcw }
    ]
  },
  {
    title: 'ANALYTICS',
    items: [
      { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 }
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'team', label: 'Team & Roles', icon: Shield },
      { id: 'audit', label: 'Audit Log', icon: History },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeView, setActiveView }) => {
  const { adminUser, logoutAdmin, setActivePage } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const NavItem: React.FC<{ item: any }> = ({ item }) => {
    const isActive = activeView === item.id;
    const Icon = item.icon;

    return (
      <button
        onClick={() => {
          setActiveView(item.id);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all mb-1 ${
          isActive 
            ? 'bg-sky-500/10 text-sky-400 font-semibold' 
            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-zinc-500'}`} />
          {(isSidebarOpen || isMobileMenuOpen) && (
            <span className="text-sm">{item.label}</span>
          )}
        </div>
        {(isSidebarOpen || isMobileMenuOpen) && item.badge && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#0A0A0C] font-['Syne',sans-serif] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? '260px' : '72px',
          x: isMobileMenuOpen ? 0 : (window.innerWidth < 1024 ? -260 : 0)
        }}
        className={`fixed lg:relative z-50 h-full flex flex-col bg-[#0F0F13] border-r border-zinc-800/80 shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out`}
      >
        {/* Brand / Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex shrink-0 items-center justify-center text-sm">
              V
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-white tracking-wide uppercase text-sm whitespace-nowrap">
                Vanta Admin
              </span>
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-zinc-800">
          {SIDEBAR_SECTIONS.map((section, idx) => (
            <div key={idx} className="mb-6 px-3">
              {isSidebarOpen && (
                <div className="px-3 mb-2 text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          ))}
        </div>

        {/* User Info / Logout */}
        <div className="p-4 border-t border-zinc-800/80">
          <button
            onClick={() => {
              logoutAdmin();
              setActivePage('home');
            }}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-3' : 'justify-center'} py-2.5 rounded-lg text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors group`}
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 group-hover:text-rose-400" />
              {isSidebarOpen && <span className="text-sm font-medium">Log out</span>}
            </div>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-zinc-800/80 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-zinc-800 text-zinc-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-white capitalize tracking-wide hidden sm:block">
              {activeView.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Catalog
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-tight">
                  {adminUser?.username || 'Staff'}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  {adminUser?.role === 'superadmin' ? 'Super Admin' : 'Operator'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white shadow-inner uppercase">
                {(adminUser?.username || 'A').charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
