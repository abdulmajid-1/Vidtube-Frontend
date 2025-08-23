import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function UploadAVideo() {
  const navigate = useNavigate();

  // Global UI state
  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [currentUsername, setCurrentUsername] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const note = (type, text) => setMsg({ type, text });
  const clearNoteSoon = () => {
    setTimeout(() => setMsg({ type: "", text: "" }), 2500);
  };

  // For text fields (title, description)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // For file inputs (thumbnail & video)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === "thumbnail") {
        setThumbnail(files[0]);
      } else if (name === "videoFile") {
        setVideoFile(files[0]);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(
          "https://vidtube-backend-2.onrender.com/api/v1/users/current-user",
          {
            withCredentials: true,
          }
        );
        const user = res?.data?.data;
        if (!user?.username) {
          navigate("/login");
          return;
        }
        setCurrentUsername(user.username);
      } catch (err) {
        navigate("/login");
      } finally {
        setAuthChecking(false);
      }
    };
    init();
  }, [navigate]);

  const UploadVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    note("", "");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (videoFile) data.append("videoFile", videoFile);
    if (thumbnail) data.append("thumbnail", thumbnail);

    try {
      await axios.post(
        "https://vidtube-backend-2.onrender.com/api/v1/videos/upload-video",
        data,
        { withCredentials: true }
      );
      note("success", "Video uploaded successfully");
      setFormData({ title: "", description: "" });
      setThumbnail(null);
      setVideoFile(null);
    } catch (err) {
      note("error", err?.response?.data?.message || "Failed to upload video");
    } finally {
      setLoading(false);
      clearNoteSoon();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold">Video Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hi, {currentUsername || "User"} 👋</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex justify-center items-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
            Upload Video
          </h2>

          <form onSubmit={UploadVideo} className="space-y-4">
            {/* Text inputs */}
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 w-full rounded-md h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* File inputs */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Thumbnail
              </label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
              />
              {thumbnail && (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Video File
              </label>
              <input
                type="file"
                name="videoFile"
                accept="video/*"
                onChange={handleFileChange}
                className="mb-2"
              />
              {videoFile && (
                <video
                  controls
                  src={URL.createObjectURL(videoFile)}
                  className="w-full rounded-lg border"
                />
              )}
            </div>

            {/* Upload button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>
          </form>

          {/* Show notification */}
          {msg.text && (
            <p
              className={`mt-4 text-center font-medium ${
                msg.type === "success"
                  ? "text-green-600"
                  : msg.type === "error"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {msg.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadAVideo;
