import { NavLink } from "react-router-dom";
import { Image, Heart, Folder, Trash2, HardDrive } from "lucide-react";

export default function Sidebar() {
	const menuItems = [
		{ label: "Fotos y Videos", icon: Image, path: "/" },
		{ label: "Favoritos", icon: Heart, path: "/favorites" },
		{ label: "Álbumes", icon: Folder, path: "/albums" },
		{ label: "Papelera", icon: Trash2, path: "/trash" },
	];
	return (
		<aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-4 select-none">
			<nav className="space-y-1">
				{menuItems.map((item) => {
					const Icon = item.icon;
					return (
						<NavLink
							key={item.path}
							to={item.path}
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
									isActive
										? "bg-indigo-50 text-indigo-600"
										: "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
								}`
							}
						>
							<Icon className="w-5 h-5" />
							<span>{item.label}</span>
						</NavLink>
					);
				})}
			</nav>
			<div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
				<div className="flex items-center gap-2 text-slate-700 font-semibold text-xs mb-2">
					<HardDrive className="w-4 h-4 text-indigo-600" />
					<span>Almacenamiento en nube</span>
				</div>
				<div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
					<div className="bg-indigo-600 h-full w-[35%] rounded-full transition-all"></div>
				</div>
				<p className="text-xs text-slate-500">
					<strong className="text-slate-800">3.5 GB</strong> de 10 GB usados
				</p>
			</div>
		</aside>
	);
}
