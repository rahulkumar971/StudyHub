import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Collection from './pages/Collection';
import AdminDashboard from './pages/AdminDashboard';
import Feedback from './pages/Feedback';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

function App() {
  // Initialize state directly from localStorage so it's available on the first render
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  /*
    Standard Protected Route (Login required)
  */
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  /*
    Admin-only Route (Login + Admin role required)
  */
  const AdminRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (user.role !== 'Admin') {
      // If student tries to access admin page, send them home
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar user={user} setUser={setUser} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            
            {/* Login Required Routes */}
            <Route 
              path="/collection" 
              element={<ProtectedRoute><Collection /></ProtectedRoute>} 
            />
            <Route 
              path="/feedback" 
              element={<ProtectedRoute><Feedback /></ProtectedRoute>} 
            />
            
            {/* ADMIN ONLY Route */}
            <Route 
              path="/admin" 
              element={<AdminRoute><AdminDashboard /></AdminRoute>} 
            />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
          <div className="mb-3 space-x-6">
            <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
            <Link to="/feedback" className="hover:text-blue-600 font-medium">Feedback & Support</Link>
          </div>
          <p className="opacity-75">&copy; 2024 StudyHub Academic Notebook. Built for Students.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
