import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/home";
import Albums from "./pages/Albums";
import AlbumDetail from "./pages/AlbumDetail";
import ArtistStudio from "./pages/ArtistStudio";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute role="user"><Home /></ProtectedRoute>} />
        <Route path="/albums" element={<ProtectedRoute role="user"><Albums /></ProtectedRoute>} />
        <Route path="/albums/:albumId" element={<ProtectedRoute role="user"><AlbumDetail /></ProtectedRoute>} />

        <Route path="/upload" element={<ProtectedRoute role="artist"><ArtistStudio /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}