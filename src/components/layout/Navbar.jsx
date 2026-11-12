import {
	Search,
	Upload,
	Sparkles,
	LogOut,
	Image as ImageIcon,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";

export default function Navbar({ onOpenUpload, searchQuery, setSearchQuery }) {
	const { logout, user } = useAuth();

	const handleLogout = () => {
		logout();
	};

	return (
		<header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20 gap-4">
					{/* LOGO */}
					<div className="flex items-center gap-3 shrink-0">
						<div className="bg-indigo-600 p-2.5 rounded-xl">
							<ImageIcon size={25} className="text-white" />
						</div>

						<div className="flex items-center gap-1">
							<span className="text-xl font-bold text-gray-900">MyPhotos</span>

							<span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">
								IA
							</span>
						</div>
					</div>

					{/* BUSCADOR POR IA */}
					<div className="flex-1 max-w-xl hidden sm:block">
						<div className="relative">
							<Search
								size={19}
								className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
							/>

							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Busca tus fotos por nombre u objetos..."
								className="w-full bg-gray-100 border border-transparent focus:border-indigo-300 focus:bg-white rounded-xl py-3 pl-11 pr-12 text-sm text-gray-800 outline-none transition-all"
							/>

							<Sparkles
								size={18}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500"
							/>
						</div>
					</div>

					{/* ACCIONES */}
					<div className="flex items-center gap-3 shrink-0">
						{/* SUBIR ARCHIVOS */}
						<button
							type="button"
							onClick={onOpenUpload}
							className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
						>
							<Upload size={18} />

							<span className="hidden sm:inline">Subir archivos</span>
						</button>

						{/* USUARIO */}
						<div className="hidden md:block text-right">
							<p className="text-sm font-semibold text-gray-800">
								{user?.name || "Usuario"}
							</p>

							<p className="text-xs text-gray-500">Mi cuenta</p>
						</div>

						{/* CERRAR SESIÓN */}
						<button
							type="button"
							onClick={handleLogout}
							title="Cerrar sesión"
							aria-label="Cerrar sesión"
							className="p-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
						>
							<LogOut size={20} />
						</button>
					</div>
				</div>

				{/* BUSCADOR PARA MÓVILES */}
				<div className="sm:hidden pb-4">
					<div className="relative">
						<Search
							size={18}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						/>

						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Buscar fotografías..."
							className="w-full bg-gray-100 border border-transparent focus:border-indigo-300 focus:bg-white rounded-xl py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none transition-all"
						/>

						<Sparkles
							size={17}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500"
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
