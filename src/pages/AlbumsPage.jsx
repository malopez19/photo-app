import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Folder, Image as ImageIcon } from "lucide-react";
import { api } from "../config/api";
import CreateAlbumModal from "../components/modals/CreateAlbumModal";
import toast from "react-hot-toast";

export default function AlbumsPage() {
	const [albums, setAlbums] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const navigate = useNavigate();

	// Obtener álbumes.
	const fetchAlbums = useCallback(async () => {
		try {
			const response = await api.get("/albums");
			setAlbums(response.data.albums || []);
		} catch (error) {
			toast.error("Error al cargar los álbumes." + (error.response?.data?.message || ""));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		let isMounted = true;

		const loadAlbums = async () => {
			try {
				const response = await api.get("/albums");

				if (isMounted) {
					setAlbums(response.data.albums || []);
				}
			} catch (error) {
				if (isMounted) {
					toast.error("Error al cargar los álbumes." + (error.response?.data?.message || ""));
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		loadAlbums();

		return () => {
			isMounted = false;
		};
	}, []);

	// Actualizar la lista después de crear un álbum.
	const handleAlbumCreated = (newAlbum) => {
		if (newAlbum?._id) {
			setAlbums((prev) => [newAlbum, ...prev]);
		} else {
			fetchAlbums();
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-75 items-center justify-center">
				<p className="text-gray-500">Cargando tus álbumes...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Tus álbumes</h1>

					<p className="mt-1 text-sm text-gray-500">
						Organiza y clasifica tus fotos por colecciones.
					</p>
				</div>

				<button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
				>
					<FolderPlus size={19} />
					Crear álbum
				</button>
			</div>

			{/* Lista de álbumes */}
			{albums.length === 0 ? (
				<div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
					<div className="mb-4 rounded-full bg-blue-50 p-5">
						<Folder size={36} className="text-blue-500" />
					</div>

					<h2 className="text-lg font-semibold text-gray-800">
						Todavía no tienes álbumes
					</h2>

					<p className="mt-2 max-w-sm text-sm text-gray-500">
						Crea tu primer álbum para organizar tus fotos y videos en
						colecciones.
					</p>

					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
					>
						<FolderPlus size={18} />
						Crear mi primer álbum
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{albums.map((album) => {
						const photos = album.photos || [];
						const coverPhoto = photos[0];
						const count = photos.length;

						const coverUrl = coverPhoto
							? coverPhoto.thumbnailUrl || coverPhoto.url
							: null;

						return (
							<button
								key={album._id}
								type="button"
								onClick={() => navigate(`/albums/${album._id}`)}
								className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{/* Portada */}
								<div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
									{coverUrl ? (
										<img
											src={coverUrl}
											alt={`Portada de ${album.title}`}
											loading="lazy"
											className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
											<Folder size={52} className="text-blue-300" />
										</div>
									)}

									<div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
										<ImageIcon size={14} />
										{count} archivos
									</div>
								</div>

								{/* Información */}
								<div className="w-full p-4">
									<h2 className="truncate text-base font-semibold text-gray-900">
										{album.title}
									</h2>

									{album.description && (
										<p className="mt-2 line-clamp-2 text-sm text-gray-500">
											{album.description}
										</p>
									)}

									<p className="mt-3 text-xs font-medium text-blue-600">
										Ver álbum →
									</p>
								</div>
							</button>
						);
					})}
				</div>
			)}

			{/* Modal */}
			<CreateAlbumModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAlbumCreated={handleAlbumCreated}
			/>
		</div>
	);
}
