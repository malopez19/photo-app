import { useState } from "react";
import { X, FolderPlus } from "lucide-react";
import { api } from "../../config/api";
import toast from "react-hot-toast";

export default function CreateAlbumModal({
	isOpen,
	onClose,
	onAlbumCreated,
	selectedPhotoIds = [],
}) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleClose = () => {
		if (loading) return;

		setTitle("");
		setDescription("");
		onClose();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const cleanTitle = title.trim();
		const cleanDescription = description.trim();

		if (!cleanTitle) {
			toast.error("El título es obligatorio.");
			return;
		}

		if (cleanTitle.length > 100) {
			toast.error("El título no puede superar 100 caracteres.");
			return;
		}

		if (cleanDescription.length > 500) {
			toast.error("La descripción no puede superar 500 caracteres.");
			return;
		}

		if (loading) return;

		setLoading(true);

		try {
			const payload = {
				title: cleanTitle,
				description: cleanDescription,
			};

			if (selectedPhotoIds.length > 0) {
				payload.photoIds = selectedPhotoIds;
			}

			const response = await api.post("/albums", payload);

			toast.success("¡Álbum creado con éxito!");

			if (typeof onAlbumCreated === "function") {
				onAlbumCreated(response.data.album);
			}

			setTitle("");
			setDescription("");
			onClose();
		} catch (error) {
			const message =
				error.response?.data?.message || "No se pudo crear el álbum.";

			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					handleClose();
				}
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="create-album-title"
				className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
			>
				{/* Encabezado */}
				<div className="mb-6 flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div className="rounded-xl bg-blue-50 p-3">
							<FolderPlus size={24} className="text-blue-600" />
						</div>

						<div>
							<h2
								id="create-album-title"
								className="text-xl font-bold text-gray-900"
							>
								Crear nuevo álbum
							</h2>

							<p className="mt-1 text-sm text-gray-500">
								Organiza tus fotos y videos.
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={handleClose}
						disabled={loading}
						aria-label="Cerrar ventana"
						className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
					>
						<X size={20} />
					</button>
				</div>

				{/* Formulario */}
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="album-title"
							className="mb-2 block text-sm font-medium text-gray-700"
						>
							Título del álbum
						</label>

						<input
							id="album-title"
							type="text"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							placeholder="Ej. Vacaciones 2026"
							maxLength={100}
							required
							autoFocus
							disabled={loading}
							className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
						/>

						<p className="mt-1 text-right text-xs text-gray-400">
							{title.length}/100
						</p>
					</div>

					<div>
						<label
							htmlFor="album-description"
							className="mb-2 block text-sm font-medium text-gray-700"
						>
							Descripción
						</label>

						<textarea
							id="album-description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							placeholder="Describe brevemente este álbum..."
							maxLength={500}
							rows={4}
							disabled={loading}
							className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
						/>

						<p className="mt-1 text-right text-xs text-gray-400">
							{description.length}/500
						</p>
					</div>

					{selectedPhotoIds.length > 0 && (
						<p className="text-sm text-blue-600">
							{selectedPhotoIds.length} archivo(s) seleccionado(s) para agregar.
						</p>
					)}

					{/* Acciones */}
					<div className="flex justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={handleClose}
							disabled={loading}
							className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
						>
							Cancelar
						</button>

						<button
							type="submit"
							disabled={loading || !title.trim()}
							className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<FolderPlus size={17} />

							{loading ? "Creando..." : "Crear álbum"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
