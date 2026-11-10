import { X, Heart, Trash2, FolderPlus } from "lucide-react";

export default function BulkSelectionBar({
	selectedCount,
	onClear,
	onFavorite,
	onDelete,
	}) {
	if (selectedCount === 0) return null;

	return (
		<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-800 animate-bounce-short">
			<div className="flex items-center gap-2">
				<button
					onClick={onClear}
					className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
				>
					<X className="w-4 h-4" />
				</button>
				<span className="text-sm font-semibold">{selectedCount} seleccionados</span>
			</div>
			<div className="h-4 w-px bg-slate-700" />
			<div className="flex items-center gap-2">
				<button
					onClick={onFavorite}
					className="flex items-center gap-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all"
				>
					<Heart className="w-4 h-4 text-rose-400"/>
                    <span>Favorito</span>
				</button>
				<button
					onClick={onDelete}
					className="flex items-center gap-1.5 text-xs font-medium bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-3 py-1.5 rounded-xl transition-all"
				>
					<Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
				</button>
			</div>
		</div>
	);
}
