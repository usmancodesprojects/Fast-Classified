import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user }) {
  const _navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Fast Classified</Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            {user?.role === 'student' && (
              <Link to="/teachers" className="hover:text-gray-200">Find Teachers</Link>
            )}
            <Link to="/profile" className="hover:text-gray-200">Account</Link>
            <div className="flex items-center gap-3">
              <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                Hello, {user?.profile?.name || 'Mr. User'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
