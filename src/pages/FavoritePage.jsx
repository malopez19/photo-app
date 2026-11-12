import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../config/api";
import { Heart } from "lucide-react";
import PhotoGrid from "../components/gallery/PhotoGrid";
import PhotoLightbox from "../components/modals/PhotoLightbox";
import BulkSelectionBar from "../components/gallery/BulkSelectionBar";
import toast from "react-hot-toast";

// Agrupar medios por fecha.
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
			size: (Number(item.size || 0) / (1024 * 1024)).toFixed(2) + " MB",
			duration: item.duration,
		});
	});

	return Object.keys(groups).map((date) => ({
		date,
		items: groups[date],
	}));
}

export default function FavoritePage() {
	const {
		searchQuery = "",
		refreshTrigger,
		triggerRefresh,
	} = useOutletContext() || {};

	const [favorites, setFavorites] = useState([]);
	const [selectedIds, setSelectedIds] = useState([]);
	const [activeMedia, setActiveMedia] = useState(null);
	const [loading, setLoading] = useState(true);

	// Obtener medios favoritos.
	useEffect(() => {
		const controller = new AbortController();

		const loadFavorites = async () => {
			try {
				const response = await api.get("/media", {
					params: {
						favorite: "true",
						query: searchQuery,
					},
					signal: controller.signal,
				});

				if (!controller.signal.aborted) {
					setFavorites(response.data.media || []);
					setSelectedIds([]);
				}
			} catch (error) {
				if (!controller.signal.aborted) {
					toast.error("Error al cargar la sección de favoritos.");
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		};

		loadFavorites();

		return () => {
			controller.abort();
		};
	}, [searchQuery, refreshTrigger]);

	// Selección múltiple.
	const handleToggleSelect = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id)
				? prev.filter((itemId) => itemId !== id)
				: [...prev, id],
		);
	};

	// Abrir Lightbox.
	const handleOpenMedia = (media) => {
		setActiveMedia(media);
	};

	// Cerrar Lightbox.
	const handleCloseLightbox = () => {
		setActiveMedia(null);
	};

	// Cambiar entre medios.
	const handleNavigateMedia = (direction) => {
		const allMedia = groupByDate(favorites).flatMap((group) => group.items);

		const currentIndex = allMedia.findIndex(
			(item) => item.id === activeMedia?.id,
		);

		if (currentIndex === -1 || allMedia.length <= 1) return;

		const nextIndex =
			(currentIndex + direction + allMedia.length) % allMedia.length;

		setActiveMedia(allMedia[nextIndex]);
	};

	// Actualizar favorito.
	const handleToggleFavorite = async (id) => {
		try {
			await api.patch(`/media/${id}/favorite`);

			setFavorites((prev) => prev.filter((item) => item._id !== id));

			setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));

			setActiveMedia((prev) => (prev?.id === id ? null : prev));

			triggerRefresh?.();

			toast.success("Favoritos actualizados.");
		} catch (error) {
			toast.error("Error al actualizar favorito.");
		}
	};

	// Mover un medio a la papelera.
	const handleMoveToTrash = async (id) => {
		try {
			await api.patch(`/media/${id}/trash`, {
				restore: false,
			});

			setFavorites((prev) => prev.filter((item) => item._id !== id));

			setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));

			setActiveMedia(null);

			triggerRefresh?.();

			toast.success("Movido a la papelera.");
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Error al mover a la papelera.",
			);
		}
	};

	// Favorito para todos los medios seleccionados.
	const handleBulkFavorite = async () => {
		if (selectedIds.length === 0) return;

		const results = await Promise.allSettled(
			selectedIds.map((id) => api.patch(`/media/${id}/favorite`)),
		);

		const successfulIds = selectedIds.filter(
			(_, index) => results[index].status === "fulfilled",
		);

		const failedCount = results.length - successfulIds.length;

		if (successfulIds.length > 0) {
			setFavorites((prev) =>
				prev.filter((item) => !successfulIds.includes(item._id)),
			);

			setSelectedIds([]);

			triggerRefresh?.();
		}

		if (failedCount === 0) {
			toast.success("Favoritos actualizados.");
		} else {
			toast.error(
				`${successfulIds.length} actualizado(s). ${failedCount} error(es).`,
			);
		}
	};

	// Eliminar selección múltiple (papelera).
	const handleBulkMoveToTrash = async () => {
		if (selectedIds.length === 0) return;

		const confirmed = window.confirm(
			`¿Deseas mover ${selectedIds.length} archivo(s) a la papelera?`,
		);

		if (!confirmed) return;

		const results = await Promise.allSettled(
			selectedIds.map((id) =>
				api.patch(`/media/${id}/trash`, {
					restore: false,
				}),
			),
		);

		const successfulIds = selectedIds.filter(
			(_, index) => results[index].status === "fulfilled",
		);

		const failedCount = results.length - successfulIds.length;

		if (successfulIds.length > 0) {
			setFavorites((prev) =>
				prev.filter((item) => !successfulIds.includes(item._id)),
			);

			setSelectedIds([]);

			triggerRefresh?.();
		}

		if (failedCount === 0) {
			toast.success("Archivos movidos a la papelera.");
		} else {
			toast.error(
				`${successfulIds.length} movido(s). ${failedCount} error(es).`,
			);
		}
	};

	const groups = groupByDate(favorites);

	if (loading) {
		return (
			<div className="flex min-h-75 items-center justify-center">
				<p className="text-sm text-gray-500">Cargando tus favoritos...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-12">
			{/* Encabezado */}
			<div className="flex items-center gap-3">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Tus Favoritos</h1>

					<p className="mt-1 text-sm text-gray-500">
						Acceso rápido a las fotos y videos que has destacado.
					</p>
				</div>
			</div>

			{/* Galería */}
			{groups.length === 0 ? (
				<div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
					<div className="mb-4 rounded-full bg-rose-50 p-5">
						<Heart size={36} className="text-rose-400" />
					</div>

					<h2 className="text-lg font-semibold text-gray-800">
						No tienes favoritos todavía
					</h2>

					<p className="mt-2 max-w-sm text-sm text-gray-500">
						Marca tus fotos y videos con el icono de corazón para encontrarlos
						rápidamente en esta sección.
					</p>
				</div>
			) : (
				<>
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500">
							{favorites.length} archivo(s) favorito(s)
						</p>

						{selectedIds.length > 0 && (
							<p className="text-sm font-medium text-blue-600">
								{selectedIds.length} seleccionado(s)
							</p>
						)}
					</div>

					<PhotoGrid
						groups={groups}
						selectedIds={selectedIds}
						onToggleSelect={handleToggleSelect}
						onSelectMedia={handleOpenMedia}
						onToggleFavorite={handleToggleFavorite}
					/>

					{selectedIds.length > 0 && (
						<BulkSelectionBar
							selectedCount={selectedIds.length}
							onClear={() => setSelectedIds([])}
							onFavorite={handleBulkFavorite}
							onDelete={handleBulkMoveToTrash}
						/>
					)}
				</>
			)}

			{/* Visor de fotografías y videos */}
			{activeMedia && (
				<PhotoLightbox
					media={activeMedia}
					onClose={handleCloseLightbox}
					onPrev={() => handleNavigateMedia(-1)}
					onNext={() => handleNavigateMedia(1)}
					onToggleFavorite={handleToggleFavorite}
					onDelete={handleMoveToTrash}
				/>
			)}
		</div>
	);
}
