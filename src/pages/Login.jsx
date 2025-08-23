import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        "https://vidtube-backend-2.onrender.com/api/v1/users/login",
        {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // console.log("User Logged In:", res.data);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err);
      alert(err.response?.data?.message || "Something went wrong");
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
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-xl shadow-lg w-96 space-y-6 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-center text-white">Login</h2>

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
            {loading ? "Processing..." : "Login"}
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition"
              >
                Register here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
