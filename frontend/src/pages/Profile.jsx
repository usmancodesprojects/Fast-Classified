import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

function Profile({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    hourly_rate: 500,
    subjects_taught: [],
    experience_years: 0,
    grade_level: '',
    institution: '',
    preferred_formats: [],
    phone_number: '',
    city: '',
    languages: []
  });

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
    'Urdu', 'Computer Science', 'Economics', 'Accounting', 'Statistics',
    'History', 'Geography', 'Islamic Studies', 'Pakistan Studies'
  ];

  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot'
  ];

  const formats = ['Online', 'In-Person', 'Hybrid'];
  const languageOptions = ['English', 'Urdu', 'Punjabi', 'Sindhi', 'Pashto'];

  useEffect(() => {
    if (user.profile) {
      setFormData({
        name: user.profile.name || '',
        bio: user.profile.bio || '',
        hourly_rate: user.profile.hourly_rate || 500,
        subjects_taught: user.profile.subjects_taught || [],
        experience_years: user.profile.experience_years || 0,
        grade_level: user.profile.grade_level || '',
        institution: user.profile.institution || '',
        preferred_formats: user.profile.preferred_formats || [],
        phone_number: user.profile.phone_number || '',
        city: user.profile.city || '',
        languages: user.profile.languages || []
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (user.has_profile) {
        const endpoint = user.role === 'student' 
          ? `/profiles/student/${user.profile.id}`
          : `/profiles/teacher/${user.profile.id}`;
        await api.patch(endpoint, formData);
      } else {
        const endpoint = user.role === 'student' 
          ? '/profiles/student'
          : '/profiles/teacher';
        await api.post(endpoint, formData);
      }
      
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error.response?.data?.detail || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayToggle = (field, value) => {
    const currentArray = formData[field] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setFormData({ ...formData, [field]: newArray });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="card-static mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="avatar-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
                  {user.profile?.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {user.profile?.name || 'Complete Your Profile'}
                  </h1>
                  <p className="text-[var(--color-text-secondary)]">{user.email}</p>
                  <span className="badge badge-info mt-1 capitalize">{user.role}</span>
                </div>
              </div>
              {user.has_profile && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Form / View */}
          <div className="card-static">
            {!user.has_profile || editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                  {user.has_profile ? 'Edit Profile' : 'Complete Your Profile'}
                </h2>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="input-field"
                      placeholder="03001234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="input-field h-24"
                    placeholder={user.role === 'teacher' 
                      ? "Tell students about your teaching experience and style..."
                      : "Tell teachers about yourself and your learning goals..."}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select your city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Teacher-specific fields */}
                {user.role === 'teacher' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          Hourly Rate (PKR) *
                        </label>
                        <input
                          type="number"
                          value={formData.hourly_rate}
                          onChange={(e) => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
                          className="input-field"
                          min="100"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={formData.experience_years}
                          onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value)})}
                          className="input-field"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        Subjects You Teach *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map(subject => (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => handleArrayToggle('subjects_taught', subject)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              formData.subjects_taught.includes(subject)
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)]'
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        Languages
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {languageOptions.map(lang => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleArrayToggle('languages', lang)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              formData.languages?.includes(lang)
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)]'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Student-specific fields */}
                {user.role === 'student' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          Grade Level
                        </label>
                        <select
                          value={formData.grade_level}
                          onChange={(e) => setFormData({...formData, grade_level: e.target.value})}
                          className="input-field"
                        >
                          <option value="">Select grade level</option>
                          <option value="9th Grade">9th Grade</option>
                          <option value="10th Grade">10th Grade (Matric)</option>
                          <option value="11th Grade">11th Grade (FSc/ICS)</option>
                          <option value="12th Grade">12th Grade (FSc/ICS)</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Professional">Professional</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={formData.institution}
                          onChange={(e) => setFormData({...formData, institution: e.target.value})}
                          className="input-field"
                          placeholder="Your school/college/university"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Preferred Formats */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Preferred Teaching/Learning Formats
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formats.map(format => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => handleArrayToggle('preferred_formats', format.toLowerCase())}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          formData.preferred_formats.includes(format.toLowerCase())
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)]'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </span>
                    ) : (
                      user.has_profile ? 'Update Profile' : 'Create Profile'
                    )}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              /* Profile View */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                      About
                    </h3>
                    <p className="text-[var(--color-text-primary)]">
                      {user.profile.bio || 'No bio provided'}
                    </p>
                  </div>

                  {user.profile.city && (
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                        Location
                      </h3>
                      <p className="text-[var(--color-text-primary)]">📍 {user.profile.city}</p>
                    </div>
                  )}
                </div>

                {user.role === 'teacher' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                          Hourly Rate
                        </h3>
                        <p className="price-tag">{formatCurrency(user.profile.hourly_rate)}/hr</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                          Experience
                        </h3>
                        <p className="text-[var(--color-text-primary)]">
                          {user.profile.experience_years || 0} years
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                          Rating
                        </h3>
                        <p className="text-[var(--color-text-primary)]">
                          ⭐ {user.profile.average_rating?.toFixed(1) || '0.0'}/5.0
                          <span className="text-sm text-[var(--color-text-secondary)] ml-1">
                            ({user.profile.total_reviews || 0} reviews)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                        Subjects
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.profile.subjects_taught?.map((subject, idx) => (
                          <span
                            key={idx}
                            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    {user.profile.languages?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.profile.languages.map((lang, idx) => (
                            <span
                              key={idx}
                              className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-3 py-1 rounded-full text-sm"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {user.role === 'student' && (
                  <>
                    {user.profile.grade_level && (
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                          Grade Level
                        </h3>
                        <p className="text-[var(--color-text-primary)]">{user.profile.grade_level}</p>
                      </div>
                    )}

                    {user.profile.institution && (
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                          Institution
                        </h3>
                        <p className="text-[var(--color-text-primary)]">{user.profile.institution}</p>
                      </div>
                    )}
                  </>
                )}

                {user.profile.preferred_formats?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                      Preferred Formats
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.preferred_formats.map((format, idx) => (
                        <span
                          key={idx}
                          className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-3 py-1 rounded-full text-sm capitalize"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">
                    Account Information
                  </h3>
                  <p className="text-[var(--color-text-primary)]">📧 {user.email}</p>
                  {user.profile.phone_number && (
                    <p className="text-[var(--color-text-primary)]">📱 {user.profile.phone_number}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
