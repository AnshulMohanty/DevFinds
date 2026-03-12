import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import SavedFinds from './pages/SavedFinds'; 
import Profile from './pages/Profile';
import AuthModal from './components/AuthModal';
import NeuralMesh from './components/NeuralMesh';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(5);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Bridge for history clicks
  const [historyQuery, setHistoryQuery] = useState(null);

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-transparent">
      <div className="fixed inset-0 z-[-1] bg-[#050505]">
        <NeuralMesh />
      </div>

      <Sidebar 
        onOpenAuth={() => setIsAuthOpen(true)} 
        remainingCredits={remainingCredits}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onHistoryClick={(q) => setHistoryQuery(q)} // Update query on click
      />
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} w-full pt-14 md:pt-0`}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onOpenAuth={() => setIsAuthOpen(true)} 
                setRemainingCredits={setRemainingCredits}
                historyQuery={historyQuery}
                clearHistoryQuery={() => setHistoryQuery(null)}
              />
            } 
          />
          <Route path="/saved" element={user ? <SavedFinds /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;