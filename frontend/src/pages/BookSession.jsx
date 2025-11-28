import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from '../components/Navbar';
import api from '../api';

function BookSession({ user }) {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [recurring, setRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('weekly');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const durations = [
    { value: 0.5, label: '30 minutes' },
    { value: 1, label: '1 hour' },
    { value: 1.5, label: '1.5 hours' },
    { value: 2, label: '2 hours' },
    { value: 2.5, label: '2.5 hours' },
    { value: 3, label: '3 hours' }
  ];

  useEffect(() => {
    fetchTeacher();
  }, [teacherId]);

  const fetchTeacher = async () => {
    try {
      const response = await api.get(`/teachers/${teacherId}`);
      setTeacher(response.data);
      if (response.data.subjects_taught?.length > 0) {
        setSubject(response.data.subjects_taught[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teacher:', error);
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!teacher) return 0;
    return teacher.hourly_rate * duration;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleBookSession = async () => {
    if (!selectedTime || !subject) {
      alert('Please select a time slot and subject');
      return;
    }

    setSubmitting(true);

    try {
      const sessionData = {
        teacher_id: teacherId,
        subject,
        topic,
        scheduled_date: selectedDate.toISOString(),
        scheduled_time: selectedTime,
        duration,
        is_recurring: recurring,
        recurring_frequency: recurring ? recurringFrequency : null,
        notes
      };

      const response = await api.post('/sessions/book', sessionData);
      
      // Navigate to payment
      navigate('/payment', { 
        state: { 
          session: response.data,
          teacher 
        } 
      });
    } catch (error) {
      console.error('Error booking session:', error);
      alert(error.response?.data?.detail || 'Failed to book session');
    } finally {
      setSubmitting(false);
    }
  };

  const isDateDisabled = ({ date }) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
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
          {/* Header */}
          <div className="card-static mb-6">
            <div className="flex items-center gap-4">
              <div className="avatar-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
                {teacher.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  Book a Session with {teacher.name}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[var(--color-text-secondary)]">
                    ⭐ {teacher.average_rating?.toFixed(1) || '0.0'}/5.0
                  </span>
                  <span className="price-tag">
                    {formatCurrency(teacher.hourly_rate)}/hr
                  </span>
                  {teacher.is_verified && (
                    <span className="verified-badge">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Calendar & Time */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subject Selection */}
              <div className="card-static">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Select Subject
                </h2>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects_taught?.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSubject(sub)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        subject === sub
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)]'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="card-static">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Select Date
                </h2>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={isDateDisabled}
                  className="w-full border-none"
                />
              </div>

              {/* Time Slots */}
              <div className="card-static">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Select Time Slot
                </h2>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        selectedTime === time
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="card-static">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Session Duration
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        duration === d.value
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="card-static">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Session Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Topic (Optional)
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Integration, Thermodynamics"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Notes for Teacher (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific topics or questions you'd like to cover..."
                      className="input-field h-24"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)}
                      className="w-5 h-5 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
                    />
                    <label htmlFor="recurring" className="text-[var(--color-text-primary)]">
                      Make this a recurring session
                    </label>
                  </div>
                  {recurring && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        Frequency
                      </label>
                      <select
                        value={recurringFrequency}
                        onChange={(e) => setRecurringFrequency(e.target.value)}
                        className="input-field"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="card-static sticky top-6">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Booking Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Teacher</span>
                    <span className="font-medium">{teacher.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Subject</span>
                    <span className="font-medium">{subject || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Date</span>
                    <span className="font-medium">
                      {selectedDate.toLocaleDateString('en-PK', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Time</span>
                    <span className="font-medium">{selectedTime || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Duration</span>
                    <span className="font-medium">
                      {durations.find(d => d.value === duration)?.label}
                    </span>
                  </div>
                  {recurring && (
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Recurring</span>
                      <span className="font-medium capitalize">{recurringFrequency}</span>
                    </div>
                  )}
                  
                  <div className="divider"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Hourly Rate</span>
                    <span className="font-medium">{formatCurrency(teacher.hourly_rate)}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Duration</span>
                    <span className="font-medium">{duration} hour(s)</span>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="price-tag">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookSession}
                  disabled={!selectedTime || !subject || submitting}
                  className="btn-primary w-full mt-6"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>

                <p className="text-sm text-[var(--color-text-secondary)] text-center mt-4">
                  🔒 Your booking is secure. Payment will be processed after confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSession;

