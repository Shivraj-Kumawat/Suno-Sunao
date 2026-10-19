import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/music/albums")
      .then((res) => setAlbums(res.data.albums))
      .catch((err) => setError(err.response?.data?.message || "Failed to load"));
  }, []);

  return (
    <div className="container">
      <h2>Albums</h2>
      {error && <p className="error">{error}</p>}
      {albums.length === 0 && !error && <p>No albums yet.</p>}
      {albums.map((a) => (
        <div className="card" key={a._id}>
          <h3><Link to={`/albums/${a._id}`}>{a.title}</Link></h3>
          <small>by {a.artist?.username}</small>
        </div>
      ))}
    </div>
  );
}