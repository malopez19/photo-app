import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../config/api";
import { Trash2, RotateCcw, Image, Video } from "lucide-react";
import toast from "react-hot-toast";
import { getTrash } from "../services/mediaService";

export default function TrashPage() {
	const { triggerRefresh } = useOutletContext() || {};

	const [trashItems, setTrashItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const loadTrash = async () => {
			try {
				const items = await getTrash();

				if (isMounted) {
					setTrashItems(items);
				}
			} catch (error) {
				if (isMounted) {
					console.error("Error al cargar papelera:", error);
					toast.error("Error al cargar la papelera.");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		loadTrash();

		return () => {
			isMounted = false;
		};
	}, []);

	const refreshTrash = async () => {
		try {
			const items = await getTrash();
			setTrashItems(items);

			if (typeof triggerRefresh === "function") {
				triggerRefresh();
			}
		} catch (error) {
			console.error("Error al actualizar papelera:", error);
			toast.error("Error al actualizar la papelera.");
		}
	};

	// Restaurar archivo.
	const handleRestore = async (id) => {
		try {
			setProcessing(true);

			await api.patch(`/media/${id}/trash`, {
				restore: true,
			});

			toast.success("Restaurado a la galería.");
			await refreshTrash();
		} catch (error) {
			console.error("Error al restaurar:", error);
			toast.error("Error al restaurar el archivo.");
		} finally {
			setProcessing(false);
		}
	};

	// Eliminar archivo permanentemente.
	const handleDeletePermanent = async (id) => {
		const confirmed = window.confirm(
			"¿Estás seguro de eliminar este archivo permanentemente? Esta acción no se puede deshacer.",
		);

		if (!confirmed) return;

		try {
			setProcessing(true);

			await api.delete(`/media/${id}`);

			toast.success("Eliminado permanentemente.");
			await refreshTrash();
		} catch (error) {
			console.error("Error al eliminar archivo:", error);
			toast.error("Error al eliminar permanentemente.");
		} finally {
			setProcessing(false);
		}
	};

	// Vaciar toda la papelera.
	const handleEmptyTrash = async () => {
		const confirmed = window.confirm(
			"¿Deseas eliminar permanentemente todos los archivos de la papelera? Esta acción no se puede deshacer.",
		);

		if (!confirmed) return;

		try {
			setProcessing(true);

			await api.delete("/media/trash/empty");

			toast.success("Papelera vaciada por completo.");
			await refreshTrash();
		} catch (error) {
			console.error("Error al vaciar papelera:", error);
			toast.error("Error al vaciar la papelera.");
		} finally {
			setProcessing(false);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-75 items-center justify-center">
				<p className="text-gray-500">Cargando papelera...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Papelera de reciclaje
					</h1>

					<p className="mt-1 text-sm text-gray-500">
						Los archivos eliminados pueden restaurarse o borrarse
						permanentemente.
					</p>
				</div>

				{trashItems.length > 0 && (
					<button
						type="button"
						onClick={handleEmptyTrash}
						disabled={processing}
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Trash2 size={18} />
						Vaciar papelera
					</button>
				)}
			</div>

			{/* Contenido */}
			{trashItems.length === 0 ? (
				<div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
					<div className="mb-4 rounded-full bg-gray-100 p-4">
						<Trash2 size={32} className="text-gray-400" />
					</div>

					<h2 className="text-lg font-semibold text-gray-700">
						La papelera está vacía.
					</h2>

					<p className="mt-2 text-sm text-gray-500">
						Los archivos que elimines aparecerán aquí.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{trashItems.map((item) => {
						const isVideo = item.mediaType === "video";

						return (
							<div
								key={item._id}
								className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
							>
								{/* Vista previa */}
								<div className="relative aspect-square bg-gray-100">
									{isVideo ? (
										<video
											src={item.url}
											poster={item.thumbnailUrl}
											className="h-full w-full object-cover"
										/>
									) : (
										<img
											src={item.thumbnailUrl || item.url}
											alt={item.title || "Imagen eliminada"}
											className="h-full w-full object-cover"
											loading="lazy"
										/>
									)}

									<div className="absolute left-3 top-3 rounded-full bg-black/60 p-2 text-white">
										{isVideo ? <Video size={16} /> : <Image size={16} />}
									</div>
								</div>

								{/* Información y acciones */}
								<div className="space-y-3 p-4">
									<div>
										<h3 className="truncate font-medium text-gray-900">
											{item.title || "Archivo sin nombre"}
										</h3>

										<p className="mt-1 text-xs text-gray-500">
											{item.size
												? `${(item.size / (1024 * 1024)).toFixed(2)} MB`
												: "Tamaño desconocido"}
										</p>
									</div>

									<div className="flex gap-2">
										<button
											type="button"
											onClick={() => handleRestore(item._id)}
											disabled={processing}
											className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
										>
											<RotateCcw size={16} />
											Restaurar
										</button>

										<button
											type="button"
											onClick={() => handleDeletePermanent(item._id)}
											disabled={processing}
											title="Eliminar permanentemente"
											className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
										>
											<Trash2 size={17} />
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
