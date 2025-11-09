import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

function TeacherDetail() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={{ role: 'student' }} />
        <div className="flex items-center justify-center py-20">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={{ role: 'student' }} />
        <div className="flex items-center justify-center py-20">
          <p className="text-xl text-gray-600">Teacher not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ role: 'student' }} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {teacher.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{teacher.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xl text-gray-600">⭐ {teacher.average_rating.toFixed(1)}/5.0</span>
                <span className="text-2xl font-bold text-primary">${teacher.hourly_rate}/hour</span>
              </div>
              <p className="text-gray-600 text-lg">{teacher.bio}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Subjects Taught</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects_taught?.map((subject, idx) => (
                  <span key={idx} className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Experience</h3>
              <p className="text-lg text-gray-800">{teacher.experience_years} years of teaching experience</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Preferred Teaching Formats</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.preferred_formats?.map((format, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">
                    {format}
                  </span>
                ))}
              </div>
            </div>

            {teacher.certifications && Object.keys(teacher.certifications).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Certifications</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {Object.entries(teacher.certifications).map(([key, value]) => (
                    <p key={key} className="text-gray-700 mb-2">• {value}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-8 border-t">
            <button className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
              Book Session
            </button>
            <button className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetail;
