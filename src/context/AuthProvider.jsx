import { useState, useEffect } from "react";

import { api } from "../config/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Comprobar la sesión al cargar la aplicación.
	useEffect(() => {
		const controller = new AbortController();

		const checkAuth = async () => {
			try {
				const res = await api.get("/auth/me", {
					signal: controller.signal,
				});

				setUser(res.data.user ?? null);
			} catch (error) {
				if (controller.signal.aborted) return;

				setUser(null);

				if (error.response?.status !== 401) {
					console.error("Error al comprobar la sesión:", error);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		};

		checkAuth();

		return () => {
			controller.abort();
		};
	}, []);

	// Iniciar sesión.
	const login = async (email, password) => {
		const res = await api.post("/auth/login", {
			email,
			password,
		});

		const authenticatedUser = res.data.user;

		if (!authenticatedUser) {
			throw new Error("Respuesta de autenticación inválida.");
		}

		setUser(authenticatedUser);

		return res.data;
	};

	// Registrar usuario.
	const register = async (name, email, password) => {
		const res = await api.post("/auth/register", {
			name,
			email,
			password,
		});

		const registeredUser = res.data.user;

		if (!registeredUser) {
			throw new Error("Respuesta de registro inválida.");
		}

		setUser(registeredUser);

		return res.data;
	};

	// Cerrar sesión.
	const logout = async () => {
		try {
			await api.post("/auth/logout");
		} finally {
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				register,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
