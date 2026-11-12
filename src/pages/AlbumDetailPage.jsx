import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Folder, Image as ImageIcon } from "lucide-react";
import { api } from "../config/api";
import PhotoGrid from "../components/gallery/PhotoGrid";
import toast from "react-hot-toast";

export default function AlbumDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [album, setAlbum] = useState(null);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);

	// Obtener información del álbum.
	useEffect(() => {
		let isMounted = true;

		const loadAlbum = async () => {
			try {
				const response = await api.get(`/albums/${id}`);

				if (isMounted) {
					setAlbum(response.data.album || null);
				}
			} catch (error) {
				if (isMounted) {
					toast.error(
						error.response?.status === 404
							? "El álbum no existe o no está disponible."
							: "Error al obtener el álbum.",
					);

					navigate("/albums", { replace: true });
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		loadAlbum();

		return () => {
			isMounted = false;
		};
	}, [id, navigate]);

	// Eliminar álbum.
	const handleDeleteAlbum = async () => {
		const confirmed = window.confirm(
			"¿Estás seguro de que deseas eliminar este álbum? Las fotos conservarán su copia en la galería principal.",
		);

		if (!confirmed || deleting) return;

		try {
			setDeleting(true);

			await api.delete(`/albums/${id}`);

			toast.success("Álbum eliminado correctamente.");

			navigate("/albums", { replace: true });
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Error al eliminar el álbum.",
			);
		} finally {
			setDeleting(false);
		}
	};

	const handleRemovePhoto = async (photoId) => {
		const confirmed = window.confirm(
			"¿Quieres quitar esta fotografía del álbum? La foto seguirá disponible en tu galería principal.",
		);

		if (!confirmed) return;

		try {
			const response = await api.delete(`/albums/${id}/photos/${photoId}`);

			setAlbum(response.data.album);

			toast.success("Fotografía quitada del álbum.");
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"No se pudo quitar la fotografía del álbum.",
			);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-75 items-center justify-center">
				<p className="text-gray-500">Cargando detalles del álbum...</p>
			</div>
		);
	}

	if (!album) return null;

	// Adaptar los medios al formato de PhotoGrid.
	const mediaItems = (album.photos || []).map((item) => ({
		id: item._id,
		name: item.title,
		url: item.url,
		thumbnailUrl: item.thumbnailUrl,
		type: item.mediaType,
		isFavorite: item.isFavorite,
		tags: item.objects || [],
	}));

	const groups =
		mediaItems.length > 0
			? [
					{
						date: `Fotos en "${album.title}"`,
						items: mediaItems,
					},
				]
			: [];

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-3">
					<button
						type="button"
						onClick={() => navigate("/albums")}
						aria-label="Volver a los álbumes"
						className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-100"
					>
						<ArrowLeft size={20} />
					</button>

					<div>
						<div className="flex items-center gap-2">
							<Folder size={22} className="text-blue-600" />

							<h1 className="text-2xl font-bold text-gray-900">
								{album.title}
							</h1>
						</div>

						{album.description && (
							<p className="mt-2 text-sm text-gray-500">{album.description}</p>
						)}

						<p className="mt-2 text-xs text-gray-400">
							{mediaItems.length} archivo(s) en este álbum
						</p>
					</div>
				</div>

				<button
					type="button"
					onClick={handleDeleteAlbum}
					disabled={deleting}
					className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Trash2 size={18} />
					{deleting ? "Eliminando..." : "Eliminar álbum"}
				</button>
			</div>

			{/* Galería del álbum */}
			{groups.length === 0 ? (
				<div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
					<div className="mb-4 rounded-full bg-gray-100 p-5">
						<ImageIcon size={36} className="text-gray-400" />
					</div>

					<h2 className="text-lg font-semibold text-gray-800">
						Este álbum está vacío
					</h2>

					<p className="mt-2 text-sm text-gray-500">
						Todavía no hay fotos o videos en esta colección.
					</p>
				</div>
			) : (
				<PhotoGrid
					groups={groups}
					selectedIds={[]}
					onSelect={() => {}}
					onOpen={() => {}}
					onToggleFavorite={() => {}}
					onRemovePhoto={handleRemovePhoto}
				/>
			)}
		</div>
	);
}
