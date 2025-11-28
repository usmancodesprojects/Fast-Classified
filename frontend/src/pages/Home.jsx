import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

function Home({ user }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    description: '',
    preferred_format: 'online',
    urgency_level: 'medium',
    hourly_rate: 500,
    duration: '1 hour'
  });

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
    'Urdu', 'Computer Science', 'Economics', 'Accounting', 'Statistics'
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests', formData);
      setShowModal(false);
      fetchRequests();
      setFormData({
        subject: '',
        topic: '',
        description: '',
        preferred_format: 'online',
        urgency_level: 'medium',
        hourly_rate: 500,
        duration: '1 hour'
      });
    } catch (error) {
      console.error('Error creating request:', error);
      alert(error.response?.data?.detail || 'Failed to create request');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await api.delete(`/requests/${requestId}`);
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getUrgencyBadge = (level) => {
    const badges = {
      low: 'badge-success',
      medium: 'badge-warning',
      high: 'badge-error'
    };
    return badges[level] || 'badge-info';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="card-static mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Welcome back, {user.profile?.name || 'there'}! 👋
              </h1>
              <p className="text-[var(--color-text-secondary)] mt-2">
                {user.role === 'student' 
                  ? 'Find the perfect tutor or post a help request'
                  : 'Browse student requests and grow your tutoring business'}
              </p>
            </div>
            <div className="flex gap-4">
              {user.role === 'student' ? (
                <>
                  <button
                    onClick={() => navigate('/teachers')}
                    className="btn-primary"
                  >
                    Find Teachers
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-secondary"
                  >
                    Post Request
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/sessions')}
                  className="btn-primary"
                >
                  View My Sessions
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats for Teachers */}
        {user.role === 'teacher' && user.profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card-static">
              <div className="text-3xl font-bold text-[var(--color-primary)]">
                {user.profile.total_sessions || 0}
              </div>
              <p className="text-[var(--color-text-secondary)]">Total Sessions</p>
            </div>
            <div className="card-static">
              <div className="text-3xl font-bold text-[var(--color-primary)]">
                ⭐ {user.profile.average_rating?.toFixed(1) || '0.0'}
              </div>
              <p className="text-[var(--color-text-secondary)]">Average Rating</p>
            </div>
            <div className="card-static">
              <div className="text-3xl font-bold text-[var(--color-primary)]">
                {user.profile.total_reviews || 0}
              </div>
              <p className="text-[var(--color-text-secondary)]">Reviews</p>
            </div>
            <div className="card-static">
              <div className="text-3xl font-bold text-[var(--color-primary)]">
                {formatCurrency(user.profile.hourly_rate || 0)}
              </div>
              <p className="text-[var(--color-text-secondary)]">Hourly Rate</p>
            </div>
          </div>
        )}

        {/* Requests Section */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {user.role === 'student' ? 'Recent Help Requests' : 'Available Student Requests'}
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              {user.role === 'teacher' && 'Find students who need your expertise'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="card-static text-center py-12">
            <span className="text-4xl mb-4 block">📋</span>
            <p className="text-xl text-[var(--color-text-secondary)] mb-4">
              No active requests at the moment
            </p>
            {user.role === 'student' && (
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                Create Your First Request
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <div key={request.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="badge badge-info">
                        {request.subject}
                      </span>
                      <span className={`badge ${getUrgencyBadge(request.urgency_level)}`}>
                        {request.urgency_level} priority
                      </span>
                      <span className="badge bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                        {request.preferred_format}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                      {request.topic}
                    </h3>
                    
                    {request.description && (
                      <p className="text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                        {request.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <span className="avatar-sm text-xs">
                          {request.student_name?.charAt(0) || '?'}
                        </span>
                        {request.student_name || 'Anonymous'}
                        {request.student_grade && ` • ${request.student_grade}`}
                      </span>
                      <span>📅 {formatDate(request.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <span className="price-tag">
                        {formatCurrency(request.hourly_rate || 500)}
                      </span>
                      <span className="text-[var(--color-text-secondary)]">/hr</span>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Duration: {request.duration || '1 hour'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {user.role === 'teacher' ? (
                        <>
                          <button
                            onClick={() => navigate('/messages')}
                            className="btn-primary text-sm"
                          >
                            Message Student
                          </button>
                        </>
                      ) : request.student_id === user.id && (
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="text-[var(--color-error)] hover:underline text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
              Create Help Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Integration, Thermodynamics, Grammar"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe what you need help with..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Preferred Format
                  </label>
                  <select
                    value={formData.preferred_format}
                    onChange={(e) => setFormData({...formData, preferred_format: e.target.value})}
                    className="input-field"
                  >
                    <option value="online">Online</option>
                    <option value="in-person">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Urgency Level
                  </label>
                  <select
                    value={formData.urgency_level}
                    onChange={(e) => setFormData({...formData, urgency_level: e.target.value})}
                    className="input-field"
                  >
                    <option value="low">Low - Flexible timing</option>
                    <option value="medium">Medium - Within a week</option>
                    <option value="high">High - Urgent help needed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Budget (PKR/hr)
                  </label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
                    className="input-field"
                    min="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Expected Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="input-field"
                  >
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3+ hours">3+ hours</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Post Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
