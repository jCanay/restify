# --- ESTADIO 1: Compilación con Node LTS actualizado ---
FROM node:22-alpine AS build
WORKDIR /app

# Copiamos TODOS los archivos de empaquetado que tengas en local
COPY package*.json ./

# Usamos install estándar. Al estar en un contenedor aislado, 
# se descargará todo de cero de forma limpia y compatible con Linux Alpine.
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Compilamos la aplicación (Genera la carpeta dist/)
RUN npm run build

# --- ESTADIO 2: Servidor de Producción con Caddy ---
# ... (Tu etapa anterior de build con Node se queda exactamente igual) ...

# Etapa de producción con Nginx
FROM nginx:1.25-alpine

# Copiamos los archivos estáticos de React al directorio por defecto de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]