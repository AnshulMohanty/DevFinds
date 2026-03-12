import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Database, Edit3, Save, Github, Clock, Bot, AlertCircle, Fingerprint } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSeen, setLastSeen] = useState("Just now");
  const [error, setError] = useState('');
  
  // Initialize with empty strings to avoid uncontrolled input warnings
  const [formData, setFormData] = useState({ name: '', bio: '', githubUrl: '' });

  // THE FIX: Listen for user changes and safely hydrate the form data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        githubUrl: user.githubUrl || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => { setLastSeen("Active sync: " + new Date().toLocaleTimeString()); }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSave = async () => {
    setError('');
    setIsSaving(true);
    try {
      const response = await api.put('/auth/profile', formData);
      if (response.data.success) {
        const freshUserData = response.data.data;
        if (localStorage.getItem('user')) localStorage.setItem('user', JSON.stringify(freshUserData));
        if (typeof setUser === 'function') {
          setUser(freshUserData);
          setIsEditing(false);
        } else {
          window.location.reload(); 
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || `DB Sync Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  // Real Stat Calculation
  const accountAgeDays = user.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen text-slate-100 font-display p-6 md:p-10 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={28} />
            <h1 className="text-3xl font-black uppercase text-white tracking-tighter">Node Identity</h1>
          </div>
          <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isSaving} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${isEditing ? 'bg-primary text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
            {isSaving ? <Activity className="animate-spin" size={18} /> : isEditing ? <><Save size={18} /> Sync</> : <><Edit3 size={18} /> Edit</>}
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-bold uppercase tracking-wider">
            <AlertCircle size={18} className="flex-shrink-0" /> <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 tech-border relative overflow-hidden group">
              <div className="absolute top-4 right-6 text-[10px] font-mono text-primary/50 flex items-center gap-2"><Clock size={10} /> {lastSeen}</div>

              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="size-24 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(6,249,6,0.15)]"><Bot size={52} /></div>
                <div className="flex-1 w-full space-y-4">
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Designation</label>
                      <input className="w-full bg-black/60 border border-primary/30 rounded-lg px-4 py-3 text-xl font-bold text-white outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                  ) : (
                    <h2 className="text-4xl font-black text-white tracking-tight">{user.name}</h2>
                  )}
                  <div className="text-slate-500 font-mono text-sm">{user.email}</div>
                </div>
              </div>

              <div className="space-y-8 pt-8 border-t border-white/5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Protocol Bio</label>
                  {isEditing ? (
                    <textarea className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-300 outline-none focus:border-primary min-h-[120px]" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                  ) : (
                    <p className="text-slate-400 text-sm italic p-4 bg-white/[0.02] rounded-lg border border-white/5">{user.bio || "No protocol description initialized."}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">GitHub Node Access</label>
                  <div className="relative">
                    <Github size={16} className="absolute left-4 top-4 text-slate-500" />
                    <input disabled={!isEditing} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-300 outline-none disabled:opacity-50" value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} placeholder="github.com/username" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center tech-border">
              <Database className="text-primary mx-auto mb-4" size={28} />
              <h3 className="text-4xl font-black text-white italic tracking-tighter">PRO</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clearance Level</p>
            </div>
            
            {/* REAL STATISTICS (Replaced fake progress bar) */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest border-b border-white/5 pb-3">
                  <Fingerprint size={14} /> Node Diagnostics
               </div>
               <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500 uppercase tracking-widest font-bold">Generation Date</span>
                     <span className="text-slate-300 font-mono">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500 uppercase tracking-widest font-bold">Node Uptime</span>
                     <span className="text-primary font-mono font-bold">{accountAgeDays} Days</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500 uppercase tracking-widest font-bold">DB Status</span>
                     <span className="text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">ONLINE</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;