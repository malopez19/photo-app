import { Heart, Play, CheckCircle, Sparkles } from "lucide-react";

export default function PhotoCard({
	media,
	isSelected,
	onToggleSelect,
	onSelectMedia,
	onToggleFavorite,
}) {
	const isVideo = media.type === "video";
	return (
		<div onClick={() => onSelectMedia(media)} 
			className={`group relative rounded-2xl overflow-hidden bg-slate-200 cursor-pointer select-none aspect-square border-2 transition-all duration-200 
			${isSelected ? "border-indigo-600 ring-2 ring-indigo-600/30" : "border-transparent hover:border-slate-300"}`}
		>
			
			<img
				src={media.thumbnailUrl || media.url}
				alt={media.name}
				className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
			/>
            
			{/* Capa Oscura Overlay al pasar el mouse */}
			<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
				{isVideo && <Play className="w-8 h-8 text-white" />}
			</div>

			{/* Checkbox de Selección Múltiple */}
			<button
				onClick={(e) => {
					e.stopPropagation();
					onToggleSelect(media.id);
				}}
				className={`absolute top-3 left-3 rounded-full p-0.5 transition-all ${
					isSelected
						? "opacity-100 text-indigo-600 bg-white"
						: "opacity-0 group-hover:opacity-100 text-white/80 hover:text-white"
				}`}
			>
				<CheckCircle className="w-6 h-6 fill-current" />
			</button>

			{/* Botón de Favorito */}
			<button
				onClick={(e) => {
					e.stopPropagation();
					onToggleFavorite(media.id);
				}}
				className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
					media.isFavorite
						? "opacity-100 bg-rose-500 text-white"
						: "opacity-0 group-hover:opacity-100 bg-black/40 text-white hover:bg-black/60"
				}`}
			>
				<Heart className={`w-4 h-4 ${media.isFavorite ? "fill-current" : ""}`} />
			</button>

			{/* Indicador de Video o Etiquetas IA */}
			<div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
				{isVideo ? (
					<span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
						<Play className="w-3 h-3 fill-current" />
						<span>{media.duration || "0:15"}</span>
					</span>
				) : (
					<span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-[10px]">
						<Sparkles className="w-3 h-3 text-indigo-400" />
						<span>{media.tags?.[0] || "IA Tagged"}</span>
					</span>
				)}
			</div>
		</div>
	);
}
