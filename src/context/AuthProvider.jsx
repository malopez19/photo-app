import { useState, useEffect } from "react";

import { api } from "../config/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Comprobar el token guardado al cargar la aplicación.
	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("token");

			if (token) {
				try {
					const res = await api.get("/auth/me");
					setUser(res.data.user);
				} catch {
					localStorage.removeItem("token");
					setUser(null);
				}
			}

			setLoading(false);
		};

		checkAuth();
	}, []);

	// Iniciar sesión.
	const login = async (email, password) => {
		const res = await api.post("/auth/login", {
			email,
			password,
		});

		localStorage.setItem("token", res.data.token);
		setUser(res.data.user);

		return res.data;
	};

	// Registrar usuario.
	const register = async (name, email, password) => {
		const res = await api.post("/auth/register", {
			name,
			email,
			password,
		});

		localStorage.setItem("token", res.data.token);
		setUser(res.data.user);

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
