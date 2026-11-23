# MyPhotos – Cliente (Frontend)
Interfaz web de **MyPhotos**, una aplicación para guardar y organizar tus fotos y videos en la nube. Permite subir archivos, marcarlos como favoritos, organizarlos en álbumes, enviarlos a la papelera y buscarlos por nombre.

## Características
- Registro e inicio de sesión.
- Galería de **Fotos y Videos**.
- Sección de **Favoritos**.
- Gestión de **Álbumes** y vista de detalle de cada álbum.
- **Papelera** para restaurar o eliminar definitivamente.
- Barra de búsqueda por nombre.
- Indicador de **almacenamiento usado** (de 512 MB).
- Notificaciones con toasts y diseño responsivo.

## Tecnologías
| Área | Herramientas |
| --- | --- |
| Framework | React 19 |
| Bundler | Vite |
| Estilos | Tailwind CSS 4 |
| Rutas | React Router 7 |
| Peticiones HTTP | Axios |
| Iconos | Lucide React |
| Notificaciones | React Hot Toast |
| Calidad de código | ESLint |

## Estructura del proyecto
```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── gallery/     # Cuadrícula y tarjetas de fotos/videos
│   │   ├── layout/      # Navbar, sidebar, etc.
│   │   └── modals/      # Modales (subida, álbumes, confirmaciones)
│   ├── config/          # Configuración de Axios (api.js)
│   ├── context/         # AuthContext, AuthProvider y hook useAuth
│   ├── pages/           # AuthPage, PhotosPage, FavoritePage,
│   │                    # AlbumsPage, AlbumDetailPage, TrashPage
│   ├── services/        # mediaService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── index.html
└── vite.config.js
```

## Requisitos previos
- [Node.js](https://nodejs.org/) 20.19 o superior

## Instalación
```bash
git clone https://github.com/TU_USUARIO/my-photos-client.git
cd my-photos-client
npm install
```

## Variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts
| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con Vite |
| `npm run build` | Genera la build de producción en `dist/` |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Revisa el código con ESLint |

## Cómo ejecutar el proyecto completo

1. Levanta el backend (`npm run dev` en el repo del servidor).
2. Levanta el cliente (`npm run dev` en este repo).
3. Abre `http://localhost:5173` en el navegador.

## Licencia
Este proyecto está bajo la licencia MIT. 
