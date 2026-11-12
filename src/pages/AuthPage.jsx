import { useState } from "react";

import { Image, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);

	const { login, register } = useAuth();
	const navigate = useNavigate();

	// Actualizar los campos del formulario.
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Iniciar sesión o registrar usuario.
	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);

		try {
			if (isLogin) {
				await login(formData.email, formData.password);
				toast.success("¡Bienvenido de nuevo!");
			} else {
				await register(formData.name, formData.email, formData.password);

				toast.success("¡Cuenta registrada con éxito!");
			}

			navigate("/");
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Error en la autenticación.",
			);
		} finally {
			setLoading(false);
		}
	};

	// Cambiar entre inicio de sesión y registro.
	const toggleAuthMode = () => {
		setIsLogin(!isLogin);
		setShowPassword(false);

		setFormData({
			name: "",
			email: "",
			password: "",
		});
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-10">
			<div className="w-full max-w-md">
				{/* LOGO */}
				<div className="flex justify-center mb-8">
					<div className="flex items-center gap-3">
						<div className="bg-blue-600 p-3 rounded-2xl">
							<Image size={28} className="text-white" />
						</div>

						<h1 className="text-3xl font-bold text-white">My Photos</h1>
					</div>
				</div>

				{/* FORMULARIO */}
				<div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-white mb-2">
							{isLogin ? "¡Bienvenido de nuevo!" : "Crear nueva cuenta"}
						</h2>

						<p className="text-gray-400 text-sm">
							{isLogin
								? "Ingresa para gestionar tus fotos e IA"
								: "Comienza a organizar tus medios en la nube"}
						</p>
					</div>

					{/* CAMBIAR MODO */}
					<div className="text-center text-sm text-gray-400 mb-6">
						{isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes cuenta?"}

						<button
							type="button"
							onClick={toggleAuthMode}
							className="ml-2 text-blue-400 hover:text-blue-300 font-semibold"
						>
							{isLogin ? "Regístrate" : "Inicia sesión"}
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* NOMBRE */}
						{!isLogin && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Nombre completo
								</label>

								<div className="relative">
									<User
										size={19}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
									/>

									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										placeholder="Tu nombre"
										minLength={2}
										maxLength={80}
										autoComplete="name"
										required
										className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									/>
								</div>
							</div>
						)}

						{/* CORREO */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Correo electrónico
							</label>

							<div className="relative">
								<Mail
									size={19}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
								/>

								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="correo@ejemplo.com"
									maxLength={254}
									autoComplete="email"
									required
									className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>
						</div>

						{/* CONTRASEÑA */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Contraseña
							</label>

							<div className="relative">
								<Lock
									size={19}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
								/>

								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Ingresa tu contraseña"
									minLength={isLogin ? undefined : 8}
									maxLength={72}
									autoComplete={isLogin ? "current-password" : "new-password"}
									required
									className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-11 pr-12 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>

								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
									aria-label={
										showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
									}
								>
									{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
								</button>
							</div>
						</div>

						{/* BOTÓN */}
						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
						>
							{loading
								? "Procesando..."
								: isLogin
									? "Iniciar sesión"
									: "Crear cuenta"}

							{!loading && <ArrowRight size={19} />}
						</button>
					</form>

					{/* PIE */}
					<p className="text-center text-gray-500 text-xs mt-8">
						My Photos © {new Date().getFullYear()}. Todos los derechos
						reservados.
					</p>
				</div>
			</div>
		</div>
	);
}
