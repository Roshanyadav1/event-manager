import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events/my-events", {
          headers: { "x-auth-token": user.token }
        });
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMyEvents();
  }, [user]);

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Registered Events</h2>

      {events.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-500 text-xl">You haven't registered for any events yet.</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 block">
            Browse Upcoming Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                📅 {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm">
                📍 {event.location}
              </p>
              <div className="mt-4">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                  Registered
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;