# Etapa 1: Compilación de la aplicación con Bun
FROM oven/bun:1.1-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copiar todo el código del frontend y generar la build de producción
COPY . .
RUN bun run build

# Etapa 2: Servidor Nginx para producción
FROM nginx:1.25-alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos compilados por Bun (por defecto Vite compila en la carpeta 'dist')
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]