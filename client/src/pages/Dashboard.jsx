import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(AuthContext); // Check if user is logged in
  const navigate = useNavigate();

  // 1. Fetch Events on Load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // 2. Handle Event Registration
  const handleRegister = async (eventId) => {
    if (!user) {
      alert("Please login to register for events.");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/events/register/${eventId}`, 
        {}, // Empty body
        { headers: { "x-auth-token": user.token } } // Send Token
      );
      alert("Registered Successfully!");
      
      // Refresh page to update seat count (Simple way)
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.msg || "Error registering");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Upcoming College Events</h1>
      
      {events.length === 0 ? (
        <p className="text-gray-500 text-lg">No upcoming events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.location}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="flex justify-between items-center mt-4 border-t pt-4">
                  <span className="text-sm font-medium text-gray-500">
                    Seats: <span className="text-black">{event.registeredUsers.length} / {event.totalSeats}</span>
                  </span>
                  {/* Add this Link inside the card actions area */}
                    <Link
                    to={`/event/${event._id}`} 
                    className="text-blue-600 hover:underline mr-4 font-semibold"
                    >
                    View Details
                    </Link>
                  {/* Button Logic */}
                  {user && event.registeredUsers.includes(user.id) ? (
                    <button disabled className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed">
                      Registered
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRegister(event._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;