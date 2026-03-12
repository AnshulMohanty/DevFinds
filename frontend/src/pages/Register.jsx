import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import NeuralMesh from '../components/NeuralMesh';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Node registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative font-display px-4 overflow-hidden">
      {/* Dynamic Background */}
      <NeuralMesh />

      {/* Entrance Animation Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Continuous Floating Animation Wrapper */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="bg-black/40 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,249,6,0.07)] hover:shadow-[0_0_80px_rgba(6,249,6,0.12)] tech-border group transition-shadow duration-700"
        >
          
          <div className="flex flex-col items-center mb-8 relative">
            <div className="absolute top-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl -z-10 group-hover:bg-primary/40 transition-colors duration-700"></div>
            
            <div className="size-12 bg-black border border-primary/30 flex items-center justify-center rounded-xl mb-4 text-primary group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(6,249,6,0.4)] transition-all duration-500 relative z-10">
              <UserPlus size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Establish Node</h2>
            <p className="text-slate-400 text-sm mt-2 text-center">Join the network to index and encrypt data.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
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
                  required
                />
              </div>
            </div>

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
                  placeholder="developer@domain.com"
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
                <>CONNECT TO GRID</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already active?{' '}
            <Link to="/login" className="text-primary hover:text-green-400 hover:underline underline-offset-4 transition-colors">
              Authenticate here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;