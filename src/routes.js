// src/routes.js
import { writable } from 'svelte/store';

import ClientsTable from './Clients/ClientsTable.svelte';
import EditClient from './Clients/EditClient.svelte';
import CreateClient from './Clients/CreateClient.svelte';
import ViewClient from './Clients/ViewClient.svelte';
import ProjectsTable from './Projects/ProjectsTable.svelte';
import EditProject from './Projects/EditProject.svelte';
import CreateProject from './Projects/CreateProject.svelte';
import ViewProject from './Projects/ViewProject.svelte';

import CategoriesTable from './Categories/CategoriesTable.svelte';
import CreateCategory from './Categories/CreateCategory.svelte';
import EditCategory from './Categories/EditCategory.svelte';
import ViewCategory from './Categories/ViewCategory.svelte';

import LocationsTable from './Locations/LocationsTable.svelte';
import CreateLocation from './Locations/CreateLocation.svelte';
import EditLocation from './Locations/EditLocation.svelte';
import ViewLocation from './Locations/ViewLocation.svelte';

import ProjectStatusesTable from './ProjectStatuses/ProjectStatusesTable.svelte';
  import CreateProjectStatus from './ProjectStatuses/CreateProjectStatus.svelte';
  import EditProjectStatus from './ProjectStatuses/EditProjectStatus.svelte';
  import ViewProjectStatus from './ProjectStatuses/ViewProjectStatus.svelte';

  import Home from './Home.svelte';
  import Login from './Login.svelte';

// Creamos un store para almacenar el token de acceso
const accessToken = writable(localStorage.getItem('accessToken'));

// Definimos una función para verificar si el usuario está autenticado
const isAuthenticated = () => !!$accessToken;

// Definimos las rutas condicionales
const routes = {
  '/': isAuthenticated() ? Home : Login,
  '/home': isAuthenticated() ? Home : Login,
  '/clients': isAuthenticated() ? ClientsTable : Login,
  '/create-client': isAuthenticated() ? CreateClient : Login,
  '/edit-client/:id': isAuthenticated() ? EditClient : Login,
  '/view-client/:id': isAuthenticated() ? ViewClient : Login,
  '/projects': isAuthenticated() ? ProjectsTable : Login,
  '/create-project': isAuthenticated() ? CreateProject : Login,
  '/edit-project/:id': isAuthenticated() ? EditProject : Login,
  '/view-project/:id': isAuthenticated() ? ViewProject : Login,
  '/categories': isAuthenticated() ? CategoriesTable : Login,
  '/create-category': isAuthenticated() ? CreateCategory : Login,
  '/edit-category/:id': isAuthenticated() ? EditCategory : Login,
  '/view-category/:id': isAuthenticated() ? ViewCategory : Login,
  '/locations': isAuthenticated() ? LocationsTable : Login,
  '/create-location': isAuthenticated() ? CreateLocation : Login,
  '/edit-location/:id': isAuthenticated() ? EditLocation : Login,
  '/view-location/:id': isAuthenticated() ? ViewLocation : Login,
  '/project-statuses': isAuthenticated() ? ProjectStatusesTable : Login,
  '/create-project-status': isAuthenticated() ? CreateProjectStatus : Login,
  '/edit-project-status/:id': isAuthenticated() ? EditProjectStatus : Login,
  '/view-project-status/:id': isAuthenticated() ? ViewProjectStatus : Login,
  '/logout': {
    // Cuando el usuario navega a '/logout', ejecutamos esta función
    on: {
      // Redireccionamos al usuario a la página de inicio de sesión
      // y eliminamos el token de acceso del almacenamiento local
      click: () => {
        localStorage.removeItem('accessToken');
        isAuthenticated.set(false);
      }
    }
  }
};

export default routes;