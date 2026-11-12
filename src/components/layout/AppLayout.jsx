
import { useState } from "react";

import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UploadModal from "../modals/UploadModal";

export default function AppLayout() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Actualizar la galería después de subir archivos.
    const handleUploadSuccess = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* BARRA SUPERIOR */}
            <Navbar
                onOpenUpload={() => setIsUploadOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex">
                {/* MENÚ LATERAL */}
                <Sidebar refreshTrigger={refreshTrigger} />

                {/* PÁGINAS */}
                <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                    <Outlet
                        context={{
                            searchQuery,
                            refreshTrigger,
                            triggerRefresh: handleUploadSuccess,
                        }}
                    />
                </main>
            </div>

            {/* MODAL DE SUBIDA */}
            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    );
}
