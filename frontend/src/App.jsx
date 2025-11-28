import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TeacherSearch from './pages/TeacherSearch';
import TeacherDetail from './pages/TeacherDetail';
import Messages from './pages/Messages';
import BookSession from './pages/BookSession';
import Payment from './pages/Payment';
import Sessions from './pages/Sessions';
import Wallet from './pages/Wallet';
import AdminDashboard from './pages/AdminDashboard';
import api from './api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-secondary)]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup setUser={setUser} /> : <Navigate to="/" />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={user ? <Home user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teachers" 
          element={user ? <TeacherSearch user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teachers/:id" 
          element={user ? <TeacherDetail user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/book/:teacherId" 
          element={user ? <BookSession user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/messages" 
          element={user ? <Messages user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/sessions" 
          element={user ? <Sessions user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/payment" 
          element={user ? <Payment user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/payment/callback" 
          element={user ? <PaymentCallback user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/wallet" 
          element={user ? <Wallet user={user} /> : <Navigate to="/login" />} 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            user?.role === 'admin' 
              ? <AdminDashboard user={user} /> 
              : <Navigate to="/" />
          } 
        />

        {/* Catch all - redirect to home or login */}
        <Route 
          path="*" 
          element={<Navigate to={user ? "/" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

// Payment Callback Component
function PaymentCallback({ user }) {
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const responseCode = urlParams.get('pp_ResponseCode') || urlParams.get('responseCode');
    
    if (responseCode === '000' || responseCode === '00') {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">
      <div className="card-static text-center max-w-md">
        {status === 'processing' && (
          <>
            <div className="spinner mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Processing Payment...
            </h2>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-[var(--color-success)] mb-2">
              Payment Successful!
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Your session has been confirmed.
            </p>
            <a href="/sessions" className="btn-primary">
              View My Sessions
            </a>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-[var(--color-error)] mb-2">
              Payment Failed
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Something went wrong with your payment. Please try again.
            </p>
            <a href="/sessions" className="btn-primary">
              Back to Sessions
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
