import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

function TeacherSearch({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    min_rate: '',
    max_rate: '',
    min_rating: '',
    formats: '',
    language: '',
    city: '',
    experience_level: '',
    sort_by: 'rating'
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

  const searchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.subject) params.subject = filters.subject;
      if (filters.min_rate) params.min_rate = filters.min_rate;
      if (filters.max_rate) params.max_rate = filters.max_rate;
      if (filters.min_rating) params.min_rating = filters.min_rating;
      if (filters.formats) params.formats = filters.formats;
      if (filters.language) params.language = filters.language;
      if (filters.city) params.city = filters.city;
      if (filters.experience_level) params.experience_level = filters.experience_level;
      if (filters.sort_by) params.sort_by = filters.sort_by;

      const response = await api.get('/teachers/search', { params });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error searching teachers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    searchTeachers();
  }, [searchTeachers]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      min_rate: '',
      max_rate: '',
      min_rating: '',
      formats: '',
      language: '',
      city: '',
      experience_level: '',
      sort_by: 'rating'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'rating').length;

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Find Teachers
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Browse qualified tutors and book sessions instantly
          </p>
        </div>

        {/* Search Bar */}
        <div className="card-static mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="input-field"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="input-field"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary ${showFilters ? 'bg-[var(--color-primary-light)]' : ''}`}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Price Range (PKR/hr)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.min_rate}
                      onChange={(e) => handleFilterChange('min_rate', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.max_rate}
                      onChange={(e) => handleFilterChange('max_rate', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.min_rating}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experience_level}
                    onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Experience</option>
                    <option value="beginner">Beginner Friendly (0-2 yrs)</option>
                    <option value="intermediate">Intermediate (3-5 yrs)</option>
                    <option value="expert">Expert (5+ yrs)</option>
                  </select>
                </div>

                {/* Teaching Format */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Teaching Format
                  </label>
                  <select
                    value={filters.formats}
                    onChange={(e) => handleFilterChange('formats', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Format</option>
                    <option value="online">Online</option>
                    <option value="in-person">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Language</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="input-field"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="reviews">Most Reviewed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-[var(--color-primary)] hover:underline text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-[var(--color-text-secondary)]">
          {loading ? 'Searching...' : `${teachers.length} teacher${teachers.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Teacher Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="card-static text-center py-12">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-xl text-[var(--color-text-secondary)] mb-4">
              No teachers found matching your criteria
            </p>
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="card group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="avatar-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
                      {teacher.name.charAt(0)}
                    </div>
                    {teacher.is_verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                        <span className="text-[var(--color-info)]">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] truncate">
                      {teacher.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{teacher.average_rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-[var(--color-text-secondary)]">
                        ({teacher.total_reviews || 0} reviews)
                      </span>
                    </div>
                    {teacher.city && (
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        📍 {teacher.city}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                  {teacher.bio || 'Experienced tutor ready to help you succeed.'}
                </p>

                {/* Subjects */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects_taught?.slice(0, 3).map((subject, idx) => (
                      <span
                        key={idx}
                        className="bg-[var(--color-primary-light)] text-[var(--color-primary)] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                    {teacher.subjects_taught?.length > 3 && (
                      <span className="text-[var(--color-text-secondary)] text-sm self-center">
                        +{teacher.subjects_taught.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-4 text-sm text-[var(--color-text-secondary)]">
                  {teacher.experience_years && (
                    <span>📚 {teacher.experience_years} yrs exp</span>
                  )}
                  {teacher.total_sessions > 0 && (
                    <span>👥 {teacher.total_sessions} sessions</span>
                  )}
                </div>

                {/* Formats */}
                {teacher.preferred_formats?.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {teacher.preferred_formats.map((format, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] px-2 py-1 rounded"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price & Action */}
                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                  <div>
                    <span className="price-tag">{formatCurrency(teacher.hourly_rate)}</span>
                    <span className="text-[var(--color-text-secondary)] text-sm">/hr</span>
                  </div>
                  <Link
                    to={`/teachers/${teacher.id}`}
                    className="btn-primary text-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherSearch;
