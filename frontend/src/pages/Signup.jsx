import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/signup', { email, password, role });
      localStorage.setItem('token', response.data.access_token);
      
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Fast Classified</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Join Pakistan's Premier Tutoring Marketplace
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-text-primary)]">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[var(--color-error)] p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
              I want to join as
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === 'student'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                <div className="text-3xl mb-2">📚</div>
                <p className="font-semibold text-[var(--color-text-primary)]">Student</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Find tutors & learn</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === 'teacher'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                <div className="text-3xl mb-2">👨‍🏫</div>
                <p className="font-semibold text-[var(--color-text-primary)]">Teacher</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Teach & earn</p>
              </button>
            </div>
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating account...
              </span>
            ) : (
              `Create ${role === 'student' ? 'Student' : 'Teacher'} Account`
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits based on role */}
        <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">
            {role === 'student' ? 'As a student, you can:' : 'As a teacher, you can:'}
          </p>
          <div className="space-y-2 text-sm">
            {role === 'student' ? (
              <>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span>
                  Find verified tutors across Pakistan
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span>
                  Book sessions with flexible scheduling
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span>
                  Pay securely with JazzCash/Easypaisa
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span>
                  Chat directly with teachers
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span>
                  Set your own hourly rates
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span>
                  Manage your schedule flexibly
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span>
                  Get paid directly to your wallet
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)]">✓</span>
                  Build your reputation with reviews
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
