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

