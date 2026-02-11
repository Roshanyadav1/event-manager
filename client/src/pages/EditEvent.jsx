import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams(); // Get Event ID from URL
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    totalSeats: "",
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        // Format date for HTML input (YYYY-MM-DD)
        const formattedDate = new Date(res.data.date).toISOString().split('T')[0];
        
        setFormData({
            title: res.data.title,
            description: res.data.description,
            date: formattedDate,
            location: res.data.location,
            totalSeats: res.data.totalSeats
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Update Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/events/${id}`, 
        formData,
        { headers: { "x-auth-token": user.token } }
      );
      alert("Event Updated Successfully!");
      navigate(`/event/${id}`); // Go back to details page
    } catch (err) {
      console.error(err);
      alert("Error updating event");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md border">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            placeholder="Event Title"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          
          <textarea
            name="description"
            value={formData.description}
            placeholder="Description"
            className="w-full p-2 border rounded h-24"
            onChange={handleChange}
            required
          />
          
          <div className="flex gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              className="w-1/2 p-2 border rounded"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              placeholder="Seats"
              className="w-1/2 p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="location"
            value={formData.location}
            placeholder="Location"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />

          <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 font-bold">
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;