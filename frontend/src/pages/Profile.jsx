import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

function Profile({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    hourly_rate: 25,
    subjects_taught: [],
    experience_years: 0,
    grade_level: '',
    institution: '',
    preferred_formats: []
  });

  useEffect(() => {
    if (user.profile) {
      setFormData({
        name: user.profile.name || '',
        bio: user.profile.bio || '',
        hourly_rate: user.profile.hourly_rate || 25,
        subjects_taught: user.profile.subjects_taught || [],
        experience_years: user.profile.experience_years || 0,
        grade_level: user.profile.grade_level || '',
        institution: user.profile.institution || '',
        preferred_formats: user.profile.preferred_formats || []
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  let _response;
      if (user.has_profile) {
        // Update existing profile
        const endpoint = user.role === 'student' 
          ? `/profiles/student/${user.profile.id}`
          : `/profiles/teacher/${user.profile.id}`;
  _response = await api.patch(endpoint, formData);
      } else {
        // Create new profile
        const endpoint = user.role === 'student' 
          ? '/profiles/student'
          : '/profiles/teacher';
  _response = await api.post(endpoint, formData);
      }
      
      // Refresh user data
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      setEditing(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: array });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            {user.has_profile && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>

          {!user.has_profile || editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
                />
              </div>

              {user.role === 'teacher' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subjects Taught (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.subjects_taught.join(', ')}
                      onChange={(e) => handleArrayInput('subjects_taught', e.target.value)}
                      placeholder="Math, Physics, Chemistry"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              {user.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
                    <input
                      type="text"
                      value={formData.grade_level}
                      onChange={(e) => setFormData({...formData, grade_level: e.target.value})}
                      placeholder="e.g., 10th Grade, Freshman"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution</label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({...formData, institution: e.target.value})}
                      placeholder="Your school/university"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Formats (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.preferred_formats.join(', ')}
                  onChange={(e) => handleArrayInput('preferred_formats', e.target.value)}
                  placeholder="video, in-person, chat"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
                >
                  {user.has_profile ? 'Update Profile' : 'Create Profile'}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Name</h3>
                <p className="text-lg text-gray-800">{user.profile.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bio</h3>
                <p className="text-lg text-gray-800">{user.profile.bio || 'No bio provided'}</p>
              </div>

              {user.role === 'teacher' && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Hourly Rate</h3>
                    <p className="text-lg text-gray-800">${user.profile.hourly_rate}/hour</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Subjects Taught</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.subjects_taught?.map((subject, idx) => (
                        <span key={idx} className="bg-primary text-white px-3 py-1 rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Experience</h3>
                    <p className="text-lg text-gray-800">{user.profile.experience_years} years</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Average Rating</h3>
                    <p className="text-lg text-gray-800">⭐ {user.profile.average_rating.toFixed(1)}/5.0</p>
                  </div>
                </>
              )}

              {user.role === 'student' && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Grade Level</h3>
                    <p className="text-lg text-gray-800">{user.profile.grade_level || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Institution</h3>
                    <p className="text-lg text-gray-800">{user.profile.institution || 'Not specified'}</p>
                  </div>
                </>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Preferred Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {user.profile.preferred_formats?.map((format, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Account Info</h3>
                <p className="text-lg text-gray-800">Email: {user.email}</p>
                <p className="text-lg text-gray-800 capitalize">Role: {user.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
