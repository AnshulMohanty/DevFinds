import { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Mail, Lock, User, ArrowRight, UserPlus, Loader2, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setPassword('');
    }
  }, [isOpen, isLogin]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose(); 
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication protocol failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center font-display px-4">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Note: The global NeuralMesh from App.jsx is visible through the backdrop blur! */}

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-[#050505]/80 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,249,6,0.07)] tech-border group">
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-8 relative mt-2">
              <div className="absolute top-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl -z-10 transition-colors duration-700"></div>
              
              <div className="size-12 bg-black border border-primary/30 flex items-center justify-center rounded-xl mb-4 text-primary shadow-[0_0_15px_rgba(6,249,6,0.2)] relative z-10">
                {isLogin ? <Terminal size={24} /> : <UserPlus size={24} />}
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {isLogin ? 'System Gateway' : 'Establish Node'}
              </h2>
              <p className="text-slate-400 text-sm mt-2 text-center">
                {isLogin ? 'Authenticate to access the intelligence grid.' : 'Join the network to encrypt your data.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Designation</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-700"
                      placeholder="Developer Name"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Data Link (Email)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-700"
                    placeholder="node@network.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Security Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-black font-bold py-3.5 rounded-lg hover:brightness-110 shadow-[0_0_15px_rgba(6,249,6,0.2)] hover:shadow-[0_0_30px_rgba(6,249,6,0.5)] transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:shadow-none"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (
                  <>{isLogin ? 'INITIALIZE SESSION' : 'CONNECT TO GRID'} <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              {isLogin ? 'Unregistered node? ' : 'Already active? '}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-green-400 hover:underline underline-offset-4 transition-colors"
              >
                {isLogin ? 'Request Access' : 'Authenticate here'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;