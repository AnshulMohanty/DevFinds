import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderLock, ExternalLink, Trash2, Database, Code2 } from 'lucide-react';
import api from '../services/api';

const SavedFinds = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // If your backend doesn't have this route yet, it will gracefully fallback to empty
        const response = await api.get('/bookmarks');
        if (response.data.success) {
          setBookmarks(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch vault data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const removeBookmark = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      setBookmarks(bookmarks.filter(b => b._id !== id));
    } catch (err) {
      console.error("Failed to delete fragment");
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-display p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3">
            <FolderLock size={16} /> Encrypted Archive
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Neural Vault</h1>
          <p className="text-slate-400 mt-4 text-lg">Retrieved <span className="text-primary font-bold">{bookmarks.length}</span> verified intelligence fragments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Real Dynamic Categories (No gimmicks) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 tech-border">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Database Metrics</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <div className="flex items-center gap-3"><Database size={16} /> <span className="text-sm font-bold">Total Vaulted</span></div>
                <span className="font-mono font-bold">{bookmarks.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
                <div className="flex items-center gap-3"><Code2 size={16} /> <span className="text-sm">Code Snippets</span></div>
                <span className="font-mono">Auto</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Masonry/Grid View */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex items-center gap-3 text-slate-500"><div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> Accessing secure sectors...</div>
          ) : bookmarks.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <Database size={48} className="text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">Vault is Empty</h3>
              <p className="text-slate-500 text-sm">Save nodes from the Neural Net to encrypt them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookmarks.map((item) => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={item._id} className="group bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">Secured Link</span>
                      <button onClick={() => removeBookmark(item._id)} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-mono truncate mb-6">{item.url}</p>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-primary text-slate-300 hover:text-black font-bold text-sm rounded-xl transition-all">
                    Access Fragment <ExternalLink size={16} />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedFinds;