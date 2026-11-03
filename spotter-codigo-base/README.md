# Spotter 🏋️‍♂️🤝

**Spotter** es una plataforma web desarrollada como proyecto de aula en la *Fundación Universitaria Los Libertadores*. Conecta a personas que buscan compañeros de entrenamiento con objetivos, nivel y horarios compatibles, y facilita el contacto con entrenadores profesionales.

## 🔗 Enlaces del proyecto

| Recurso | Enlace |
|---|---|
| **Aplicación desplegada** | https://spotter-peach-delta.vercel.app/ |
| **API (backend)** | https://spotter-ql7f.onrender.com |
| **Documentación de la API (Swagger)** | https://spotter-ql7f.onrender.com/api/docs |
| **Repositorio** | https://github.com/Esneider2406/Spotter |
| **Plan de pruebas** | [docs/plan-de-pruebas.md](docs/plan-de-pruebas.md) |
| **Reporte de bugs** | [docs/REPORTE_BUGS.md](docs/REPORTE_BUGS.md) · [Issues](https://github.com/Esneider2406/Spotter/issues) |
| **Informe reflexivo** | [docs/INFORME_REFLEXIVO.md](docs/INFORME_REFLEXIVO.md) |
| **Video de demostración** |https://drive.google.com/file/d/1oOHLe6UgM9AWhnwI2LD1D4bq6l3tDPai/view?usp=sharing|



## 🚀 Funcionalidades del MVP

1. **Registro e inicio de sesión** con contraseñas cifradas y autenticación por token JWT.
2. **Perfil deportivo:** objetivo, nivel, tipo de entrenamiento, horarios, ciudad y biografía.
3. **Descubrimiento de personas** ordenadas por porcentaje de compatibilidad (0–100).
4. **Me gusta y Match:** el interés mutuo habilita la comunicación.
5. **Solicitud de mensaje:** un único mensaje antes del Match, con límite de 5 por día.
6. **Chat** disponible solo tras un Match o una solicitud aceptada.
7. **Perfil de entrenadores:** especialidad, años de experiencia, descripción y tarifa.
8. **Reportes** de comportamiento inapropiado; la persona reportada deja de aparecer en Descubrir.

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 18, React Router, Vite |
| Backend | Node.js, Express, JWT, bcryptjs, CORS |
| Base de datos | PostgreSQL en la nube (Neon) |
| Pruebas | Jest, Supertest |
| CI | GitHub Actions |
| Documentación de API | OpenAPI 3 + Swagger UI |
| Despliegue | Vercel (frontend) · Render (backend) · Neon (base de datos) |

## 📂 Estructura del repositorio

```
spotter-codigo-base/
├── backend/
│   ├── src/          # app, rutas, middleware, utilidades
│   ├── tests/        # pruebas con Jest
│   ├── sql/          # schema.sql
│   └── docs/         # openapi.json
├── frontend/
│   └── src/          # páginas, api.js, autenticación
├── docs/             # plan de pruebas, bugs, informe reflexivo
└── .github/          # workflow de CI y plantillas
```

## 🌿 Estrategia de ramas

- `main`: código estable y desplegado.
- `develop`: integración de nuevas funcionalidades.
- `feature/<nombre>`: una rama por funcionalidad, integrada mediante Pull Request con revisión de código.

## ⚙️ Instalación y ejecución local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Esneider2406/Spotter.git
cd Spotter/spotter-codigo-base
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # completa los valores (ver tabla abajo)
npm run db:init          # crea las tablas en la base de datos
npm run dev              # http://localhost:4000
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto 4000) |
| `DATABASE_URL` | Cadena de conexión PostgreSQL |
| `DB_SSL` | `true` si la base de datos está en la nube |
| `JWT_SECRET` | Clave larga y aleatoria para firmar tokens |
| `CORS_ORIGIN` | Origen(es) permitidos, separados por coma y **sin `/` al final** |

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:4000
npm run dev              # http://localhost:5173
```

`VITE_API_URL` es la URL del backend, **sin `/` al final**.

## 🧪 Pruebas

```bash
cd backend
npm test                   # ejecuta todas las pruebas
npm test -- --coverage     # con reporte de cobertura
```

Las pruebas cubren validaciones, reglas de chat y solicitudes, cálculo de compatibilidad y rutas básicas de la API. El plan formal de casos (ID, historia de usuario, pasos, resultado esperado y estado) está en [docs/plan-de-pruebas.md](docs/plan-de-pruebas.md). El workflow de CI ejecuta las pruebas del backend y el build del frontend en cada push y Pull Request.

## 📡 Endpoints principales

Documentación interactiva en [/api/docs](https://spotter-ql7f.onrender.com/api/docs).

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | No | Estado del servidor |
| POST | `/api/auth/registro` | No | Crear cuenta (usuario o entrenador) |
| POST | `/api/auth/login` | No | Iniciar sesión y obtener token |
| GET / PUT | `/api/perfil` | JWT | Ver o guardar el perfil deportivo |
| GET | `/api/descubrir` | JWT | Personas compatibles |
| POST | `/api/likes/{id}` | JWT | Me gusta; si es mutuo, crea el Match |
| GET / POST | `/api/solicitudes` | JWT | Ver o enviar solicitudes de mensaje |
| PUT | `/api/solicitudes/{id}` | JWT | Aceptar o rechazar una solicitud |
| GET | `/api/chat` | JWT | Contactos con los que puedo chatear |
| GET / POST | `/api/chat/{id}` | JWT | Historial y envío de mensajes |
| GET | `/api/entrenadores` | JWT | Listar entrenadores |
| PUT | `/api/entrenadores/perfil` | JWT (entrenador) | Publicar o editar perfil de entrenador |
| POST | `/api/reportes` | JWT | Reportar a un usuario |

## 🔒 Seguridad

- Contraseñas cifradas con bcrypt.
- Autenticación con JWT (expira a los 7 días) y control de acceso por rol.
- Validación de datos en el servidor.
- Secretos únicamente en variables de entorno; el archivo `.env` real no se sube al repositorio.
- CORS restringido al origen del frontend.

## 👤 Autor

**Esneider Velasco Cruz**
