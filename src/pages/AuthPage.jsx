import { useState } from "react";

import {
	Mail,
	Lock,
	User,
	Eye,
	EyeOff,
	ArrowRight,
	ImageIcon,
	Sparkles,
	Cloud,
	ShieldCheck,
} from "lucide-react";

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
		<div className="min-h-screen bg-[#050816] flex items-center justify-center p-4 lg:p-8">
			<div className="w-full max-w-362.5 min-h-195 grid lg:grid-cols-2 overflow-hidden rounded-[28px] border border-white/10 shadow-2xl">
				{/* PANEL VISUAL */}
				<section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0b1730]">
					{/* Imagen de fondo */}
					<img
						src="/images/my-photos-login1.webp"
						alt="My Photos - Galería inteligente"
						className="absolute inset-0 w-full h-full object-cover object-[72%_center] opacity-90"
					/>

					{/* Oscurecer la imagen */}
					<div className="absolute inset-0 bg-linear-to-r from-[#071326]/65 via-[#071326]/20 to-[#071326]/50" />

					<div className="absolute inset-0 bg-linear-to-t from-[#050816]/80 via-transparent to-[#050816]/20" />

					{/* Contenido superior */}
					<div className="relative z-10 p-10">
						<div className="flex items-center gap-3">
							<div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/30">
								<ImageIcon size={27} className="text-white" />
							</div>

							<span className="text-2xl font-bold text-white tracking-tight">
								My Photos
							</span>
						</div>
					</div>

					{/* Contenido inferior */}
					<div className="relative z-10 p-10 pb-12 max-w-xl">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
							<Sparkles size={14} />
							GALERÍA INTELIGENTE CON IA
						</div>

						<h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
							Tus recuerdos,
							<br />
							organizados
							<br />
							<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
								inteligentemente.
							</span>
						</h1>

						<p className="text-gray-200 text-base xl:text-lg leading-relaxed max-w-md">
							Guarda, busca y descubre tus fotografías y videos desde cualquier
							lugar con el poder de la inteligencia artificial.
						</p>

						{/* Características */}
						<div className="flex items-center gap-8 mt-10">
							<div className="flex flex-col items-center gap-2">
								<Sparkles className="text-blue-400" size={25} />
								<span className="text-white text-xs font-medium">
									Etiquetas IA
								</span>
							</div>

							<div className="flex flex-col items-center gap-2">
								<Cloud className="text-blue-400" size={25} />
								<span className="text-white text-xs font-medium">
									En la nube
								</span>
							</div>

							<div className="flex flex-col items-center gap-2">
								<ShieldCheck className="text-emerald-400" size={25} />
								<span className="text-white text-xs font-medium">Seguro</span>
							</div>
						</div>
					</div>
				</section>

				{/* PANEL DE AUTENTICACIÓN */}
				<section className="relative flex items-center justify-center bg-[#0b1120] px-6 py-12 sm:px-12 lg:px-14">
					{/* Decoración */}
					<div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 blur-[110px] rounded-full pointer-events-none" />
					<div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/10 blur-[110px] rounded-full pointer-events-none" />

					<div className="relative z-10 w-full max-w-md">
						{/* Logo móvil */}
						<div className="flex lg:hidden justify-center items-center gap-3 mb-10">
							<div className="bg-blue-600 p-3 rounded-2xl">
								<ImageIcon size={27} className="text-white" />
							</div>

							<h1 className="text-2xl font-bold text-white">My Photos</h1>
						</div>

						{/* Encabezado */}
						<div className="text-center mb-8">
							<div className="hidden lg:flex justify-center mb-7">
								<div className="bg-blue-600/15 border border-blue-500/20 p-4 rounded-2xl">
									<ImageIcon size={30} className="text-blue-400" />
								</div>
							</div>

							<h2 className="text-3xl font-bold text-white mb-3">
								{isLogin ? "¡Bienvenido de nuevo!" : "Crear nueva cuenta"}
							</h2>

							<p className="text-gray-400 text-sm">
								{isLogin
									? "Ingresa para gestionar tus fotos e IA"
									: "Comienza a organizar tus medios en la nube"}
							</p>
						</div>

						{/* Cambiar modo */}
						<div className="text-center text-sm text-gray-400 mb-8">
							{isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes cuenta?"}

							<button
								type="button"
								onClick={toggleAuthMode}
								className="ml-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
							>
								{isLogin ? "Regístrate" : "Inicia sesión"}
							</button>
						</div>

						{/* Formulario */}
						<form onSubmit={handleSubmit} className="space-y-5">
							{/* Nombre */}
							{!isLogin && (
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Nombre completo
									</label>

									<div className="relative">
										<User
											size={19}
											className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
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
											className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
										/>
									</div>
								</div>
							)}

							{/* Correo */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Correo electrónico
								</label>

								<div className="relative">
									<Mail
										size={19}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
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
										className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
									/>
								</div>
							</div>

							{/* Contraseña */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Contraseña
								</label>

								<div className="relative">
									<Lock
										size={19}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
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
										className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
									/>

									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										aria-label={
											showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
										}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
									>
										{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
									</button>
								</div>
							</div>

							{/* Botón */}
							<button
								type="submit"
								disabled={loading}
								className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-300 hover:shadow-blue-500/30 hover:-translate-y-0.5"
							>
								{loading
									? "Procesando..."
									: isLogin
										? "Iniciar sesión"
										: "Crear cuenta"}

								{!loading && <ArrowRight size={19} />}
							</button>
						</form>
					</div>
				</section>
			</div>
		</div>
	);
}
