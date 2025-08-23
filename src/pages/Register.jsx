import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullname", formData.fullname);
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (avatar) data.append("avatar", avatar);
    if (coverImage) data.append("coverImage", coverImage);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://vidtube-backend-2.onrender.com/api/v1/users/register",
        data,
        { withCredentials: true }
      );
      console.log("User registered:", res.data);
      navigate("/HomePage");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Navbar */}
      <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center shadow">
        <h1
          onClick={() => navigate("/HomePage")}
          className="text-4xl font-Brush Script MT leading-none tracking-tight text-white cursor-pointer"
        >
          VidTube
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/HomePage")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-center text-white">Register</h2>

          {/* Fullname */}
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none placeholder-gray-400"
            required
          />

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none placeholder-gray-400"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none placeholder-gray-400"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none placeholder-gray-400"
            required
          />

          {/* Avatar */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Avatar *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full border border-gray-700 bg-gray-900 text-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              required
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full border border-gray-700 bg-gray-900 text-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-medium transition ${
              loading 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {loading ? "Processing..." : "Register"}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition"
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
