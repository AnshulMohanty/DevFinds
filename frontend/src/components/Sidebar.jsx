import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, BrainCircuit, FolderLock, LogOut, Zap, Menu, X, PanelLeftClose, PanelLeftOpen, History, Trash2, Bot } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Sidebar = ({ onOpenAuth, remainingCredits, isCollapsed, setIsCollapsed, onHistoryClick }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const response = await api.get('/search/history');
      if (response.data.success) setHistory(response.data.data);
    } catch (err) {}
  };

  useEffect(() => { fetchHistory(); }, [user, location.pathname]);

  const handleClearHistory = async () => {
    try { await api.delete('/search/history'); setHistory([]); } catch (err) {}
  };

  const deleteOne = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/search/history/${id}`);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {}
  };

  // The Fix: Emit an event to reset the Home page state
  const handleNeuralNetClick = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event('resetSearchEngine'));
  };

  return (
    <>
      <div className="md:hidden fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Terminal size={18} className="text-primary" />
          <h1 className="text-lg font-bold text-white">DEV_FINDS</h1>
        </a>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-[#050505]/80 backdrop-blur-xl border-r border-white/10 p-4 z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} pb-4 border-b border-white/5`}>
          {!isCollapsed && (
            <a href="/" className="flex items-center gap-3 px-2 group">
              <Terminal size={18} className="text-primary" />
              <h1 className="text-xl font-bold text-white">DEV<span className="text-primary">_FINDS</span></h1>
            </a>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 text-slate-500 hover:text-white transition-all">
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-6 custom-scrollbar">
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={handleNeuralNetClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:bg-white/5'} ${isCollapsed ? 'justify-center' : ''}`}>
              <BrainCircuit size={20} /> {!isCollapsed && <span className="text-sm font-bold">Neural Net</span>}
            </Link>
            <Link to="/saved" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/saved' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:bg-white/5'} ${isCollapsed ? 'justify-center' : ''}`}>
              <FolderLock size={20} /> {!isCollapsed && <span className="text-sm font-bold">Vault</span>}
            </Link>
          </div>

          {user && !isCollapsed && (
            <div className="px-2">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-slate-500"><History size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Recent Logs</span></div>
                <button onClick={handleClearHistory} className="text-slate-600 hover:text-red-500"><Trash2 size={12} /></button>
              </div>
              <div className="flex flex-col gap-1">
                {history.map((item) => (
                  <div key={item._id} className="group relative flex items-center">
                    <button onClick={() => onHistoryClick(item.query)} className="text-left w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/5 hover:text-primary transition-all truncate pr-8">{item.query}</button>
                    <button onClick={(e) => deleteOne(e, item._id)} className="absolute right-2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-all"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/5 mt-auto">
          {user ? (
            <div className="flex flex-col gap-2">
              <Link to="/profile" className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="size-10 flex-shrink-0 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(6,249,6,0.2)] group-hover:bg-primary group-hover:text-black transition-all">
                  <Bot size={20} />
                </div>
                {!isCollapsed && <div className="flex flex-col overflow-hidden"><span className="text-sm font-bold text-slate-200 truncate">{user.name}</span><span className="text-[10px] text-slate-500 font-mono truncate">{user.email}</span></div>}
              </Link>
              <button onClick={logout} className={`flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors ${isCollapsed ? 'px-0' : ''}`}><LogOut size={16} /> {!isCollapsed && "Terminate"}</button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="w-full py-3 bg-primary text-black text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(6,249,6,0.3)]">{isCollapsed ? <Terminal size={18} /> : "Initialize System"}</button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;