import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api.js";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Loading indicator for comment/video actions
  const [commentLoading, setCommentLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch videos with pagination
  const fetchVideos = async (pageNumber = 1) => {
    try {
      const res = await axios.get(`/api/v1/videos/getAll?page=${pageNumber}`);
      setVideos(res.data.data.videos || []);
      setTotalPages(res.data.data.totalPages || 1);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  // Check login status and get current user
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("/api/v1/users/current-user", {
          withCredentials: true,
        });
        if (res.data?.success) {
          setIsLoggedIn(true);
          setCurrentUser(res.data.data);
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } catch {
        setIsLoggedIn(false);
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      setCurrentUser(null);
      navigate("/HomePage");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Load comments for selected video
  const fetchComments = async (videoId) => {
    try {
      const res = await axios.get(
        `/api/v1/comments/getVideoComments/${videoId}`,
        { withCredentials: true }
      );
      setComments(res.data.data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Add new comment
  const addComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      await axios.post(
        `/api/v1/comments/addVideoComment/${selectedVideoId}`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchComments(selectedVideoId);
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Start editing
  const startEditing = (id, content) => {
    setEditCommentId(id);
    setEditContent(content);
  };

  // Save updated comment
  const updateComment = async () => {
    if (!editContent.trim()) return;
    setCommentLoading(true);
    try {
      await axios.patch(
        `/api/v1/comments/updateComment/${editCommentId}`,
        { content: editContent },
        { withCredentials: true }
      );
      setEditCommentId(null);
      setEditContent("");
      fetchComments(selectedVideoId);
    } catch (err) {
      console.error("Error updating comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete comment
  const deleteComment = async (id) => {
    setCommentLoading(true);
    try {
      await axios.delete(`/api/v1/comments/deleteComment/${id}`, {
        withCredentials: true,
      });
      fetchComments(selectedVideoId);
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Like/Unlike a video
  const toggleVideoLike = async (videoId) => {
    if (isLoggedIn) {
      setVideoLoading(true);
      try {
        await axios.post(
          `/api/v1/likes/toggle/v/${videoId}`,
          {},
          { withCredentials: true }
        );
        fetchVideos(page);
      } catch (err) {
        console.error("Error liking video:", err);
      } finally {
        setVideoLoading(false);
      }
    }
  };

  // Like/Unlike a comment
  const toggleCommentLike = async (commentId) => {
    if (isLoggedIn) {
      setCommentLoading(true);
      try {
        await axios.post(
          `/api/v1/likes/toggle/c/${commentId}`,
          {},
          { withCredentials: true }
        );
        fetchComments(selectedVideoId);
      } catch (err) {
        console.error("Error liking comment:", err);
      } finally {
        setCommentLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
        <h1
          onClick={() => {
            setSelectedVideo(null);
            navigate("/HomePage");
          }}
          className="text-4xl font-Brush Script MT leading-none tracking-tight text-white cursor-pointer"
        >
          VidTube
        </h1>

        {authLoading ? null : isLoggedIn ? (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/Dashboard")}
              className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/MyProfile")}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition"
            >
              My Profile
            </button>
            <button
              onClick={() => navigate("/Tweet")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
            >
              Tweet
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/TweetNoLogin")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
            >
              Tweet
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-500 transition"
            >
              Register
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="text-center py-10">
        <h2 className="text-5xl font-arial text-white mb-4">
          Stream, Share & Connect
        </h2>
        <p className="text-lg text-gray-400">
          Discover amazing videos shared by our community
        </p>
      </div>

      {/* Video Section */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Your Videos</h2>
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
                  setSelectedVideo(
                    selectedVideo === video._id ? null : video._id
                  )
                }
              >
                {selectedVideo === video._id ? (
                  <div className="p-4">
                    <video controls className="w-full h-64 rounded-md mb-3">
                      <source src={video.videoFile} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {video.owner?.username} •{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>

                    {/* Like button only if logged in */}
                    {isLoggedIn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVideoLike(video._id);
                        }}
                        disabled={videoLoading}
                        className="mt-2 px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded disabled:opacity-50"
                      >
                        ❤️ {video.totalLikes}
                      </button>
                    )}

                    <p className="text-gray-300 mt-2">
                      {video.totalComments}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoId(video._id);
                          fetchComments(video._id);
                          setShowCommentsModal(true);
                        }}
                        className="ml-2 px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-500 active:scale-95 transition duration-200"
                      >
                        💬 Comments
                      </button>
                    </p>
                  </div>
                ) : (
                  <div>
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

                      {/* Like button only if logged in */}
                      {isLoggedIn && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVideoLike(video._id);
                          }}
                          disabled={videoLoading}
                          className="mt-2 px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded disabled:opacity-50"
                        >
                          ❤️ {video.totalLikes}
                        </button>
                      )}

                      <p className="text-gray-300 mt-2">
                        {video.totalComments}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVideoId(video._id);
                            fetchComments(video._id);
                            setShowCommentsModal(true);
                          }}
                          className="mt-2 px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-500 active:scale-95 transition duration-200"
                        >
                          💬 Comments
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Comments Modal */}
        {showCommentsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-7 rounded-2xl w-[420px] max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-700">
              <h2 className="text-xl font-extrabold mb-5 text-indigo-400 tracking-wide text-center">
                Comments
              </h2>

              {/* List comments */}
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="mb-4 flex items-start gap-3 bg-gray-800 rounded-xl p-3 shadow hover:shadow-lg transition-all border border-gray-700"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                      {c.owner?.avatar ? (
                        <img
                          src={c.owner.avatar}
                          alt={c.owner.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                          {c.owner?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      {editCommentId === c._id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full border border-indigo-600 bg-gray-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={updateComment}
                              disabled={commentLoading}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded shadow disabled:opacity-50"
                            >
                              {commentLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditCommentId(null)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-indigo-300">
                              {c.owner?.username || "Unknown"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {c.createdAt
                                ? new Date(c.createdAt).toLocaleString()
                                : ""}
                            </span>
                          </div>
                          <p className="text-gray-200 mb-2">{c.content}</p>

                          {/* Restrict Update/Delete to owner */}
                          {isLoggedIn &&
                            currentUser &&
                            c.owner?._id === currentUser._id && (
                              <div className="flex gap-2 mt-1">
                                <button
                                  onClick={() => startEditing(c._id, c.content)}
                                  className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold px-2 py-1 rounded hover:bg-indigo-900 transition"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => deleteComment(c._id)}
                                  disabled={commentLoading}
                                  className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 rounded hover:bg-red-900 transition disabled:opacity-50"
                                >
                                  {commentLoading ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No comments yet.</p>
              )}

              {/* Add comment */}
              {isLoggedIn ? (
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full border border-indigo-600 bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2"
                  />
                  <button
                    onClick={addComment}
                    disabled={commentLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold shadow-lg transition disabled:opacity-50"
                  >
                    {commentLoading ? "Adding..." : "Add Comment"}
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-center mt-4">
                  Please login to add comments.
                </p>
              )}

              {/* Close */}
              <button
                onClick={() => setShowCommentsModal(false)}
                className="block w-full bg-gray-800 hover:bg-gray-700 text-white py-2 mt-5 rounded font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
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
  );
}
