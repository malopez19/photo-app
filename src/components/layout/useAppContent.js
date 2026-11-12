import { useOutletContext } from "react-router-dom";

// Hook para acceder al contexto compartido de AppLayout.
export function useAppContent() {
    return useOutletContext();
}
