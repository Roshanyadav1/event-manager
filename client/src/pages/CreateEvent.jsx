import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    totalSeats: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/events", 
        formData,
        { headers: { "x-auth-token": user.token } } // Send Admin Token
      );
      alert("Event Created Successfully!");
      navigate("/"); // Go back to Dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error creating event");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md border">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Event Title"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded h-24"
            onChange={handleChange}
            required
          />
          
          <div className="flex gap-4">
            <input
              type="date"
              name="date"
              className="w-1/2 p-2 border rounded"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="totalSeats"
              placeholder="Seats"
              className="w-1/2 p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="location"
            placeholder="Location (e.g. Auditorium)"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;