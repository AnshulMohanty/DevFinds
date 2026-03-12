import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SavedFinds from './pages/SavedFinds'; 

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    // SDE Fix: Wrapped everything in a React Fragment <> ... </>
    <>
      <Navbar />
      
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/saved" element={user ? <SavedFinds /> : <Navigate to="/login" />} />
        
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;