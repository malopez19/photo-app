import { X, UploadCloud, FileImage } from 'lucide-react'; import toast from 'react-hot-toast';

export default function UploadModal({ isOpen, onClose }) {
    if (!isOpen) return null; 

    const handleDrop = (e) => { 
        e.preventDefault(); 
        toast.success('Archivos recibidos. Listos para subida en la Fase 4.'); 
        onClose(); 
    };
  return (
    <div>
        <div>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5"/>
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Subir Archivos</h3>
            <p className="text-xs text-slate-500 mb-6">Soporta JPG, PNG, WEBP y MP4 con etiquetado de IA automático.</p>
            <div 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={handleDrop} 
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl p-8 text-center transition-all cursor-pointer group" 
            > 
            <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform"> 
                <UploadCloud className="w-6 h-6 text-indigo-600"/>
            </div> 
            <p className="text-sm font-semibold text-slate-700">Arrastra y suelta tus archivos aquí</p> 
            <p className="text-xs text-slate-400 mt-1">o haz clic para explorar en tu dispositivo</p> 
            </div>
        </div>
    </div>
  )
}
