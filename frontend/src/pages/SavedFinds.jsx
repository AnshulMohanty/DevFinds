import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Swapped DatabaseAlert to Database below
import { 
  FolderOpen, RefreshCw, Plus, Grid, LayoutList, 
  Trash2, FileText, Image as ImageIcon, Link2, 
  Activity, Loader2, Database 
} from 'lucide-react';
import api from '../services/api';

const SavedFinds = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookmarks on page load
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await api.get('/bookmarks');
        if (response.data.success) {
          setBookmarks(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // Remove a bookmark instantly
  const handleRemove = async (title, url, source, idToRemove) => {
    try {
      setBookmarks(current => current.filter(b => b._id !== idToRemove));
      await api.post('/bookmarks', { title, url, source });
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-display relative overflow-x-hidden pb-20 pt-8">
      
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.03] z-0">
        <div className="relative w-[800px] h-[800px]">
          <div className="orbital-path w-full h-full animate-[spin_30s_linear_infinite]"></div>
          <div className="orbital-path w-[60%] h-[60%] top-[20%] left-[20%] animate-[spin_20s_linear_infinite_reverse]"></div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <FolderOpen size={16} />
              <span className="text-xs uppercase tracking-widest font-bold">Encrypted Archive</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white">
              Neural Vault
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Retrieved <span className="text-primary font-bold">{bookmarks.length}</span> intelligence fragments from the datastream.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-background-dark font-bold rounded-lg hover:brightness-110 transition-all shadow-[0_0_15px_rgba(6,249,6,0.3)]"
            >
              <RefreshCw size={18} />
              <span>Sync Nodes</span>
            </button>
            <button className="flex items-center justify-center size-11 bg-primary/10 text-primary font-bold rounded-lg border border-primary/20 hover:bg-primary/20 transition-all">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Categories</p>
              <nav className="space-y-1">
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 text-white font-bold group border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Grid size={16} className="text-primary" />
                    <span className="text-sm">All Fragments</span>
                  </div>
                  <span className="text-xs text-primary font-mono">{bookmarks.length}</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-primary/60 group-hover:text-primary transition-colors" />
                    <span className="text-sm">Source Code</span>
                  </div>
                  <span className="text-xs opacity-50 font-mono">--</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <Link2 size={16} className="text-primary/60 group-hover:text-primary transition-colors" />
                    <span className="text-sm">Hyper-nodes</span>
                  </div>
                  <span className="text-xs opacity-50 font-mono">--</span>
                </a>
              </nav>
            </div>

            {/* System Status */}
            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 backdrop-blur-sm hidden md:block">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">System Status</p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Archive Load</span>
                    <span className="text-primary">{(bookmarks.length / 500 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary shadow-[0_0_10px_#06f906]" 
                      style={{ width: `${Math.max(5, (bookmarks.length / 500 * 100))}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-primary/80 font-mono">
                  <span className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_5px_#06f906]"></span>
                  <span>Core active: Node-X9</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid Area */}
          <div className="flex-1 space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-bold border border-white/20 hover:bg-white/20 transition-all">
                  <span>Date Added</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white rounded-full text-xs font-bold transition-all">
                  <span>Priority</span>
                </button>
              </div>
              <div className="flex bg-primary/10 rounded-lg p-1 border border-primary/20">
                <button className="p-1.5 bg-primary text-background-dark rounded-md">
                  <Grid size={16} />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-white transition-all">
                  <LayoutList size={16} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-20 opacity-50">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-xs uppercase tracking-widest font-mono text-primary animate-pulse">Decrypting Archive...</p>
              </div>
            ) : (
              <AnimatePresence>
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark, idx) => (
                      <motion.article
                        key={bookmark._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ delay: idx * 0.05 }}
                        className="tech-border bg-white/[0.02] rounded-lg overflow-hidden flex flex-col group hover:border-primary/50 transition-all cursor-pointer backdrop-blur-md h-full"
                        onClick={() => window.open(bookmark.url, '_blank')}
                      >
                        {/* Top Tech Banner Placeholder */}
                        <div className="h-32 w-full overflow-hidden relative flex items-center justify-center bg-black/60 border-b border-white/5">
                          <Link2 size={48} className="text-primary/10 absolute rotate-45 group-hover:scale-125 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-primary/5 mix-blend-color group-hover:bg-primary/10 transition-colors"></div>
                          
                          <div className="relative z-10 text-center px-4 w-full">
                            <p className="text-[10px] text-white/30 font-mono truncate">{bookmark.url}</p>
                          </div>
                          
                          <div className="absolute top-2 right-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRemove(bookmark.title, bookmark.url, bookmark.source, bookmark._id); }}
                              className="size-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-primary/60 border border-primary/20 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all"
                              title="Delete Node"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/10 backdrop-blur-md text-[9px] font-bold text-primary border border-primary/30 uppercase tracking-widest rounded">
                            {bookmark.source}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-sm md:text-base font-bold leading-snug text-slate-100 group-hover:text-primary transition-colors mb-4 line-clamp-3">
                            {bookmark.title}
                          </h3>
                          
                          <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/5">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(bookmark.createdAt).toISOString().replace('T', '_').substring(0, 19)}
                            </span>
                            <div className="flex gap-1 items-center">
                              <Activity size={12} className="text-primary/60" />
                              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">SECURE_LINK</span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}

                    {/* Drag and Drop Upload Box (Visual Only) */}
                    <div className="tech-border bg-primary/[0.02] rounded-lg flex flex-col items-center justify-center p-8 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/[0.05] transition-all min-h-[250px] group cursor-pointer">
                      {/* FIX: Changed DatabaseAlert to Database below */}
                      <Database size={40} className="text-primary/20 group-hover:text-primary/60 transition-colors mb-4" />
                      <p className="text-slate-400 text-sm font-bold tracking-wide">Drop fragment to archive</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-2 uppercase">Supported formats: .URL, .JSON</p>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
                  >
                    <FolderOpen size={48} className="mx-auto text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Vault is empty</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">Your encrypted archive currently contains 0 nodes. Initialize a search query to extract and save fragments.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 w-full border-t border-white/10 px-6 py-2 bg-black/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-slate-500">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="text-white/30 hidden md:inline">Protocol v2.0.4</span>
            <span className="hidden md:inline size-1 rounded-full bg-primary/20"></span>
            <span className="flex items-center gap-2 text-primary">
              <span className="size-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_5px_#06f906]"></span> 
              Encrypted Session
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SavedFinds;