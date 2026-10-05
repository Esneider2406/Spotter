# Spotter 🏋️‍♂️🤝

**Spotter** es una plataforma digital desarrollada como proyecto de aula para la *Fundación Universitaria Los Libertadores*. Su objetivo principal es conectar a personas que buscan compañeros de entrenamiento con intereses, horarios y objetivos compatibles, además de facilitar el descubrimiento y contratación de entrenadores profesionales[cite: 8].

---

## 🚀 Descripción del Proyecto (MVP)
En esta Fase 2 ("De la nube a la práctica"), se ha construido el Producto Mínimo Viable (MVP) funcional de Spotter, abarcando tanto el desarrollo del backend, frontend, conexión a base de datos en la nube y su respectivo despliegue público[cite: 1, 3].

### Funcionalidades Principales del MVP:
1. **Registro de Usuarios:** Creación de cuentas seguras e inicio de sesión[cite: 8].
2. **Perfil Deportivo:** Gestión de información personalizada (objetivos, nivel de entrenamiento y horarios disponibles)[cite: 8].
3. **Descubrimiento de Personas:** Visualización de perfiles compatibles para entrenar[cite: 8].
4. **Me gusta y Match:** Sistema de interés mutuo que activa canales de comunicación[cite: 8].
5. **Solicitud de Mensaje:** Opción para enviar un único mensaje directo para llamar la atención antes de hacer *Match* (con restricciones de control para evitar abusos)[cite: 8].
6. **Chat:** Conversación habilitada exclusivamente tras un *Match* exitoso o una solicitud aceptada[cite: 8].
7. **Perfil de Entrenadores:** Espacio para que profesionales del fitness publiquen sus servicios, experiencia y tarifas[cite: 8].

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** *(Ej. React / Vue / HTML, CSS y JavaScript)*[cite: 2, 3]
* **Backend:** *(Ej. Node.js con Express / Python con Flask o Django)*[cite: 2, 3]
* **Base de Datos:** *(Ej. MongoDB Atlas / PostgreSQL / Firebase)*[cite: 2, 3]
* **Control de Versiones:** Git, GitHub / GitLab
* **Despliegue (Cloud):** *(Ej. Vercel para frontend y Render/Railway para backend)*[cite: 5, 6]

---

## 📂 Estructura de Ramas del Repositorio

El proyecto maneja la siguiente estrategia de control de versiones:
* `main`: Rama principal con el código estable listo para producción[cite: 2].
* `develop`: Rama de integración para las nuevas funcionalidades[cite: 2].
* `feature/[nombre-funcionalidad]`: Ramas individuales de trabajo para cada historia de usuario (ej. `feature/registro-usuarios`, `feature/chat`)[cite: 2].

---

## ⚙️ Instrucciones de Instalación y Ejecución Local

Si deseas clonar y probar el proyecto en tu máquina local, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/spotter.git](https://github.com/tu-usuario/spotter.git)
cd spotter
