import {
	Search,
	Upload,
	Sparkles,
	LogOut,
	Image as ImageIcon,
} from "lucide-react";

export default function Navbar({ onOpenUpload }) {
	return (
		<header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
			<div className="flex items-center gap-3">
				<div className="bg-indigo-600 p-2 rounded-xl text-white">
					<ImageIcon className="w-6 h-6" />
				</div>
				<span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:inline">
					MyPhotos{" "}
					<span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full ml-1">
						IA
					</span>
				</span>
			</div>
			<div className="flex-1 max-w-xl mx-4">
				<div className="relative">
					<Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						placeholder="Buscar por fotos, objetos, etiquetas de IA (ej: 'playa', 'perro')..."
						className="w-full pl-10 pr-10 py-2 bg-slate-100 border border-transparent rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
					/>
					<Sparkles className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500" />
				</div>
			</div>
			<div className="flex items-center gap-3">
				<button
					title="Subir media"
					onClick={onOpenUpload}
					className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-sm hover:shadow transition-all cursor-pointer"
				>
					<Upload className="w-4 h-4" />
					<span className="hidden sm:inline">Subir Media</span>
				</button>
				<button
					title="Cerrar sesión"
					className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
				>
					<LogOut className="w-5 h-5" />
				</button>
			</div>
		</header>
	);
}
