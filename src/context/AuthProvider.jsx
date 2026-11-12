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
			const token = localStorage.getItem("token");

			if (!token) {
				setLoading(false);
				return;
			}

			try {
				const res = await api.get("/auth/me", {
					signal: controller.signal,
				});

				setUser(res.data.user);
			} catch (error) {
				if (controller.signal.aborted) return;

				// Eliminar el token únicamente si no es válido.
				if (error.response?.status === 401) {
					localStorage.removeItem("token");
				}

				console.error("Error al comprobar la sesión:", error);
				setUser(null);
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

		const { token, user: authenticatedUser } = res.data;

		if (!token || !authenticatedUser) {
			throw new Error("Respuesta de autenticación inválida.");
		}

		localStorage.setItem("token", token);
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

		const { token, user: registeredUser } = res.data;

		if (!token || !registeredUser) {
			throw new Error("Respuesta de registro inválida.");
		}

		localStorage.setItem("token", token);
		setUser(registeredUser);

		return res.data;
	};

	// Cerrar sesión.
	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
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
