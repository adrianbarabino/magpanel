// src/routes.js
import { writable } from 'svelte/store';

import ClientsTable from './Clients/ClientsTable.svelte';
import EditClient from './Clients/EditClient.svelte';
import CreateClient from './Clients/CreateClient.svelte';
import ViewClient from './Clients/ViewClient.svelte';

import ProvidersTable from './Providers/ProvidersTable.svelte';
import EditProvider from './Providers/EditProvider.svelte';
import CreateProvider from './Providers/CreateProvider.svelte';
import ViewProvider from './Providers/ViewProvider.svelte';

import ProjectsTable from './Projects/ProjectsTable.svelte';
import EditProject from './Projects/EditProject.svelte';
import CreateProject from './Projects/CreateProject.svelte';
import ViewProject from './Projects/ViewProject.svelte';

import ContactsTable from './Contacts/ContactsTable.svelte';
import CreateContact from './Contacts/CreateContact.svelte';
import EditContact from './Contacts/EditContact.svelte';
import ViewContact from './Contacts/ViewContact.svelte';


import CategoriesTable from './Categories/CategoriesTable.svelte';
import CreateCategory from './Categories/CreateCategory.svelte';
import EditCategory from './Categories/EditCategory.svelte';
import ViewCategory from './Categories/ViewCategory.svelte';

import LocationsTable from './Locations/LocationsTable.svelte';
import CreateLocation from './Locations/CreateLocation.svelte';
import EditLocation from './Locations/EditLocation.svelte';
import ViewLocation from './Locations/ViewLocation.svelte';

import UsersTable from './Users/UsersTable.svelte';
import CreateUser from './Users/CreateUser.svelte';
import EditUser from './Users/EditUser.svelte';
import ViewUser from './Users/ViewUser.svelte';

import CreateReport from './Projects/Reports/CreateReport.svelte';
import EditReport from './Projects/Reports/EditReport.svelte';
import ViewReport from './Projects/Reports/ViewReport.svelte';

import ProjectStatusesTable from './ProjectStatuses/ProjectStatusesTable.svelte';
import CreateProjectStatus from './ProjectStatuses/CreateProjectStatus.svelte';
import EditProjectStatus from './ProjectStatuses/EditProjectStatus.svelte';
import ViewProjectStatus from './ProjectStatuses/ViewProjectStatus.svelte';

import Home from './Pages/Home.svelte';
import Logs from './Pages/Logs.svelte';
import Datasets from './Pages/Datasets.svelte';
import Settings from './Pages/Settings.svelte';
import Login from './Auth/Login.svelte';
import Logout from './Auth/Logout.svelte';
// import NotFound from './NotFound.svelte';

// Creamos un store para almacenar el token de acceso

// Creamos un store para almacenar el token de acceso
export const accessToken = writable(localStorage.getItem('accessToken'));
export const username = writable(localStorage.getItem('username') || '');

// exportamos el username
export let darkMode = writable(localStorage.getItem('darkMode') === 'true'); // Asegura un valor booleano

darkMode.subscribe(value => {
  localStorage.setItem('darkMode', value.toString()); // Guarda como string
});
// Actualizar el username de forma reactiva
accessToken.subscribe(value => {
  if (value) {
    const token = value.split('.')[1];
    const decoded = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now) {
      localStorage.removeItem('accessToken');
      accessToken.set(null);
      username.set('');
    } else {
      localStorage.setItem('accessToken', value);
      username.set(decoded.user_name); // Esto ahora es reactivo
    }
  } else {
    localStorage.removeItem('accessToken');
    username.set('');
  }
});


// Definimos una función para verificar si el usuario está autenticado
export const isAuthenticated = () => !!accessToken;

// Definimos las rutas condicionales
const routes = {
  '/': isAuthenticated() ? Home : Login,
  '/home': isAuthenticated() ? Home : Login,
  '/login': isAuthenticated() ? Home : Login,
  '/datasets': isAuthenticated() ? Datasets : Login,
  '/settings': isAuthenticated() ? Settings : Login,
  '/logs': isAuthenticated() ? Logs : Login,
  
  '/clients': isAuthenticated() ? ClientsTable : Login,
  '/create-client': isAuthenticated() ? CreateClient : Login,
  '/edit-client/:id': isAuthenticated() ? EditClient : Login,
  '/view-client/:id': isAuthenticated() ? ViewClient : Login,

  '/providers': isAuthenticated() ? ProvidersTable : Login,
  '/create-provider': isAuthenticated() ? CreateProvider : Login,
  '/edit-provider/:id': isAuthenticated() ? EditProvider : Login,
  '/view-provider/:id': isAuthenticated() ? ViewProvider : Login,

  '/contacts': isAuthenticated() ? ContactsTable : Login,
  '/create-contact': isAuthenticated() ? CreateContact : Login,
  '/edit-contact/:id': isAuthenticated() ? EditContact : Login,
  '/view-contact/:id': isAuthenticated() ? ViewContact : Login,
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
  '/users': isAuthenticated() ? UsersTable : Login,
  '/create-user': isAuthenticated() ? CreateUser : Login,
  '/edit-user/:id': isAuthenticated() ? EditUser : Login,
  '/view-user/:id': isAuthenticated() ? ViewUser : Login,
  '/create-report/:id': isAuthenticated() ? CreateReport : Login,
  '/edit-report/:id': isAuthenticated() ? EditReport : Login,
  '/view-report/:id': isAuthenticated() ? ViewReport : Login,
  '/project-statuses': isAuthenticated() ? ProjectStatusesTable : Login,
  '/create-project-status': isAuthenticated() ? CreateProjectStatus : Login,
  '/edit-project-status/:id': isAuthenticated() ? EditProjectStatus : Login,
  '/view-project-status/:id': isAuthenticated() ? ViewProjectStatus : Login,
  '/logout': isAuthenticated() ? Logout : Login,

};

export default routes;