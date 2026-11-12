
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Image,
    Heart,
    Folder,
    Trash2,
    HardDrive,
} from "lucide-react";
import { api } from "../../config/api";

export default function Sidebar({ refreshTrigger }) {
    const [stats, setStats] = useState({
        totalBytes: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/media/stats");
                setStats(res.data);
            } catch (error) {
                console.error(
                    "Error al cargar estadísticas:",
                    error
                );
            }
        };

        fetchStats();
    }, [refreshTrigger]);

    const totalBytes = Number(stats.totalBytes) || 0;

    const usedMB = (totalBytes / (1024 * 1024)).toFixed(1);

    const totalStorage = 10 * 1024 * 1024 * 1024;

    const percent = Math.min(
        (totalBytes / totalStorage) * 100,
        100
    ).toFixed(1);

    const menuItems = [
        {
            label: "Fotos y Videos",
            icon: Image,
            path: "/",
        },
        {
            label: "Favoritos",
            icon: Heart,
            path: "/favorites",
        },
        {
            label: "Álbumes",
            icon: Folder,
            path: "/albums",
        },
        {
            label: "Papelera",
            icon: Trash2,
            path: "/trash",
        },
    ];

    return (
        <aside className="hidden min-h-[calc(100vh-64px)] w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-4 md:flex">
            {/* Navegación */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Estadísticas de almacenamiento */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                    <HardDrive
                        size={18}
                        className="text-gray-600"
                    />

                    <h3 className="text-sm font-semibold text-gray-800">
                        Almacenamiento
                    </h3>
                </div>

                <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{
                            width: `${percent}%`,
                        }}
                    />
                </div>

                <p className="text-xs text-gray-500">
                    <strong className="text-gray-800">
                        {usedMB} MB
                    </strong>{" "}
                    de 10 GB usados
                </p>

                <p className="mt-1 text-xs text-gray-400">
                    {percent}% del espacio utilizado
                </p>
            </div>
        </aside>
    );
}
