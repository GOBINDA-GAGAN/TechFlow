import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import PostDetails from "./pages/PostDetails";
import PublicProfile from "./pages/PublicProfile";
import EditProfile from "./pages/EditProfile";
import Bookmarks from "./pages/Bookmarks";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

const App = () => {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/user/:username" element={<PublicProfile />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;
