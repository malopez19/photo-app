import { useState } from "react";
import {
	X,
	ChevronLeft,
	ChevronRight,
	Heart,
	Download,
	Trash2,
	Info,
	Sparkles,
	Calendar,
	HardDrive,
} from "lucide-react";

export default function PhotoLightbox({
	media,
	onClose,
	onNext,
	onPrev,
	onToggleFavorite,
	onDelete,
}) {
	const [showInfo, setShowInfo] = useState(true);
	if (!media) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none backdrop-blur-sm">
			<button
				onClick={onClose}
				className="absolute top-4 left-4 z-50 text-slate-300 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
			>
				<X className="w-6 h-6" />
			</button>

			<div className="absolute top-4 right-4 z-50 flex items-center gap-2">
				<button
					onClick={() => onToggleFavorite(media.id)}
					className={`p-2 rounded-full transition-all cursor-pointer ${
						media.isFavorite
							? "bg-rose-500 text-white"
							: "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
					}`}
				>
					<Heart className={`w-5 h-5 ${media.isFavorite ? "fill-current" : ""}`} />
				</button>
				<button
					onClick={() => setShowInfo(!showInfo)}
					className={`p-2 rounded-full transition-all cursor-pointer ${
						showInfo
							? "bg-indigo-600 text-white"
							: "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
					}`}
				>
					<Info className="w-5 h-5" />
				</button>
				<button
					onClick={() => onDelete(media.id)}
					className="p-2 rounded-full bg-white/10 text-slate-300 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
				>
					<Trash2 className="w-5 h-5" />
				</button>
			</div>

			<button
				onClick={onPrev}
				className="absolute left-4 top-1/2 -translate-y-1/2 z-40 text-slate-300 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
			>
				<ChevronLeft className="w-8 h-8" />
			</button>

			<button
				onClick={onNext}
				className="absolute right-4 top-1/2 -translate-y-1/2 z-40 text-slate-300 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
			>
				<ChevronRight className="w-8 h-8" />
			</button>
			<div className="w-full h-full flex items-center justify-center p-4 md:p-12">
				<div className="max-w-5xl max-h-[85vh] flex items-center justify-center">
					{media.type === "video" ? (
						<video
							src={media.url}
							controls
							autoPlay
							className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
						/>
					) : (
						<img
							src={media.url}
							alt={media.name}
							className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
						/>
					)}
				</div>
				{showInfo && (
					<aside className="w-80 bg-slate-900 border-l border-slate-800 h-full fixed right-0 top-0 z-40 p-6 flex flex-col justify-between text-slate-200 overflow-y-auto">
						<div className="space-y-6 pt-12">
							<div>
								<h3 className="font-bold text-lg text-white truncate">
									{media.name}
								</h3>
								<p className="text-xs text-slate-400 mt-0.5">ID: {media.id}</p>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
									<Sparkles className="w-4 h-4" />
									<span>Detección Automática de IA</span>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{(media.tags || ["Naturaleza", "Playa", "Verano"]).map(
										(tag, idx) => (
											<span
												key={idx}
												className="bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 text-xs px-2.5 py-1 rounded-lg"
											>
												{tag}
											</span>
										),
									)}
								</div>
							</div>

                            {/* Detalle Técnico */}
							<div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4">
								<div className="flex items-center justify-between">
									<span className="flex items-center gap-2 text-slate-400">
										<Calendar className="w-4 h-4" />
										<span>Fecha</span>
									</span>
									<span>{media.date || "09 Nov 2026"}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="flex items-center gap-2 text-slate-400">
										<HardDrive className="w-4 h-4" /> 
                                        Tamaño
									</span>
									<span>{media.size || "2.4 MB"}</span>
								</div>
							</div>
						</div>
						<a href={media.url} download rel="noreferrer" target="_blank" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-all mt-6">
							<Download className="w-4 h-4 inline-block ml-1" />
                            <span>Descargar Archivo</span>
						</a>
					</aside>
				)}
			</div>
		</div>
	);
}
