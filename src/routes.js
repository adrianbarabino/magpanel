// src/routes.js
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

const routes = {
    '/': Home,
    '/clients': ClientsTable,
    '/create-client': CreateClient,
  '/edit-client/:id': EditClient,
  '/view-client/:id': ViewClient,
  '/projects': ProjectsTable,
  '/create-project': CreateProject,
'/edit-project/:id': EditProject,
'/view-project/:id': ViewProject,
'/categories': CategoriesTable,
'/create-category': CreateCategory,
'/edit-category/:id': EditCategory,
'/view-category/:id': ViewCategory,
'/locations': LocationsTable,
'/create-location': CreateLocation,
'/edit-location/:id': EditLocation,
'/view-location/:id': ViewLocation,
'/project-statuses': ProjectStatusesTable,
'/create-project-status': CreateProjectStatus,
'/edit-project-status/:id': EditProjectStatus,
'/view-project-status/:id': ViewProjectStatus,
};

export default routes;
