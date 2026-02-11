import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        CollegeEvents
      </Link>

      <div className="space-x-4">
        {user ? (
          <div className="flex items-center gap-4">
            
            {/* 1. ADMIN BUTTON (Existing) */}
            {user.role === 'admin' && (
              <Link
                to="/create-event"
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
              >
                + Add Event
              </Link>
            )}

            {/* 2. ADD THIS "MY EVENTS" LINK HERE (New) */}
            <Link to="/my-events" className="hover:text-blue-200 transition font-medium">
              My Events
            </Link>

            {/* 3. Role Label (Existing) */}
            <span className="text-sm font-light opacity-80 border-l pl-4 border-blue-400">
              {user.role === 'admin' ? 'Admin' : 'Student'}
            </span>

            {/* 4. Logout Button (Existing) */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;