# Restify 🍽️

![Status](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow?style=for-the-badge)
[![SpringBoot](https://img.shields.io/badge/Backend-Spring_Boot-6db33f?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React-07d8fd?style=for-the-badge&logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-00608a?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

> **Sistema de Planificación de Recursos (ERP) y Panel de Control para Restaurantes Modernos.**

Restify es una solución integral diseñada para gestionar las operaciones diarias de un restaurante, desde la administración de reservas y pedidos hasta el control de personal y analíticas en tiempo real.

---

## 🚀 Características Principales

* **Panel de Control Dinámico**: Interfaz modular basada en widgets con persistencia de diseño en `localStorage` mediante `react-grid-layout`.
* **Control de Acceso Basado en Roles (RBAC)**: Sistema de seguridad robusto con diferentes niveles de acceso (**ADMIN**, **STAFF**, **MANAGER**).
* **Gestión en Tiempo Real**: Control centralizado de reservas, comandas y catálogo de productos.
* **Autenticación Segura**: Implementación de JWT (JSON Web Tokens) con sistema de **Tokens de Refresco** y rotación de sesión (Token Rotation).

---

## 🎯 Objetivos del Proyecto

El objetivo principal de **Restify** es proporcionar una plataforma centralizada y eficiente para la gestión operativa de restaurantes, eliminando la fricción entre la toma de datos y la ejecución de tareas.


### 1. Objetivos Generales
* **Centralización Operativa**: Unificar en un solo lugar la gestión de reservas, personal, inventario y ventas.
* **Escalabilidad**: Diseñar una arquitectura modular que permita añadir nuevos módulos (como gestión de proveedores o facturación) sin afectar al núcleo del sistema.
* **Experiencia de Usuario (UX)**: Ofrecer una interfaz intuitiva y personalizable que reduzca la curva de aprendizaje de los empleados.

### 2. Objetivos del Cliente (Experiencia Online)
* **Autogestión de Reservas**: Permitir a los usuarios finales reservar mesa de forma intuitiva, con confirmación inmediata y gestión de disponibilidad en tiempo real.
* **Pedidos Online Seguros**: Facilitar la realización de pedidos para recoger o a domicilio, con un flujo de autenticación transparente y seguro.
* **Historial de Usuario**: Proporcionar a los clientes un panel personal para consultar sus reservas pasadas y el estado de sus pedidos actuales.
  
### 3. Objetivos Técnicos
* **Seguridad Robusta**: Implementar un sistema de autenticación de dos niveles (JWT + Refresh Token) para garantizar la integridad de los datos sensibles del negocio.
* **Interfaz Dinámica**: Desarrollar un panel de control (Dashboard) 100% personalizable mediante "drag-and-drop", permitiendo a cada usuario ver solo la información relevante para su rol.
* **Despliegue Moderno**: Facilitar el despliegue y mantenimiento mediante la containerización total con **Docker**, asegurando que el sistema funcione igual en desarrollo que en producción.
* **Persistencia Inteligente**: Garantizar que las preferencias de diseño del usuario y el estado de la aplicación se mantengan consistentes entre sesiones.

### 4. Objetivos de Negocio (Sector Restauración)
* **Optimización de Reservas**: Reducir el tiempo de gestión de mesas y evitar el solapamiento de horarios.
* **Control de Personal**: Segmentar el acceso a la información según el cargo (Admin, Staff, Manager) para proteger datos críticos.
* **Analíticas en Tiempo Real**: Visualizar métricas clave (KPIs) mediante widgets para facilitar la toma de decisiones rápidas basadas en datos reales.
* **Reducción de Errores**: Digitalizar el flujo de comandas y pedidos para minimizar fallos humanos en la comunicación entre sala y cocina.

--- 

## 🏗️ Arquitectura y Stack Tecnológico

### Backend (Spring Boot 3.x)
* **Spring Security**: Configuración de seguridad sin estado (stateless).
* **JWT y Refresh Token**: Autenticación persistente y segura utilizando la librería `io.jsonwebtoken`.
* **Spring Data JPA**: Gestión de persistencia sobre base de datos relacional (MySQL/PostgreSQL).
* **Lombok**: Reducción de código repetitivo en entidades y objetos de transferencia de datos (DTOs).

### Frontend (React 18+)
* **React-Grid-Layout**: Motor de diseño responsivo con funciones de "arrastrar y soltar" para el panel de control.
* **Nanostores**: Gestión de estado ligera, modular y reactiva.
* **Axios**: Cliente HTTP con **interceptores** para la inyección automática del token y manejo de errores 401 (Refresco automático).
* **Lucide React**: Conjunto de iconos vectoriales optimizados.

---

## 🔐 Flujo de Seguridad (JWT + Refresh Token)

El sistema utiliza un flujo de autenticación de dos niveles para maximizar la seguridad y la experiencia del usuario:

1.  **Token de Acceso (Access Token)**: JWT con vida corta (ej. 15 min) que se envía en la cabecera `Authorization: Bearer <token>`. Contiene los roles del usuario en sus declaraciones (claims).
2.  **Token de Refresco (Refresh Token)**: Identificador único (UUID) almacenado en la base de datos y vinculado al usuario. Permite solicitar un nuevo Token de Acceso cuando este expira sin que el usuario deba iniciar sesión nuevamente.
3.  **Rotación de Tokens**: Cada vez que se solicita un nuevo Token de Acceso, el sistema puede invalidar el Token de Refresco anterior y emitir uno nuevo para prevenir ataques de interceptación.

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
* JDK 17 o superior
* Node.js 18 o superior
* Maven 3.6 o superior

---

## 📂 Estructura del Proyecto

```
./
├── backend/                          # Backend en Spring Boot (Java)
│   └── src/
│       ├── java/org/canay/backend
│       │   ├── config                # Configuración de la aplicación (Beans, etc)
│       │   ├── controller            # Controllers RESTfull
│       │   ├── domain                # Entidades DAOs y DTOs
│       │   ├── exceptions            # Excepciones personalizadas
│       │   ├── jwt                   # Configuración del JWT
│       │   ├── mappers               # Mapeadores de entidades
│       │   ├── repository            # Repositorios de los DAOs
│       │   ├── security              # Configuración de Spring Security (Autenticación y Autorización)
│       │   ├── service               # Servicios
│       │   └── utils                 # Utilidades
│       │
│       └── resources/                # Recursos de Spring Boot      
│
└── frontend/                         # Frontend en React (JavaScript, HTML, CSS)
    └── src/
        ├── assets                    # Assets de la aplicación
        ├── components                # Componentes de Shadcn
        └── modules                   # Modulos de la aplicación
            ├── auth                  # Módulo de authenticación y autorización
            ├── core                  # Módulo principal
            ├── dashboard             # Módulo del panel de control
            └── setup                 # Módulo de inicialización de cuentas
```

---

## 🐳 Despliegue con Docker (Recomendado)

Esta es la forma más rápida de levantar todo el entorno de **Restify**.

### 1. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```bash
DB_NAME=db_name
DB_USERNAME=db_username
DB_PASSWORD=db_password
DB_ROOT_PASSWORD=db_root_password
INITIAL_ADMIN_USERNAME=initial_admin_username
INITIAL_ADMIN_PASSWORD=initial_admin_password
INITIAL_ADMIN_EMAIL=initial@admin.email
JWT_SECRET=jwt_secret
```
### 2. Levantar la infraestructura
Ejecuta el siguiente comando para construir la imagen del backend y levantar la base de datos:

```bash
docker-compose up --build
```
El comando realizará lo siguiente:
* Levantará MySQL 8.0 y ejecutará los scripts de ./init.
* Realizará un Multi-stage build del backend (compilación en Maven + ejecución en JRE ligero).
* Configurará la red interna backend-net para la comunicación segura entre servicios.

---

## 🛠️ Instalación Manual (Desarrollo)
### Backend
1. `cd backend`

2. Configura los datos del `.env`.

3. `mvn spring-boot:run`

### Frontend
1. `cd frontend`

2. `npm install`

3. `npm run dev` (Disponible en `http://localhost:8000`)

## 📝 Licencia
Distribuido bajo la licencia Apache License 2.0. Consulta el archivo `LICENSE` para más información.