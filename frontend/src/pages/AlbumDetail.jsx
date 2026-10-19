import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function AlbumDetail() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/music/albums/${albumId}`)
      .then((res) => setAlbum(res.data.album))
      .catch((err) => setError(err.response?.data?.message || "Failed to load"));
  }, [albumId]);

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!album) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{album.title}</h2>
      <small>by {album.artist?.username}</small>
      {album.musics.map((m) => (
        <div className="card" key={m._id}>
          <h3>{m.title}</h3>
          <audio controls src={m.uri} />
        </div>
      ))}
    </div>
  );
}