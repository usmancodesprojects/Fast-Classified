import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Fast Classified</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Pakistan's Premier Tutoring Marketplace
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-text-primary)]">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[var(--color-error)] p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--color-primary)] font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">
            Why choose Fast Classified?
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-success)]">✓</span>
              Verified Teachers
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-success)]">✓</span>
              Secure Payments
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-success)]">✓</span>
              Real-time Chat
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-success)]">✓</span>
              Easy Booking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
