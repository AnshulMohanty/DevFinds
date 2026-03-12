import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Bell, Settings, LogOut, Grid } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navbar on login/register pages for a cleaner entry
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="size-8 bg-primary/10 border border-primary/40 flex items-center justify-center rounded-lg group-hover:bg-primary transition-colors duration-300">
            <Terminal size={18} className="text-primary group-hover:text-background-dark transition-colors duration-300" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white">
            DEV<span className="text-primary">_FINDS</span>
          </h1>
        </Link>

        {/* Center Navigation (Only show if logged in) */}
        {user && (
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-slate-400'}`}
            >
              Neural Net
            </Link>
            <Link 
              to="/saved" 
              className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${location.pathname === '/saved' ? 'text-primary' : 'text-slate-400'}`}
            >
              Encrypted Vault
            </Link>
          </nav>
        )}

        {/* Right Section: Profile & Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button className="flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20">
                <Bell size={18} />
              </button>
              <button className="flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20">
                <Settings size={18} />
              </button>
              
              <div className="h-8 w-px bg-white/20 mx-2"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={16} /> Disconnect
              </button>
            </>
          ) : (
            <Link to="/login" className="px-5 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all">
              Initialize System
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;