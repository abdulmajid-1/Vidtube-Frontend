import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // New state for video playing
  const [playingVideo, setPlayingVideo] = useState(null);

  // New states for update & delete flow
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [editingVideo, setEditingVideo] = useState(null);
  const [deletingVideo, setDeletingVideo] = useState(null);

  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Check if user is logged in
  const checkAuth = async () => {
    try {
      const res = await axios.get(
        "https://vidtube-backend-2.onrender.com/api/v1/users/current-user",
        { withCredentials: true }
      );
      if (!res.data.success) {
        navigate("/login");
      }
    } catch (err) {
      navigate("/login");
    } finally {
      setCheckingAuth(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://vidtube-backend-2.onrender.com/api/v1/dashboard/stats",
        { withCredentials: true }
      );
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to load stats:", err.response?.data || err);
    }
  };

  const fetchVideos = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://vidtube-backend-2.onrender.com/api/v1/dashboard/videos?page=${pageNum}`,
        { withCredentials: true }
      );
      setVideos(res.data.data.videos);
      setPage(res.data.data.currentPage);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error("Failed to load videos:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!checkingAuth) {
      fetchStats();
      fetchVideos();
    }
  }, [checkingAuth]);

  // EDIT HANDLING
  const openEditForm = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description || "",
    });
    setThumbnailFile(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      setUpdating(true);
      const data = new FormData();
      data.append("title", editForm.title);
      data.append("description", editForm.description);
      if (thumbnailFile) data.append("thumbnail", thumbnailFile);

      await axios.patch(
        `https://vidtube-backend-2.onrender.com/api/v1/videos/updateVideo/${editingVideo._id}`,
        data
      );
      await fetchVideos(page);

      // Reset
      setEditingVideo(null);
      setIsUpdateMode(false);
    } catch (err) {
      console.error("Failed to update video:", err.response?.data || err);
    } finally {
      setUpdating(false);
    }
  };

  // DELETE HANDLING
  const openDeleteConfirm = (video) => {
    setDeletingVideo(video);
  };

  const handleDeleteSubmit = async () => {
    if (!deletingVideo) return;

    try {
      setDeleting(true);
      await axios.delete(
        `https://vidtube-backend-2.onrender.com/api/v1/videos/delete/${deletingVideo._id}`
      );
      await fetchVideos(page);

      // Reset
      setDeletingVideo(null);
      setIsDeleteMode(false);
    } catch (err) {
      console.error("Failed to delete video:", err.response?.data || err);
    } finally {
      setDeleting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Navbar */}
      <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold text-white">My Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/MyProfile")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            My Profile
          </button>
          <button
            onClick={() => navigate("/HomePage")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            HomePage
          </button>
          <button
            onClick={() => navigate("/Tweet")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            Tweet
          </button>
          <button
            onClick={() => navigate("/Playlists")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            Playlists
          </button>
        </div>
      </nav>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 shadow rounded-lg p-4 text-center">
              <h2 className="text-xl font-bold text-indigo-400">
                {stats.totalVideos}
              </h2>
              <p className="text-gray-400">Videos</p>
            </div>
            <div className="bg-gray-800 shadow rounded-lg p-4 text-center">
              <h2 className="text-xl font-bold text-green-400">
                {stats.totalSubscribers}
              </h2>
              <p className="text-gray-400">Subscribers</p>
            </div>
            <div className="bg-gray-800 shadow rounded-lg p-4 text-center">
              <h2 className="text-xl font-bold text-blue-400">
                {stats.totalViews}
              </h2>
              <p className="text-gray-400">Views</p>
            </div>
            <div className="bg-gray-800 shadow rounded-lg p-4 text-center">
              <h2 className="text-xl font-bold text-pink-400">
                {stats.totalLikes}
              </h2>
              <p className="text-gray-400">Likes</p>
            </div>
          </div>
        )}

        {/* Videos */}
        <div className="bg-gray-800 shadow rounded-lg p-6 relative">
          <nav className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Videos</h2>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/UploadAVideo")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
              >
                Upload Video
              </button>
              <button
                onClick={() => {
                  setIsUpdateMode(true);
                  setIsDeleteMode(false);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
              >
                Update Video
              </button>
              <button
                onClick={() => {
                  setIsDeleteMode(true);
                  setIsUpdateMode(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
              >
                Delete Video
              </button>
            </div>
          </nav>

          {isUpdateMode && !editingVideo && (
            <p className="text-yellow-400 mb-4">
              Select the video you want to edit
            </p>
          )}
          {isDeleteMode && !deletingVideo && (
            <p className="text-yellow-400 mb-4">
              Select the video you want to delete
            </p>
          )}

          {loading ? (
            <p className="text-gray-400">Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-gray-400">No videos found.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <li
                  key={video._id}
                  className="border border-gray-700 rounded-lg shadow-sm bg-gray-900 hover:bg-gray-800 transition cursor-pointer"
                  onClick={() =>
                    isUpdateMode
                      ? openEditForm(video)
                      : isDeleteMode
                      ? openDeleteConfirm(video)
                      : setPlayingVideo(video)
                  }
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-t-md"
                  />
                  <div className="p-3">
                    <h3 className="text-md font-semibold text-white">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {video.owner?.username} •{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-300">{video.totalLikes} Likes</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => fetchVideos(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded disabled:opacity-50 hover:bg-gray-600"
            >
              Prev
            </button>
            <p className="text-gray-400">
              Page {page} of {totalPages}
            </p>
            <button
              onClick={() => fetchVideos(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded disabled:opacity-50 hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-white">
              Edit Video - {editingVideo.title}
            </h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Title"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Description"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="w-full text-gray-300"
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideo(null);
                    setIsUpdateMode(false);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Delete Video - {deletingVideo.title}
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to permanently delete this video?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setDeletingVideo(null);
                  setIsDeleteMode(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-[800px] max-w-full relative">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              {playingVideo.title}
            </h2>
            <div className="flex justify-center">
              <video
                src={playingVideo.videoFile}
                controls
                autoPlay
                className="rounded-lg max-h-[450px] w-auto"
              />
            </div>
            <p className="text-gray-300 mt-3 text-center">
              {playingVideo.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
