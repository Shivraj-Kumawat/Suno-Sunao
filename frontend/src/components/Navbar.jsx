import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3>🎵 Suno Sunao</h3>
      <div className="links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user?.role === "user" && (
          <>
            <Link to="/">Musics</Link>
            <Link to="/albums">Albums</Link>
          </>
        )}
        {user?.role === "artist" && <Link to="/upload">Artist Studio</Link>}
        {user && (
          <>
            <span>{user.username} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}