# MANUAL DE INSTALACIÓN
Este manual describe los requisitos y pasos necesarios para clonar, configurar y desplegar la plataforma Restify en un entorno local o de producción (VPS) utilizando Docker y Nginx como proxy inverso seguro.

## Requisitos previos
Antes de comenzar, es necesario asegurarse de que el siguiente software está instalado en la máquina de destino:

- **Git**: Para la clonación del repositorio.
- **Docker Desktop** (en Windows/macOS) o **Docker Engine** + **Docker Compose** (en Linux/Ubuntu).
- **Puertos Libres**: Los puertos `80` (HTTP) y `443` (HTTPS) deben estar disponibles en la máquina host.

---

## Instalación y despliegue

### 1. Clonar el repositorio
En primer lugar, se debe abrir la terminal y clonar el repositorio de GitHub en la máquina de destino:

```bash
git clone https://github.com/jCanay/restify
cd restify
```
Si el proyecto ya ha sido clonado previamente y se desea desplegar la última versión, se deben traer los cambios de la rama principal:
```bash
cd restify
git pull origin main
```

Una vez ejecutado este paso, se creará la estructura de directorios del proyecto:
```
restify/
├── backend/            # Código fuente de Spring Boot & Dockerfile
├── frontend/           # Código fuente de React (Vite) & Dockerfile
├── certs/              # Carpeta para certificados SSL (Opcional)
├── .env                # Archivo general de variables (A crear)
└── docker-compose.yml  # Orquestador de los contenedores
```

### 2. Crear el Archivo de Variables de Entorno
Una vez dentro de la raíz del proyecto `restify/`, se debe crear un archivo llamado `.env`. Este archivo centraliza las variables para todos los servicios (frontend, backend y base de datos). El contenido debe seguir esta estructura:

```env
DB_NAME=db_name
DB_USERNAME=db_username
DB_PASSWORD=db_password
DB_ROOT_PASSWORD=db_root_password

JWT_SECRET=jwt_secret

INITIAL_ADMIN_USERNAME=initial_admin_username
INITIAL_ADMIN_PASSWORD=initial_admin_password
INITIAL_ADMIN_EMAIL=initial@admin.email

MAPTILER_KEY=maptiler_key
```

### 3. Configurar los Certificados SSL (Opcional para Local / Obligatorio para Producción)
La gestión de certificados varía según el entorno de despliegue:

- **Despliegue en Local** (localhost): Este paso es opcional. Si no se dispone de certificados, Nginx funcionará de forma nativa a través del puerto HTTP `80`.
- **Despliegue en Producción** (Dominio real): Es obligatorio introducir los certificados SSL emitidos para el dominio en la carpeta `./certs/`. Los archivos deben nombrarse estrictamente de la siguiente manera:
  - `restify.crt`
  - `restify.key`

### 4. Limpiar el Entorno Docker (Recomendado)
Para asegurar una instalación limpia y evitar conflictos con residuos de ejecuciones anteriores, se aconseja ejecutar:
```bash
docker-compose down --remove-orphans
docker system prune -f
```
### 3. Construcción y Lanzamiento
Para compilar el código de los submódulos y levantar la infraestructura completa en segundo plano, se ejecuta el siguiente comando:
```bash
docker-compose up -d --build --force-recreate
```

---

## Configuración Interna de Nginx
El servidor Nginx se encarga de gestionar el tráfico y actuar como proxy inverso. La configuración interna del contenedor (localizada en `frontend/nginx.conf`) procesa las solicitudes de la siguiente manera:

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name localhost restify.plexios.es;

    # Rutas a los certificados (Nginx ignorará fallos en local si no se accede por HTTPS)
    ssl_certificate /etc/nginx/certs/restify.crt;
    ssl_certificate_key /etc/nginx/certs/restify.key;

    # Servir archivos estáticos del Frontend (React)
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy Inverso hacia el Backend (Spring Boot)
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Verificación del Estado
Para comprobar que todos los componentes de Restify están operando correctamente, se ejecuta el comando:

```bash
docker-compose ps
```
Se debe verificar que los tres contenedores principales se encuentran en estado Up:
1. `restify-frontend` (Escuchando peticiones externas en los puertos `80` y `443`).
2. `restify-backend` (Operando en la red interna en el puerto `8080`).
3. `restify-db` (Operando en la red interna en el puerto `3306`).

#### Prueba de Disponibilidad del API
El correcto funcionamiento del proxy inverso se puede validar enviando una solicitud de autenticación desde la terminal:

```bash
curl -k -i -X POST https://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"password"}'
```

La recepción de un encabezado `HTTP/1.1 200 OK` (o un error de credenciales devuelto por Spring Boot) confirmará que el flujo de red se ha completado con éxito.