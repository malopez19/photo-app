import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Interceptor para adjuntar automáticamente el JWT.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);
