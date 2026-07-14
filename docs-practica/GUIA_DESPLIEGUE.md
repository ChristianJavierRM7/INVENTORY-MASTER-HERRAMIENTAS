# 🚀 Guía de Despliegue Paso a Paso: La Mejor Manera para tu Práctica

Esta guía explica de forma clara y detallada la mejor y más sencilla manera de desplegar tu proyecto a internet para poder entregar el enlace en la carpeta de SharePoint.

Te presentamos las **tres mejores rutas**, ordenadas de la más fácil a la que requiere más configuraciones:
1. **Ruta 1 (La más fácil, rápida y gratuita — Recomendada):** Despliegue en **Render.com** con 1 Clic usando Blueprints.
2. **Ruta 2 (Despliegue rápido en la nube):** Despliegue en **Railway.app** configurando los directorios raíz.
3. **Ruta 3 (Requerida por la Rúbrica):** Despliegue "Self-Hosted" instalando **Coolify** en un VPS propio.

---

## 🏆 Ruta 1: Despliegue en Render.com con 1 Clic (Recomendada)

He configurado un archivo especial llamado `render.yaml` en la raíz de tu proyecto. Este archivo automatiza todo: crea la base de datos PostgreSQL, compila el backend, compila el frontend y los conecta entre sí de forma interna **sin que tengas que escribir comandos ni configurar variables a mano**.

### Paso 1: Crear cuenta en Render
1. Ve a **[https://render.com/](https://render.com/)**.
2. Regístrate o inicia sesión con tu cuenta de **GitHub**.

### Paso 2: Crear el Blueprint (Despliegue Automático)
1. En el panel principal de Render, haz clic en el botón **"New +"** (esquina superior derecha).
2. Selecciona **"Blueprint"** (en la lista desplegable).
3. Conecta tu repositorio: `ChristianJavierRM7/INVENTORY-MASTER-HERRAMIENTAS` (si no te aparece, haz clic en *"connect account"* para autorizar a Render en tu GitHub).
4. Asigna un nombre a tu grupo de servicios (por ejemplo: `inventario-herramientas`).
5. La rama debe ser `main`.
6. Haz clic en el botón **"Apply"**.

¡Eso es todo! Render leerá el archivo `render.yaml` y creará automáticamente los siguientes recursos en la capa gratuita:
* **`herramientas-db`**: Base de datos Postgres en la nube.
* **`backend-api`**: El servidor Node.js/Express.
* **`frontend-app`**: El servidor web de Nginx con tu app de React.

Una vez que el servicio `frontend-app` termine de compilar (mostrará un indicador verde de *"Live"*), haz clic sobre él para abrir tu URL pública gratuita (ej: `https://frontend-app-xxxx.onrender.com`). **¡Ese es el enlace que subirás a tu SharePoint y pondrás en el informe!**

---

## 🥈 Ruta 2: Despliegue en Railway.app (Configurando subdirectorios)

Si prefieres usar Railway, debes configurar manualmente las subcarpetas del monorepositorio en su panel web para evitar el error de Railpack:

1. **Base de Datos:** En Railway, haz clic en **New Project** -> **Provision PostgreSQL**.
2. **Servicio Backend:**
   * Agrega un nuevo servicio desde GitHub (`+ New` -> `GitHub Repo`) y selecciona tu repositorio.
   * Ve a la pestaña **Settings** (Configuración) de ese bloque y en la opción **Root Directory** escribe: `/herramientas-node-api`.
   * En la pestaña **Variables**, agrega `PORT` = `4005`, `JWT_SECRET`, y conecta las credenciales autogeneradas de la base de datos Postgres de Railway (`DB_HOST`, `DB_USER`, `DB_NAME`, etc.).
   * En **Settings** -> **Public Networking**, haz clic en **Generate Domain** (esta será la URL de tu API).
3. **Servicio Frontend:**
   * Agrega de nuevo el repositorio con `+ New` -> `GitHub Repo`.
   * En sus **Settings**, cámbiale el nombre a `frontend-app` y el **Root Directory** a: `/frontend-app`.
   * En la pestaña **Variables**, agrega: `VITE_API_URL` = (la URL de tu backend generada en el paso anterior).
   * En **Settings** -> **Public Networking**, haz clic en **Generate Domain** para obtener tu enlace de entrega.

---

## 🥉 Ruta 3: Despliegue en VPS con Coolify (La de la Rúbrica)

Si necesitas utilizar **Coolify** tal como pide la rúbrica de la práctica, debes instalarlo en un servidor VPS propio (por ejemplo, Hetzner, DigitalOcean o AWS).

1. Conéctate a tu VPS limpio por SSH (Powershell):
   ```powershell
   ssh root@ip_de_tu_servidor
   ```
2. Instala Coolify ejecutando el script oficial:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
3. Abre en tu navegador `http://<IP_DE_TU_VPS>:8000` y crea tu cuenta de administrador.
4. Conecta tu GitHub en **Sources** y crea un nuevo proyecto de tipo **Docker Compose** apuntando a tu repositorio.
5. Agrega las variables `DB_PASSWORD` y `JWT_SECRET` en el panel de variables de entorno de Coolify.
6. Asigna el dominio público al servicio `frontend-app` apuntando al puerto `80`.
7. Haz clic en **Deploy**.
