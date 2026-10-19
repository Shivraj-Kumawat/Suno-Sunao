import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function ArtistStudio() {
  const { user } = useAuth();
  const storageKey = `myMusics_${user.id}`;

  const [myMusics, setMyMusics] = useState(() =>
    JSON.parse(localStorage.getItem(storageKey) || "[]")
  );

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const [uploading, setUploading] = useState(false);

  const [albumTitle, setAlbumTitle] = useState("");
  const [selected, setSelected] = useState([]);
  const [albumMsg, setAlbumMsg] = useState("");
  const [albumErr, setAlbumErr] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadMsg("");
    setUploadErr("");
    if (!file) return setUploadErr("Choose an audio file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("music", file);

    try {
      setUploading(true);
      const res = await api.post("/music/upload", formData);
      const music = res.data.music;
      const updated = [...myMusics, { id: music.id, title: music.title }];
      setMyMusics(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setUploadMsg("Music uploaded successfully");
      setTitle("");
      setFile(null);
      e.target.reset();
    } catch (err) {
      setUploadErr(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleAlbum = async (e) => {
    e.preventDefault();
    setAlbumMsg("");
    setAlbumErr("");
    try {
      await api.post("/music/album", { title: albumTitle, musics: selected });
      setAlbumMsg("Album created successfully");
      setAlbumTitle("");
      setSelected([]);
    } catch (err) {
      setAlbumErr(err.response?.data?.message || "Album creation failed");
    }
  };

  return (
    <div className="container">
      <h2>Upload Music</h2>
      <form className="form" onSubmit={handleUpload}>
        <input placeholder="Song title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} required />
        {uploadErr && <p className="error">{uploadErr}</p>}
        {uploadMsg && <p className="success">{uploadMsg}</p>}
        <button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
      </form>

      <h2 style={{ marginTop: 40 }}>Create Album</h2>
      <form className="form" onSubmit={handleAlbum}>
        <input placeholder="Album title" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required />
        {myMusics.length === 0 && <p>Upload some music first to add it to an album.</p>}
        {myMusics.map((m) => (
          <label className="checkbox-row" key={m.id}>
            <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggle(m.id)} />
            {m.title}
          </label>
        ))}
        {albumErr && <p className="error">{albumErr}</p>}
        {albumMsg && <p className="success">{albumMsg}</p>}
        <button type="submit">Create Album</button>
      </form>
    </div>
  );
}
