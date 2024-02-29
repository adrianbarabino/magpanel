
<script>
  import { Router, Route, Link } from 'svelte-routing';
  import { writable } from 'svelte/store';

  // Creamos un store para almacenar el token de acceso y los datos del usuario
  const accessToken = writable(localStorage.getItem('accessToken'));
  const name = writable(JSON.parse(localStorage.getItem('name')));

  import ClientsTable from './Clients/ClientsTable.svelte';
  import CreateClient from './Clients/CreateClient.svelte';
  import EditClient from './Clients/EditClient.svelte';
  import ViewClient from './Clients/ViewClient.svelte';
  
  import ProjectsTable from './Projects/ProjectsTable.svelte';
  import CreateProject from './Projects/CreateProject.svelte';
  import EditProject from './Projects/EditProject.svelte';
  import ViewProject from './Projects/ViewProject.svelte';
  
  import CategoriesTable from './Categories/CategoriesTable.svelte';
  import CreateCategory from './Categories/CreateCategory.svelte';
  import EditCategory from './Categories/EditCategory.svelte';
  import ViewCategory from './Categories/ViewCategory.svelte';
  
  import ProjectStatusesTable from './ProjectStatuses/ProjectStatusesTable.svelte';
  import CreateProjectStatus from './ProjectStatuses/CreateProjectStatus.svelte';
  import EditProjectStatus from './ProjectStatuses/EditProjectStatus.svelte';
  import ViewProjectStatus from './ProjectStatuses/ViewProjectStatus.svelte';

  
  import LocationsTable from './Locations/LocationsTable.svelte';
  import CreateLocation from './Locations/CreateLocation.svelte';
  import EditLocation from './Locations/EditLocation.svelte';
  import ViewLocation from './Locations/ViewLocation.svelte';

    import Sidebar from './Sidebar.svelte';
    // Componente Login
  import Login from './Login.svelte';
  // Componente Home
    import Home from './Home.svelte';
    import Navbar from './Navbar.svelte';

</script>

<Router>
		<div class="wrapper d-flex align-items-stretch">

  <Sidebar/>
	<div id="content" class="p-4 p-md-5 mt-5">
  <Navbar/>

  <main>
    {#if $accessToken}
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
  
      <Route path="/clients" component={ClientsTable} />
      <Route path="create-client" component={CreateClient} />
      <Route path="edit-client/:id" component={EditClient} />
      <Route path="view-client/:id" component={ViewClient} />
      <Route path="/projects" component={ProjectsTable} />
      <Route path="create-project" component={CreateProject} />
      <Route path="edit-project/:id" component={EditProject} />
      <Route path="view-project/:id" component={ViewProject} />
      <Route path="/categories" component={CategoriesTable} />
      <Route path="create-category" component={CreateCategory} />
      <Route path="edit-category/:id" component={EditCategory} />
      <Route path="view-category/:id" component={ViewCategory} />
      <Route path="/locations" component={LocationsTable} />
      <Route path="create-location" component={CreateLocation} />
      <Route path="edit-location/:id" component={EditLocation} />
      <Route path="view-location/:id" component={ViewLocation} />
      <Route path="/project-statuses" component={ProjectStatusesTable} />
      <Route path="create-project-status" component={CreateProjectStatus} />
      <Route path="edit-project-status/:id" component={EditProjectStatus} />
      <Route path="view-project-status/:id" component={ViewProjectStatus} />
    {:else}
      <Route path="/" component={Login} />
    {/if}
  </main>
  
  </div>
  </div>
</Router>
