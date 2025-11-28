import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReviewSystem from '../components/ReviewSystem';
import api from '../api';

function TeacherDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeacher = useCallback(async () => {
    try {
      const response = await api.get(`/teachers/${id}`);
      setTeacher(response.data);
      setLoading(false);
    } catch {
      console.error('Error fetching teacher');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleStartConversation = async () => {
    try {
      // Create a conversation by sending an initial message
      await api.post('/messages', {
        receiver_id: teacher.user_id,
        content: `Hi! I'm interested in your tutoring services for ${teacher.subjects_taught?.[0] || 'tutoring'}.`
      });
      navigate('/messages');
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
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

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)]">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="card-static text-center">
            <p className="text-xl text-[var(--color-text-secondary)]">Teacher not found</p>
            <button
              onClick={() => navigate('/teachers')}
              className="btn-primary mt-4"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Main Profile Card */}
          <div className="card-static mb-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8 pb-8 border-b border-[var(--color-border)]">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center text-white text-5xl font-bold">
                  {teacher.name.charAt(0)}
                </div>
                {teacher.is_verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <span className="text-[var(--color-info)] text-xl">✓</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                    {teacher.name}
                  </h1>
                  {teacher.is_verified && (
                    <span className="verified-badge">
                      ✓ Verified Teacher
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="text-xl font-bold">{teacher.average_rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-[var(--color-text-secondary)]">
                      ({teacher.total_reviews || 0} reviews)
                    </span>
                  </div>
                  <span className="price-tag text-2xl">
                    {formatCurrency(teacher.hourly_rate)}/hr
                  </span>
                </div>
                <p className="text-[var(--color-text-secondary)] text-lg">
                  {teacher.bio || 'Experienced tutor ready to help you succeed.'}
                </p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mt-4 text-sm">
                  {teacher.experience_years && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📚</span>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {teacher.experience_years} years
                        </p>
                        <p className="text-[var(--color-text-secondary)]">Experience</p>
                      </div>
                    </div>
                  )}
                  {teacher.total_sessions > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👥</span>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {teacher.total_sessions}
                        </p>
                        <p className="text-[var(--color-text-secondary)]">Sessions</p>
                      </div>
                    </div>
                  )}
                  {teacher.city && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {teacher.city}
                        </p>
                        <p className="text-[var(--color-text-secondary)]">Location</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Subjects */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-3">
                  Subjects Taught
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects_taught?.map((subject, idx) => (
                    <span
                      key={idx}
                      className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Teaching Formats */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-3">
                  Teaching Formats
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.preferred_formats?.map((format, idx) => (
                    <span
                      key={idx}
                      className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-4 py-2 rounded-full text-sm"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              {teacher.languages?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-3">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-4 py-2 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {teacher.certifications && Object.keys(teacher.certifications).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-3">
                    Certifications
                  </h3>
                  <div className="bg-[var(--color-bg-secondary)] p-4 rounded-xl">
                    {Object.entries(teacher.certifications).map(([key, value]) => (
                      <p key={key} className="text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                        <span className="text-[var(--color-success)]">✓</span>
                        {value}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {user.role === 'student' && (
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-[var(--color-border)]">
                <button
                  onClick={() => navigate(`/book/${teacher.id}`)}
                  className="btn-primary flex-1 text-lg py-4"
                >
                  Book a Session
                </button>
                <button
                  onClick={handleStartConversation}
                  className="btn-secondary flex-1 text-lg py-4"
                >
                  Send Message
                </button>
              </div>
            )}
          </div>

          {/* Availability Section */}
          {teacher.availability && Object.keys(teacher.availability).length > 0 && (
            <div className="card-static mb-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                Availability
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="text-center">
                    <p className="font-semibold text-[var(--color-text-primary)] capitalize mb-2">
                      {day.slice(0, 3)}
                    </p>
                    {teacher.availability[day]?.length > 0 ? (
                      <div className="space-y-1">
                        {teacher.availability[day].slice(0, 3).map((time, idx) => (
                          <span
                            key={idx}
                            className="block text-xs bg-[var(--color-primary-light)] text-[var(--color-primary)] px-2 py-1 rounded"
                          >
                            {time}
                          </span>
                        ))}
                        {teacher.availability[day].length > 3 && (
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            +{teacher.availability[day].length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--color-text-secondary)]">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <ReviewSystem
            teacherId={teacher.id}
            userId={user.id}
            canReview={user.role === 'student'}
          />
        </div>
      </div>
    </div>
  );
}

export default TeacherDetail;
