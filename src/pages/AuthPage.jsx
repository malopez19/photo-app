import { useState } from "react";
import { Image, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const navigate = useNavigate();
	const handleSubmit = (e) => {
		e.preventDefault();
		toast.success(
			isLogin ? "¡Sesión iniciada con éxito!" : "¡Cuenta creada correctamente!",
		);
		navigate("/");
	};
	return (
		<div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 w-full max-w-md p-8">
				<div className="text-center mb-8">
					<div className="inline-flex bg-indigo-600 text-white p-3 rounded-2xl mb-3">
						<Image className="w-8 h-8" />
					</div>
					<h1 className="text-2xl font-bold text-slate-800">
						{isLogin ? "¡Bienvenido de nuevo!" : "Crear nueva cuenta"}
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						{isLogin
							? "Ingresa para gestionar tus fotos e IA"
							: "Comienza a organizar tus medios en la nube"}
					</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					{!isLogin && (
						<div>
							<label className="block text-xs font-semibold text-slate-600 mb-1">
								Nombre completo
							</label>
							<div className="relative">
								<User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									required
									placeholder="Juan Pérez"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
								/>
							</div>
						</div>
					)}

					<div>
						<label className="block text-xs font-semibold text-slate-600 mb-1">
							Correo electrónico
						</label>
						<div className="relative">
							<Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
							<input
								type="email"
								required
								placeholder="tu@email.com"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
							/>
						</div>
					</div>
					<div>
						<label className="block text-xs font-semibold text-slate-600 mb-1">
							Contraseña
						</label>
						<div className="relative">
							<Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
							<input
								type={showPassword ? "text" : "password"}
								required
								placeholder="••••••••"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
							>
								{showPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
					>
						<span>{isLogin ? "Iniciar Sesión" : "Registrarse"}</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</form>
				/* Alternar entre Login y Registro */
				<div className="text-center mt-6 text-xs text-slate-500">
					{isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes cuenta?"}
					<button
						onClick={() => setIsLogin(!isLogin)}
						className="text-indigo-600 font-semibold ml-1 hover:underline cursor-pointer"
					>
						{isLogin ? "Crea una aquí" : "Inicia sesión"}
					</button>
				</div>
			</div>
		</div>
	);
}
