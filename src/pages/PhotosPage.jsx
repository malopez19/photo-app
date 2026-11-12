import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../config/api";
import PhotoGrid from "../components/gallery/PhotoGrid";
import PhotoLightbox from "../components/modals/PhotoLightbox";
import BulkSelectionBar from "../components/gallery/BulkSelectionBar";
import toast from "react-hot-toast";
import { getMedia } from "../services/mediaService";

// Agrupar fotos y videos por fecha.
function groupByDate(items) {
	const groups = {};

	items.forEach((item) => {
		const dateStr = new Date(item.createdAt).toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});

		if (!groups[dateStr]) {
			groups[dateStr] = [];
		}

		groups[dateStr].push({
			id: item._id,
			name: item.title,
			url: item.url,
			thumbnailUrl: item.thumbnailUrl,
			type: item.mediaType,
			isFavorite: item.isFavorite,
			tags: item.objects || [],
			date: dateStr,
			size: item.size ? (item.size / (1024 * 1024)).toFixed(2) + " MB" : "0 MB",
		});
	});

	return Object.keys(groups).map((date) => ({
		date,
		items: groups[date],
	}));
}

export default function PhotosPage() {
	const {
		searchQuery = "",
		refreshTrigger = 0,
		triggerRefresh,
	} = useOutletContext() || {};

	const [rawMedia, setRawMedia] = useState([]);
	const [selectedIds, setSelectedIds] = useState([]);
	const [activeMedia, setActiveMedia] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const loadMedia = async () => {
			try {
				const media = await getMedia(searchQuery);

				if (isMounted) {
					setRawMedia(media);
				}
			} catch (error) {
				if (isMounted) {
					console.error("Error al cargar medios:", error);
					toast.error("Error al cargar la galería.");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		loadMedia();

		return () => {
			isMounted = false;
		};
	}, [searchQuery, refreshTrigger]);

	const refreshMedia = async () => {
		try {
			setLoading(true);

			const media = await getMedia(searchQuery);
			setRawMedia(media);

			if (typeof triggerRefresh === "function") {
				triggerRefresh();
			}
		} catch (error) {
			console.error("Error al actualizar medios:", error);
			toast.error("Error al actualizar la galería.");
		} finally {
			setLoading(false);
		}
	};

	// Seleccionar o deseleccionar una foto.
	const handleSelect = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id)
				? prev.filter((selectedId) => selectedId !== id)
				: [...prev, id],
		);
	};

	// Limpiar selección.
	const clearSelection = () => {
		setSelectedIds([]);
	};

	// Actualizar favorito.
	const handleToggleFavorite = async (id) => {
		try {
			await api.patch(`/media/${id}/favorite`);

			await refreshMedia();

			toast.success("Favorito actualizado.");
		} catch (error) {
			console.error("Error al actualizar favorito:", error);
			toast.error("Error al actualizar favorito.");
		}
	};

	// Mover medio a la papelera.
	const handleMoveToTrash = async (id) => {
		try {
			await api.patch(`/media/${id}/trash`, {
				restore: false,
			});

			setActiveMedia(null);
			setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));

			await refreshMedia();

			toast.success("Movido a la papelera.");
		} catch (error) {
			console.error("Error al mover a papelera:", error);
			toast.error("Error al mover a la papelera.");
		}
	};

	const handleBulkTrash = async () => {
		if (selectedIds.length === 0) return;

		try {
			await Promise.all(
				selectedIds.map((id) =>
					api.patch(`/media/${id}/trash`, {
						restore: false,
					}),
				),
			);

			const total = selectedIds.length;

			setSelectedIds([]);
			setActiveMedia(null);

			await refreshMedia();

			toast.success(`${total} elemento(s) movido(s) a la papelera.`);
		} catch (error) {
			console.error("Error al mover elementos:", error);
			toast.error("No se pudieron mover todos los elementos.");

			// Recuperar el estado actual de la galería.
			try {
				const media = await getMedia(searchQuery);
				setRawMedia(media);
			} catch (refreshError) {
				console.error("Error al recuperar la galería:", refreshError);
			}
		}
	};

	// Abrir la vista ampliada.
	const handleOpenMedia = (media) => {
		setActiveMedia(media);
	};

	// Cerrar la vista ampliada.
	const handleCloseLightbox = () => {
		setActiveMedia(null);
	};

	const groups = groupByDate(rawMedia);

	if (loading) {
		return (
			<div className="flex min-h-75 items-center justify-center">
				<p className="text-gray-500">Cargando tus fotos e IA...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Todas las fotos</h1>

				<p className="mt-1 text-sm text-gray-500">
					Tus fotos y videos guardados.
				</p>
			</div>

			{/* Galería */}
			{groups.length === 0 ? (
				<div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
					<h2 className="text-lg font-semibold text-gray-700">
						No hay archivos guardados aún.
					</h2>

					<p className="mt-2 text-sm text-gray-500">
						Haz clic en "Subir Archivos" arriba para agregar tus fotos o videos.
					</p>
				</div>
			) : (
				<PhotoGrid
					groups={groups}
					selectedIds={selectedIds}
					onSelect={handleSelect}
					onOpen={handleOpenMedia}
					onToggleFavorite={handleToggleFavorite}
				/>
			)}

			{/* Barra de selección múltiple */}
			{selectedIds.length > 0 && (
				<BulkSelectionBar
					selectedCount={selectedIds.length}
					onDelete={handleBulkTrash}
					onClear={clearSelection}
				/>
			)}

			{/* Vista ampliada */}
			{activeMedia && (
				<PhotoLightbox
					media={activeMedia}
					onClose={handleCloseLightbox}
					onToggleFavorite={handleToggleFavorite}
					onDelete={handleMoveToTrash}
				/>
			)}
		</div>
	);
}
