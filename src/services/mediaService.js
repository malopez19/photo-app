import { api } from "../config/api";

// Obtener fotografías y vídeos del usuario autenticado.
export async function getMedia(searchQuery = "") {
	const query = searchQuery.trim();

	const response = await api.get("/media", {
		params: query ? { query } : {},
	});

	const media = response.data?.media;

	return Array.isArray(media) ? media : [];
}

// Obtener archivos de la papelera.
export async function getTrash() {
	const response = await api.get("/media/trash");

	const media = response.data?.media;

	return Array.isArray(media) ? media : [];
}
