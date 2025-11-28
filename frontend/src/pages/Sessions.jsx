import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

function Sessions({ user }) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/sessions');
      setSessions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId, status) => {
    try {
      await api.patch(`/sessions/${sessionId}`, { status });
      fetchSessions();
    } catch (error) {
      console.error('Error updating session:', error);
      alert(error.response?.data?.detail || 'Failed to update session');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      in_progress: 'badge-info',
      completed: 'badge-success',
      cancelled: 'badge-error'
    };
    return badges[status] || 'badge-info';
  };

  const getPaymentBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      completed: 'badge-success',
      failed: 'badge-error',
      refunded: 'badge-info'
    };
    return badges[status] || 'badge-info';
  };

  const filterSessions = (tab) => {
    const now = new Date();
    switch (tab) {
      case 'upcoming':
        return sessions.filter(s => 
          new Date(s.scheduled_date) >= now && 
          ['pending', 'confirmed'].includes(s.status)
        );
      case 'past':
        return sessions.filter(s => 
          new Date(s.scheduled_date) < now || s.status === 'completed'
        );
      case 'cancelled':
        return sessions.filter(s => s.status === 'cancelled');
      default:
        return sessions;
    }
  };

  const filteredSessions = filterSessions(activeTab);

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            My Sessions
          </h1>
          {user.role === 'student' && (
            <button
              onClick={() => navigate('/teachers')}
              className="btn-primary"
            >
              Book New Session
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[var(--color-border)]">
          {['upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab} ({filterSessions(tab).length})
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="card-static text-center py-12">
            <span className="text-4xl mb-4 block">📅</span>
            <p className="text-[var(--color-text-secondary)] mb-4">
              No {activeTab} sessions
            </p>
            {activeTab === 'upcoming' && user.role === 'student' && (
              <button
                onClick={() => navigate('/teachers')}
                className="btn-primary"
              >
                Find a Teacher
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div key={session.id} className="card-static">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="avatar-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
                      {user.role === 'student' 
                        ? session.teacher_name?.charAt(0) || 'T'
                        : session.student_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">
                        {session.subject}
                        {session.topic && ` - ${session.topic}`}
                      </h3>
                      <p className="text-[var(--color-text-secondary)]">
                        with {user.role === 'student' ? session.teacher_name : session.student_name}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--color-text-secondary)]">
                        <span>📅 {formatDate(session.scheduled_date)}</span>
                        <span>🕐 {session.scheduled_time}</span>
                        <span>⏱️ {session.duration} hour(s)</span>
                      </div>
                      {session.is_recurring && (
                        <span className="badge badge-info text-xs mt-2">
                          🔄 Recurring ({session.recurring_frequency})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="price-tag">{formatCurrency(session.total_amount)}</span>
                    <div className="flex gap-2">
                      <span className={`badge ${getStatusBadge(session.status)} capitalize`}>
                        {session.status.replace('_', ' ')}
                      </span>
                      <span className={`badge ${getPaymentBadge(session.payment_status)}`}>
                        Payment: {session.payment_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--color-border)]">
                  {session.status === 'pending' && session.payment_status === 'pending' && user.role === 'student' && (
                    <button
                      onClick={() => navigate('/payment', { 
                        state: { 
                          session,
                          teacher: { name: session.teacher_name }
                        }
                      })}
                      className="btn-primary text-sm"
                    >
                      Pay Now
                    </button>
                  )}

                  {session.status === 'pending' && user.role === 'teacher' && (
                    <>
                      <button
                        onClick={() => updateSessionStatus(session.id, 'confirmed')}
                        className="btn-primary text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateSessionStatus(session.id, 'cancelled')}
                        className="btn-danger text-sm"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {session.status === 'confirmed' && (
                    <>
                      {session.meeting_link && (
                        <a
                          href={session.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm"
                        >
                          Join Meeting
                        </a>
                      )}
                      {user.role === 'teacher' && !session.meeting_link && (
                        <button
                          onClick={() => {
                            const link = prompt('Enter meeting link:');
                            if (link) {
                              api.patch(`/sessions/${session.id}`, { meeting_link: link })
                                .then(fetchSessions);
                            }
                          }}
                          className="btn-secondary text-sm"
                        >
                          Add Meeting Link
                        </button>
                      )}
                      <button
                        onClick={() => updateSessionStatus(session.id, 'completed')}
                        className="btn-secondary text-sm"
                      >
                        Mark Complete
                      </button>
                    </>
                  )}

                  {session.status === 'completed' && user.role === 'student' && !session.review && (
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="btn-secondary text-sm"
                    >
                      Leave Review
                    </button>
                  )}

                  {['pending', 'confirmed'].includes(session.status) && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this session?')) {
                          updateSessionStatus(session.id, 'cancelled');
                        }
                      }}
                      className="text-[var(--color-error)] hover:underline text-sm"
                    >
                      Cancel Session
                    </button>
                  )}

                  <button
                    onClick={() => navigate('/messages')}
                    className="text-[var(--color-primary)] hover:underline text-sm"
                  >
                    Message
                  </button>
                </div>

                {/* Notes */}
                {session.notes && (
                  <div className="mt-4 p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      <strong>Notes:</strong> {session.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedSession && (
        <ReviewModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSubmit={async (reviewData) => {
            try {
              await api.post('/reviews', {
                session_id: selectedSession.id,
                ...reviewData
              });
              setSelectedSession(null);
              fetchSessions();
              alert('Review submitted successfully!');
            } catch (error) {
              alert(error.response?.data?.detail || 'Failed to submit review');
            }
          }}
        />
      )}
    </div>
  );
}

// Review Modal Component
function ReviewModal({ session, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setSubmitting(true);
    await onSubmit({ rating, review_text: reviewText });
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
          Review Your Session
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          {session.subject} with {session.teacher_name}
        </p>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="text-3xl transition-transform hover:scale-110"
              >
                <span className={
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }>
                  ★
                </span>
              </button>
            ))}
            <span className="ml-2 text-lg font-semibold self-center">
              {rating > 0 ? `${rating}/5` : ''}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Your Review (Optional)
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            className="input-field h-32"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="btn-primary flex-1"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sessions;

