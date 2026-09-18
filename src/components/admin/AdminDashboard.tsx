import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { DashboardOverview } from './DashboardOverview';
import { AdminProducts } from './AdminProducts';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminTeam } from './AdminTeam';
import { AdminCategories } from './AdminCategories';
import { AdminBrands } from './AdminBrands';
import { AdminCollections } from './AdminCollections';
import { AdminPromotions } from './AdminPromotions';
import { AdminCoupons } from './AdminCoupons';
import { AdminCMS } from './AdminCMS';
import { AdminNotifications } from './AdminNotifications';
import { AdminReviews } from './AdminReviews';
import { AdminShipping } from './AdminShipping';
import { AdminPayments } from './AdminPayments';
import { AdminReturns } from './AdminReturns';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSettings } from './AdminSettings';
import { AdminAudit } from './AdminAudit';

export const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'products':
        return <AdminProducts />;
      case 'inventory':
        return <AdminInventory />;
      case 'categories':
        return <AdminCategories />;
      case 'brands':
        return <AdminBrands />;
      case 'collections':
        return <AdminCollections />;
      case 'promotions':
        return <AdminPromotions />;
      case 'coupons':
        return <AdminCoupons />;
      case 'cms':
        return <AdminCMS />;
      case 'notifications':
        return <AdminNotifications />;
      case 'reviews':
        return <AdminReviews />;
      case 'shipping':
        return <AdminShipping />;
      case 'payments':
        return <AdminPayments />;
      case 'returns':
        return <AdminReturns />;
      case 'orders':
        return <AdminOrders />;
      case 'customers':
        return <AdminCustomers />;
      case 'team':
        return <AdminTeam />;
      case 'audit':
        return <AdminAudit />;
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-zinc-500 font-bold">WIP</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Module Under Construction</h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              The <strong className="text-zinc-300 capitalize">{activeView.replace('-', ' ')}</strong> module is currently being built and will be available in the next operations release.
            </p>
          </div>
        );
    }
  };

  return (
    <AdminLayout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </AdminLayout>
  );
};
