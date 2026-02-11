import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams(); // Get Event ID from URL
  const { user } = useContext(AuthContext); // Get logged-in user info
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  // 1. Fetch Event Data (including participants)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  // 2. Handle Delete (Admin Only)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: { "x-auth-token": user.token } // Send Admin Token
        });
        alert("Event Deleted Successfully");
        navigate("/"); // Redirect to Dashboard
      } catch (err) {
        console.error(err);
        alert("Error deleting event");
      }
    }
  };

  if (!event) return <div className="p-10 text-center text-gray-500">Loading Event Details...</div>;

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg max-w-4xl border border-gray-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <div className="mt-2 text-gray-600 flex flex-col gap-1">
            <p>📅 <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span></p>
            <p>📍 <span className="font-medium">{event.location}</span></p>
            <p>🪑 Seats: <span className="font-medium">{event.registeredUsers.length} / {event.totalSeats}</span></p>
          </div>
        </div>
        
        {/* ADMIN ACTIONS (Edit & Delete) */}
        {user && user.role === 'admin' && (
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link 
              to={`/edit-event/${event._id}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow transition font-semibold"
            >
              ✏️ Edit
            </Link>

            <button 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition font-semibold"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* DESCRIPTION SECTION */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Event Description</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded border">
          {event.description}
        </p>
      </div>

      {/* PARTICIPANTS SECTION (Visible ONLY to Admin) */}
      {user && user.role === 'admin' && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
            Registered Participants ({event.registeredUsers.length})
          </h3>
          
          {event.registeredUsers.length === 0 ? (
            <p className="text-gray-500 italic">No students have registered yet.</p>
          ) : (
            <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {event.registeredUsers.map((student, index) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{student.email}</td>
                      <td className="py-4 px-6 text-sm text-gray-400 font-mono">{student._id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetails;