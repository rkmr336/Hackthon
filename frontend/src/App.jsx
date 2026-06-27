import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TicketDetail from './components/TicketDetail';
import api from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Load user from localStorage (mock API)
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setLoading(false);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setLoading(false);
        }
      } else {
        // Fallback: try API
        api.get('/user')
          .then(res => {
            setUser(res.data);
            setLoading(false);
          })
          .catch(() => {
            localStorage.removeItem('token');
            setToken(null);
            setLoading(false);
          });
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
            <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/tickets/:id" element={<TicketDetail user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
