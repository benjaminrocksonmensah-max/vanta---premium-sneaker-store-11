import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { AppNotification } from '../../types';
import { useStore } from '../../context/StoreContext';

export const AdminNotifications: React.FC = () => {
  const { addToast } = useStore();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'drop' as AppNotification['type'],
    read: false
  });

  const loadNotifications = async () => {
    setIsLoading(true);
    const data = await notificationService.getAll();
    setNotifications(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleOpenForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'drop',
      read: false
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    const created = await notificationService.create(formData);
    if (created) {
      addToast('Notification Created', 'Notification sent to users.', 'success');
    }
    setIsFormOpen(false);
    loadNotifications();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this notification?')) {
      await notificationService.delete(id);
      addToast('Notification Deleted', 'Removed from system.', 'info');
      loadNotifications();
    }
  };

  const filtered = notifications.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Notifications</h1>
          <p className="text-sm text-zinc-400 mt-1">Broadcast drops, sales, and system messages.</p>
        </div>
        <button 
          onClick={handleOpenForm}
          className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast</span>
        </button>
      </div>

      <div className="bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search notifications..."
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
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : filtered.map((notif) => (
                <tr key={notif.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{notif.title}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 max-w-md truncate">{notif.message}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-400">
                      {notif.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400 font-mono">
                    {new Date(notif.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(notif.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No notifications found.</td>
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
                New Broadcast Notification
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none" placeholder="e.g. SNKRS Drop Tomorrow" />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Message</label>
                <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none resize-none" rows={3} />
              </div>
              
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Notification Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none">
                  <option value="drop">Drop</option>
                  <option value="sale">Sale</option>
                  <option value="system">System / Generic</option>
                  <option value="order">Order Update</option>
                </select>
              </div>

              <div className="pt-3">
                <button type="submit" className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>Send Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
