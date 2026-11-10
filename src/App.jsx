import { Routes, Route, Navigate } from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast';

import AuthPage from "./pages/AuthPage";
import PhotosPage from "./pages/PhotosPage";
import FavoritePage from "./pages/FavoritePage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import TrashPage from "./pages/TrashPage";
import AppLayout from "./components/layout/AppLayout";

function App() {
	return (
		<>
      <Toaster position="bottom-right" />
      <Routes>
        {/* Ruta Pública */}
        <Route path="/login" element={<AuthPage />} />

        {/* Rutas Protegidas bajo AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<PhotosPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:id" element={<AlbumDetailPage />} />
          <Route path="/trash" element={<TrashPage />} />
        </Route>

        {/* Ruta de redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
	);
}

export default App;
