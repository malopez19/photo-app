import { api } from "../config/api";

export async function getMedia(searchQuery = "") {
    const res = await api.get("/media", {
        params: {
            query: searchQuery,
        },
    });

    return res.data.media || [];
}

export async function getTrash() {
    const res = await api.get("/media/trash");

    return res.data.media || [];
}