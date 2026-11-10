import { useState } from "react";
import PhotoGrid from "../components/gallery/PhotoGrid";
import PhotoLightbox from "../components/modals/PhotoLightbox";
import BulkSelectionBar from "../components/gallery/BulkSelectionBar";
import toast from "react-hot-toast";

const MOCK_GROUPS = [
	{
		date: "Hoy - 09 Nov 2026",
		items: [
			{
				id: "1",
				name: "Atardecer Playa.jpg",
				url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
				type: "image",
				isFavorite: true,
				tags: ["Playa", "Atardecer", "Océano"],
			},
			{
				id: "2",
				name: "Paseo en Montaña.jpg",
				url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
				type: "image",
				isFavorite: false,
				tags: ["Montaña", "Naturaleza"],
			},
		],
	},
	{
		date: "Ayer - 08 Nov 2026",
		items: [
			{
				id: "3",
				name: "Café Mañanero.jpg",
				url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
				type: "image",
				isFavorite: false,
				tags: ["Café", "Estilo de vida"],
			},
		],
	},
	{
		date: "Ayer - 08 Nov 2026",
		items: [
			{
				id: "3",
				name: "Mexico.jpg",
				url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
				type: "image",
				isFavorite: false,
				tags: ["Pais", "Sur america"],
			},
		],
	},
];

export default function PhotosPage() {
	const [selectedIds, setSelectedIds] = useState([]);
	const [activeMedia, setActiveMedia] = useState(null);

	const handleToggleSelect = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
		);
	};
  
	const handleToggleFavorite = (id) => {
		toast.success("Estado de favorito actualizado");
	};

	return (
		<div>
			<PhotoGrid
				groups={MOCK_GROUPS}
				selectedIds={selectedIds}
				onToggleSelect={handleToggleSelect}
				onSelectMedia={(media) => setActiveMedia(media)}
				onToggleFavorite={handleToggleFavorite}
			/>
			<BulkSelectionBar
				selectedCount={selectedIds.length}
				onClear={() => setSelectedIds([])}
				onFavorite={() => {}}
				onDelete={() => {}}
			/>
			<PhotoLightbox
				media={activeMedia}
				onClose={() => setActiveMedia(null)}
				onNext={() => {}}
				onPrev={() => {}}
				onToggleFavorite={handleToggleFavorite}
				onDelete={() => toast.error("Eliminado")}
			/>
		</div>
	);
}
