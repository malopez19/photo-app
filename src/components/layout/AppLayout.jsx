import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
//import UploadModal from "../modals/UploadModal";

export default function AppLayout() {
	const [isUploadOpen, setIsUploadOpen] = useState(false);
	return (
		<div className="min-h-screen flex flex-col bg-slate-50">
			<Navbar onOpenUpload={() => setIsUploadOpen(true)} />
			<div className="flex flex-1 overflow-hidden">
				<Sidebar />
				<main className="app-main-content">
					<Outlet />
				</main> 
			</div>
			{/* <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} /> */}
		</div>
	);
}
