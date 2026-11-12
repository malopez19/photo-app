import { Heart, Play, CheckCircle, Sparkles, X } from "lucide-react";

export default function PhotoCard({
	media,
	isSelected,
	onToggleSelect,
	onSelectMedia,
	onToggleFavorite,
	onRemovePhoto,
}) {
	const isVideo = media.type === "video";

	return (
		<div
			onClick={() => onSelectMedia?.(media)}
			className={`group relative rounded-2xl overflow-hidden bg-slate-200 cursor-pointer select-none aspect-square border-2 transition-all duration-200
                ${
									isSelected
										? "border-indigo-600 ring-2 ring-indigo-600/30"
										: "border-transparent hover:border-slate-300"
								}`}
		>
			<img
				src={media.thumbnailUrl || media.url}
				alt={media.name || "Fotografía"}
				className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
			/>

			{/* Capa oscura */}
			<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
				{isVideo && <Play className="w-8 h-8 text-white" />}
			</div>

			{/* Selección múltiple */}
			<button
				type="button"
				aria-label="Seleccionar fotografía"
				onClick={(e) => {
					e.stopPropagation();
					onToggleSelect?.(media.id);
				}}
				className={`absolute top-3 left-3 rounded-full p-0.5 transition-all ${
					isSelected
						? "opacity-100 text-indigo-600 bg-white"
						: "opacity-0 group-hover:opacity-100 text-white/80 hover:text-white"
				}`}
			>
				<CheckCircle className="w-6 h-6 fill-current" />
			</button>

			{/* Favorito */}
			<button
				type="button"
				aria-label={
					media.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
				}
				onClick={(e) => {
					e.stopPropagation();
					onToggleFavorite?.(media.id);
				}}
				className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
					media.isFavorite
						? "opacity-100 bg-rose-500 text-white"
						: "opacity-0 group-hover:opacity-100 bg-black/40 text-white hover:bg-black/60"
				}`}
			>
				<Heart
					className={`w-4 h-4 ${media.isFavorite ? "fill-current" : ""}`}
				/>
			</button>

			{/* Quitar fotografía del álbum */}
			{onRemovePhoto && (
				<button
					type="button"
					aria-label="Quitar fotografía del álbum"
					title="Quitar del álbum"
					onClick={(e) => {
						e.stopPropagation();
						onRemovePhoto(media.id);
					}}
					className="absolute top-12 right-3 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
				>
					<X className="w-4 h-4" />
				</button>
			)}

			{/* Información de fotografía o video */}
			<div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
				{isVideo ? (
					<span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
						<Play className="w-3 h-3 fill-current" />
						<span>{media.duration || "0:15"}</span>
					</span>
				) : (
					<div className="flex items-center gap-1">
						{media.tags?.slice(0, 2).map((tag, index) => (
							<span
								key={index}
								className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-[10px]"
							>
								<Sparkles className="w-3 h-3 text-indigo-400" />
								<span>{tag}</span>
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
