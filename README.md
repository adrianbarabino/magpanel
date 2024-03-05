# MagPanel

MagPanel es una aplicación de gestión de clientes y proyectos que proporciona una interfaz web para interactuar con la API de MagPanel-Go. Está construida con Svelte y se utiliza para administrar clientes, proyectos, estados de proyectos, ubicaciones y categorías.

## Rutas de la Aplicación

La aplicación está alojada en `gestion.mag-servicios.com` y cuenta con las siguientes rutas:

### Home
- `/`: Página principal de la aplicación.

### Clients
- `/clients`: Muestra la tabla de clientes.
- `/create-client`: Formulario para crear un nuevo cliente.
- `/edit-client/:id`: Formulario para editar un cliente existente.
- `/view-client/:id`: Vista detallada de un cliente.

### Projects
- `/projects`: Muestra la tabla de proyectos.
- `/create-project`: Formulario para crear un nuevo proyecto.
- `/edit-project/:id`: Formulario para editar un proyecto existente.
- `/view-project/:id`: Vista detallada de un proyecto.

### Project Statuses
- `/project-statuses`: Muestra la tabla de estados de proyectos.
- `/create-project-status`: Formulario para crear un nuevo estado de proyecto.
- `/edit-project-status/:id`: Formulario para editar un estado de proyecto.
- `/view-project-status/:id`: Vista detallada de un estado de proyecto.

### Locations
- `/locations`: Muestra la tabla de ubicaciones.
- `/create-location`: Formulario para crear una nueva ubicación.
- `/edit-location/:id`: Formulario para editar una ubicación.
- `/view-location/:id`: Vista detallada de una ubicación.

### Categories
- `/categories`: Muestra la tabla de categorías.
- `/create-category`: Formulario para crear una nueva categoría.
- `/edit-category/:id`: Formulario para editar una categoría.
- `/view-category/:id`: Vista detallada de una categoría.

### Users
- `/users`: Muestra la tabla de usuarios.
- `/create-user`: Formulario para crear un nuevo usuario.
- `/edit-user/:id`: Formulario para editar un usuario.
- `/view-user/:id`: Vista detallada de un usuario.

### Sign In
- `/login`: Formulario de inicio de sesión.

## To-Do

### Rutas 

### Profile
- `/profile`: Vista detallada del usuario autenticado.

### Logs
- `/logs`: Vista detallada de los registros del sistema

### Datasets
- `/datasets`: Pantalla de las tablas del sistema

### Project Reports
- `/project/{id}/create-report`: Crear reporte en un proyecto
- `/project/{id}/edit-report/:id`: Formulario para editar reporte de un proyecto
- `/project/{id}/view-report/:id`: Vista de un reporte de un proyecto

### Reset Password
- `/reset-password`: Formulario para restablecer la contraseña del usuario.

### Error 404
- `/404`: Página de error 404.

### Error 500
- `/500`: Página de error 500.

### Tareas

- `Integración PWA para carga offline`: Implementar la funcionalidad para que la aplicación pueda funcionar offline utilizando las capacidades de una Progressive Web App (PWA).
- `Subida de archivos para reportes`: Desarrollar la funcionalidad para permitir a los usuarios subir archivos que se adjuntarán a los reportes.
- `Firma digital`: Implementar la capacidad de añadir una firma digital a los reportes.
- `Debugging`: Realizar la depuración de la aplicación para asegurar que todas las funcionalidades funcionen correctamente.
- `Soporte para dispositivos móviles`: Integración absoluta del sitio para móviles y tablets de distintos tamaños


## Cómo correr la aplicación

### Requisitos
- Node.js
- npm

### Pasos
1. Clonar este repositorio.
2. Instalar las dependencias con el comando `npm install`.
3. Correr la aplicación con el comando `npm run dev`.
4. La aplicación estará disponible en `http://localhost:5000`.

## Autores
- [Adrian Barabino]