import { useState } from "react";

import { X, UploadCloud, Loader2 } from "lucide-react";

import { api } from "../../config/api";
import toast from "react-hot-toast";

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
	const [uploading, setUploading] = useState(false);

	if (!isOpen) return null;

	// Procesar y subir archivos.
	const handleFiles = async (files) => {
		if (!files || files.length === 0) return;

		if (files.length > 5) {
			toast.error("Solo puedes subir un máximo de 5 archivos.");
			return;
		}

		const formData = new FormData();

		Array.from(files).forEach((file) => {
			formData.append("media", file);
		});

		setUploading(true);

		const toastId = toast.loading(
			"Subiendo a la nube y procesando etiquetas con IA...",
		);

		try {
			const res = await api.post("/media/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			toast.success(res.data.message || "Archivos subidos con éxito", {
				id: toastId,
			});

			if (onUploadSuccess) {
				onUploadSuccess();
			}

			onClose();
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Error al subir los archivos",
				{ id: toastId },
			);
		} finally {
			setUploading(false);
		}
	};

	// Evitar que el navegador abra los archivos al soltarlos.
	const handleDragOver = (e) => {
		e.preventDefault();
	};

	// Procesar archivos arrastrados.
	const handleDrop = (e) => {
		e.preventDefault();

		if (uploading) return;

		handleFiles(e.dataTransfer.files);
	};

	// Procesar archivos seleccionados.
	const handleFileChange = (e) => {
		handleFiles(e.target.files);

		// Permitir seleccionar nuevamente el mismo archivo.
		e.target.value = "";
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
			<div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
				{/* CERRAR MODAL */}
				<button
					type="button"
					onClick={onClose}
					disabled={uploading}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 disabled:opacity-40"
					aria-label="Cerrar ventana"
				>
					<X size={22} />
				</button>

				{/* TÍTULO */}
				<div className="text-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900">
						Subir Fotos o Videos
					</h2>

					<p className="text-gray-500 text-sm mt-2">
						Soporta JPG, PNG, WEBP y MP4 con etiquetado de IA automático.
					</p>
				</div>

				{/* ÁREA DE SUBIDA */}
				<div
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl p-8 text-center transition-all cursor-pointer group relative"
				>
					<input
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
						multiple
						disabled={uploading}
						onChange={handleFileChange}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
					/>

					{uploading ? (
						<div className="flex flex-col items-center gap-3">
							<Loader2 size={45} className="text-indigo-600 animate-spin" />

							<p className="text-indigo-700 font-semibold">
								Subiendo archivos...
							</p>

							<p className="text-gray-500 text-sm">
								Por favor, espera mientras procesamos tus archivos.
							</p>
						</div>
					) : (
						<>
							<UploadCloud
								size={48}
								className="mx-auto text-indigo-500 group-hover:scale-110 transition-transform"
							/>

							<p className="text-gray-800 font-semibold mt-4">
								Arrastra y suelta tus archivos aquí
							</p>

							<p className="text-gray-500 text-sm mt-2">
								o haz clic para explorar en tu dispositivo
							</p>

							<p className="text-gray-400 text-xs mt-4">
								Máximo 5 archivos por subida
							</p>
						</>
					)}
				</div>

				{/* BOTÓN CANCELAR */}
				<button
					type="button"
					onClick={onClose}
					disabled={uploading}
					className="w-full mt-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
				>
					Cancelar
				</button>
			</div>
		</div>
	);
}
