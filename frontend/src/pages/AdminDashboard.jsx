import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, verificationsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/verifications?status=pending')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setVerifications(verificationsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async (role = '') => {
    try {
      const params = role ? `?role=${role}` : '';
      const response = await api.get(`/admin/users${params}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleVerificationReview = async (documentId, status, notes = '') => {
    try {
      await api.post(`/admin/verifications/${documentId}/review`, {
        status,
        admin_notes: notes
      });
      // Refresh verifications
      const response = await api.get('/admin/verifications?status=pending');
      setVerifications(response.data);
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error reviewing verification:', error);
      alert('Failed to update verification status');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)]">
        <Navbar user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[var(--color-border)]">
          {['overview', 'users', 'verifications', 'transactions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-static">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                      {stats.total_users}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Students: <strong>{stats.total_students}</strong>
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    Teachers: <strong>{stats.total_teachers}</strong>
                  </span>
                </div>
              </div>

              <div className="card-static">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-sm">Total Sessions</p>
                    <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                      {stats.total_sessions}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-[var(--color-text-secondary)]">
                  Active: <strong>{stats.active_sessions}</strong>
                </div>
              </div>

              <div className="card-static">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-[var(--color-primary)]">
                      {formatCurrency(stats.total_revenue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="card-static">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-sm">Pending Verifications</p>
                    <p className="text-3xl font-bold text-[var(--color-warning)]">
                      {stats.pending_verifications}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('verifications')}
                  className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
                >
                  Review now →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-static">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="btn-secondary"
                >
                  Manage Users
                </button>
                <button
                  onClick={() => setActiveTab('verifications')}
                  className="btn-secondary"
                >
                  Review Verifications
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="btn-secondary"
                >
                  View Transactions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="card-static">
              <div className="flex flex-wrap gap-4">
                <select
                  value={userFilter}
                  onChange={(e) => {
                    setUserFilter(e.target.value);
                    fetchUsers(e.target.value);
                  }}
                  className="input-field w-auto"
                >
                  <option value="">All Users</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="card-static overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">User</th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar-sm">
                            {u.profile_name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-[var(--color-text-primary)]">
                            {u.profile_name || 'No profile'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          u.role === 'teacher' ? 'badge-info' : 'badge-success'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          u.is_active ? 'badge-success' : 'badge-error'
                        }`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-[var(--color-primary)] hover:underline text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            {verifications.length === 0 ? (
              <div className="card-static text-center py-12">
                <span className="text-4xl mb-4 block">✅</span>
                <p className="text-[var(--color-text-secondary)]">
                  No pending verifications
                </p>
              </div>
            ) : (
              verifications.map((doc) => (
                <div key={doc.id} className="card-static">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)]">
                        Document Type: {doc.document_type}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        Submitted: {formatDate(doc.created_at)}
                      </p>
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:underline text-sm mt-2 inline-block"
                      >
                        View Document →
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerificationReview(doc.id, 'verified')}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt('Rejection reason:');
                          if (notes) {
                            handleVerificationReview(doc.id, 'rejected', notes);
                          }
                        }}
                        className="btn-danger px-4 py-2 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="card-static">
            <p className="text-center text-[var(--color-text-secondary)] py-8">
              Transaction history coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

