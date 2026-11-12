import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuth } from "./context/useAuth";

import AuthPage from "./pages/AuthPage";
import PhotosPage from "./pages/PhotosPage";
import FavoritePage from "./pages/FavoritePage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import TrashPage from "./pages/TrashPage";

import AppLayout from "./components/layout/AppLayout";

// Proteger las rutas privadas.
function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();

	if (loading) {
		return <div>Cargando...</div>;
	}

	return user ? children : <Navigate to="/login" replace />;
}

function App() {
	const { user } = useAuth();

	return (
		<>
			<Toaster position="top-right" />

			<Routes>
				{/* Ruta de autenticación */}
				<Route
					path="/login"
					element={user ? <Navigate to="/" replace /> : <AuthPage />}
				/>

				{/* Rutas protegidas */}
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<AppLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<PhotosPage />} />
					<Route path="favorites" element={<FavoritePage />} />
					<Route path="albums" element={<AlbumsPage />} />
					<Route path="albums/:id" element={<AlbumDetailPage />} />
					<Route path="trash" element={<TrashPage />} />
				</Route>

				{/* Rutas inexistentes */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</>
	);
}

export default App;
