import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api.js";

function TweetNoLogin() {
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState([]);

  const navigate = useNavigate();

  // Fetch all tweets
  const getAllTweets = async () => {
    try {
      const res = await axios.get("/api/v1/tweets/getAllTweets");

      setTweets(res.data.data.tweets || []);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTweets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading tweets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          Tweet App
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            Home
          </button>
        </div>
      </nav>

      {/* Tweets Section */}
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {tweets.length === 0 ? (
          <p className="text-center text-gray-500">No tweets found.</p>
        ) : (
          tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="p-5 border rounded-2xl shadow-sm bg-white hover:shadow-lg transition"
            >
              {/* Owner */}
              <div className="flex items-center mb-4">
                <img
                  src={tweet?.owner?.avatar || "/default-avatar.png"}
                  alt={tweet?.owner?.username || "user"}
                  className="w-12 h-12 rounded-full mr-3 border object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {tweet?.owner?.fullName || "Unknown User"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    @{tweet?.owner?.username || "unknown"}
                  </p>
                </div>
              </div>

              {/* Tweet content */}
              <p className="text-gray-700 mb-3 whitespace-pre-line">
                {tweet.content}
              </p>

              {/* Image if available */}
              {tweet.image && (
                <img
                  src={tweet.image}
                  alt="Tweet media"
                  className="rounded-xl max-h-72 w-full object-cover mb-3"
                />
              )}

              {/* Time */}
              <p className="text-gray-400 text-xs">
                {new Date(tweet.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TweetNoLogin;
