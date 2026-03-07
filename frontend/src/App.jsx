import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Wait for the "Brain" to check local storage

  return (
    <Routes>
      {/* If logged in, show Home. If not, redirect to Login */}
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;