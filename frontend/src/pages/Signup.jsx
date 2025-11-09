import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/auth/signup', { email, password, role });
      localStorage.setItem('token', response.data.access_token);
      
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
