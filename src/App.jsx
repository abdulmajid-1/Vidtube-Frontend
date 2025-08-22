import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Register,
  HomePage,
  Login,
  Dashboard,
  MyProfile,
  UploadAVideo,
  Tweet,
  TweetNoLogin,
  Playlists,
} from "./pages/Index.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/UploadAVideo" element={<UploadAVideo />} />
        <Route path="/Tweet" element={<Tweet />} />
        <Route path="/TweetNoLogin" element={<TweetNoLogin />} />
        <Route path="/Playlists" element={<Playlists />} />
      </Routes>
    </Router>
  );
}

export default App;
