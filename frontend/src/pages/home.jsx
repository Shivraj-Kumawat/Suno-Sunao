import { useEffect, useState } from "react";
import api from "../api";

export default function Home() {
  const [musics, setMusics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/music")
      .then((res) => setMusics(res.data.musics))
      .catch((err) => setError(err.response?.data?.message || "Failed to load"));
  }, []);

  return (
    <div className="container">
      <h2>All Musics</h2>
      {error && <p className="error">{error}</p>}
      {musics.length === 0 && !error && <p>No music yet.</p>}
      {musics.map((m) => (
        <div className="card" key={m._id}>
          <h3>{m.title}</h3>
          <small>by {m.artist?.username}</small>
          <audio controls src={m.uri} />
        </div>
      ))}
    </div>
  );
}