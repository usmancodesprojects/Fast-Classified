import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

function Home({ user }) {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    description: '',
    preferred_format: 'video',
    urgency_level: 'medium',
    hourly_rate: 25,
    duration: '2 hours'
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
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
        preferred_format: 'video',
        urgency_level: 'medium',
        hourly_rate: 25,
        duration: '2 hours'
      });
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user.role === 'student' ? 'Student Help Requests' : 'Available Student Requests'}
            </h1>
            <p className="text-gray-600 mt-2">Browse or post tutoring requests</p>
          </div>
          {user.role === 'student' && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Create Request
            </button>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600 italic">No active student requests at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Student Name: {request.student_name || 'Anonymous'}
                      </span>
                      {request.student_grade && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                          Grade: {request.student_grade}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Subject: {request.subject}
                    </h3>
                    <p className="text-gray-600 mb-3">{request.topic}</p>
                    <p className="text-gray-500 mb-4">{request.description}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span><strong>Hourly Rate:</strong> ${request.hourly_rate || 25}/hr</span>
                      <span><strong>Duration:</strong> {request.duration || '2 hours'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.role === 'teacher' && (
                      <>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                          View
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                          Message
                        </button>
                        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                          Report
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create Help Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subject (e.g., Calculus, Physics)"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="Topic (e.g., Integration problems)"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <textarea
                placeholder="Description (I'm struggling with...)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
              />
              <input
                type="number"
                placeholder="Hourly Rate ($)"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 2 hours)"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
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
