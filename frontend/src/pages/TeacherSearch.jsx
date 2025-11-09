import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

function TeacherSearch() {
  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    min_rate: '',
    max_rate: '',
    min_rating: ''
  });

  const searchTeachers = useCallback(async () => {
    try {
      const params = {};
      if (filters.subject) params.subject = filters.subject;
      if (filters.min_rate) params.min_rate = filters.min_rate;
      if (filters.max_rate) params.max_rate = filters.max_rate;
      if (filters.min_rating) params.min_rating = filters.min_rating;

      const response = await api.get('/teachers/search', { params });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error searching teachers:', error);
    }
  }, [filters]);

  useEffect(() => {
    searchTeachers();
  }, [searchTeachers]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchTeachers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ role: 'student' }} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Find Teachers</h1>

        {/* Search Filters */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Subject (e.g., Math)"
              value={filters.subject}
              onChange={(e) => setFilters({...filters, subject: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Min Rate ($)"
              value={filters.min_rate}
              onChange={(e) => setFilters({...filters, min_rate: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Max Rate ($)"
              value={filters.max_rate}
              onChange={(e) => setFilters({...filters, max_rate: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>

        {/* Teacher Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {teacher.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">⭐ {teacher.average_rating.toFixed(1)}/5.0</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{teacher.bio || 'No bio available'}</p>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects_taught?.slice(0, 3).map((subject, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-bold text-primary">${teacher.hourly_rate}/hr</span>
                <Link
                  to={`/teachers/${teacher.id}`}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {teachers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600">No teachers found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherSearch;
