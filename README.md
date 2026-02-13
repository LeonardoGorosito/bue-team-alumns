# Blue Team Alumns — Frontend

Plataforma web frontend para la gestión y acceso a cursos (alumnas y panel administrativo). Este repositorio contiene la aplicación cliente construida con React + TypeScript y diseñada para integrarse con el backend (repo: `api-blue-team`).

---

##  Descripción

Aplicación de frontend que permite a las usuarias registrarse, comprar cursos y acceder al contenido, y a los administradores gestionar alumnos, ver ventas y estadísticas desde un panel (CRM).

## 🧩 Características principales

- Registro, login y gestión de perfil.
- Visualización de catálogo de cursos y detalles.
- Checkout y flujo de pagos (integrado con el backend).
- Panel administrativo para ver ventas y gestionar alumnas.
- Rutas protegidas según roles (STUDENT / ADMIN).

## 🛠️ Stack tecnológico

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form + Zod
- Axios
- Sonner (notificaciones)

## 📁 Estructura del proyecto (resumen)

```
src/
├── components/      # Componentes reutilizables
├── context/         # Contextos (ej. AuthContext)
├── lib/             # Configuraciones y utilidades (axios, payment config)
├── pages/           # Vistas principales
├── routes/          # Router y rutas protegidas
└── main.tsx         # Punto de entrada
```

## ⚡ Requisitos

- Node.js (recomendado >= 18)
- npm o pnpm

## 🔧 Instalación y ejecución (local)

1. Clonar el repositorio:

```bash
git clone <url-del-repo>
cd bue-team-alumns
```

2. Instalar dependencias:

```bash
npm install
```

3. Variables de entorno: crea un `.env` en la raíz con al menos:

```env
VITE_API_URL=http://localhost:3000/api
```

4. Iniciar en modo desarrollo:

```bash
npm run dev
```

La app por defecto estará disponible en `http://localhost:5173`.

## 📜 Scripts útiles

- `npm run dev` — iniciar servidor de desarrollo
- `npm run build` — compilar para producción
- `npm run preview` — previsualizar build
- `npm run lint` — ejecutar ESLint

## 🔁 Notas sobre API / CORS / Cookies

- La variable `VITE_API_URL` apunta al backend (por defecto `http://localhost:3000/api`).
- En `src/lib/axios.ts` la instancia usa `withCredentials: true` y añade el `Authorization: Bearer <token>` desde `localStorage` para las peticiones.
- Si usas cookies/credenciales revisa la configuración CORS del backend y asegúrate de que las URLs en Vercel y entorno local coincidan.

##  Despliegue (Vercel)

- Este frontend está pensado para desplegarse en Vercel. El archivo `vercel.json` ya contiene un rewrite para servir `index.html`.
- En Vercel debes definir la variable de ambiente `VITE_API_URL` apuntando al backend desplegado.

## 🤝 Contribuir

- Abre un issue para discutir cambios grandes.
- Crea una rama con nombre `feature/<descripción>` o `fix/<descripción>` y abre un PR cuando esté listo.

## 📞 Contacto y mantenimiento

- Repo backend relacionado: `api-blue-team` (actualizaré su README cuando me indiques).
- Para dudas o ayuda, abre un issue en este repo.

---
