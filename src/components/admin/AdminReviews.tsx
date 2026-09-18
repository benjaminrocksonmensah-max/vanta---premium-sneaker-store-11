import React, { useState, useEffect } from 'react';
import { Search, Star, Edit, Trash2, X, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { Review } from '../../types';
import { useStore } from '../../context/StoreContext';

export const AdminReviews: React.FC = () => {
  const { addToast } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadReviews = async () => {
    setIsLoading(true);
    const data = await reviewService.getAll();
    setReviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: string | undefined) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    const success = await reviewService.update(id, { status: newStatus as any });
    if (success) {
      addToast('Review Updated', `Review status changed to ${newStatus}.`, 'success');
      loadReviews();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this review permanently?')) {
      const success = await reviewService.delete(id);
      if (success) {
        addToast('Review Deleted', 'Review has been removed.', 'info');
        loadReviews();
      }
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Reviews</h1>
          <p className="text-sm text-zinc-400 mt-1">Moderate customer feedback and product reviews.</p>
        </div>
      </div>

      <div className="bg-[#111114] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search reviews..."
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
                <th className="px-6 py-4 font-medium">Review</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3 max-w-sm">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{review.title}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{review.content}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-800 text-zinc-700'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="text-white font-medium">{review.authorName}</p>
                      <p className="text-zinc-500 font-mono text-[10px]">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleStatusChange(review.id, (review as any).status)}
                      className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors ${(review as any).status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}
                    >
                      {(review as any).status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {(review as any).status || 'pending'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(review.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No reviews found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
