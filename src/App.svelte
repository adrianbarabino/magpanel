
<script>
  import { Router, Route, Link } from 'svelte-routing';
  import { writable } from 'svelte/store';
  import { onMount, onDestroy } from 'svelte';
  import { updateMeta } from './metatags.js'; // Importa desde el archivo JS
  import { pageMeta } from './stores.js';




  
  // Este bloque reaccionará automáticamente a los cambios en pageMeta
  $: {
    document.title = $pageMeta.title; // Actualiza el título de la página
    document.body.className = "page-"+$pageMeta.slug; // Actualiza la clase del body

    // Opcional: Actualizar meta tags de descripción y palabras clave
    const descriptionMetaTag = document.querySelector('meta[name="description"]');
    if (descriptionMetaTag) {
      descriptionMetaTag.setAttribute('content', $pageMeta.description);
    }

    const keywordsMetaTag = document.querySelector('meta[name="keywords"]');
    if (keywordsMetaTag) {
      keywordsMetaTag.setAttribute('content', $pageMeta.keywords);
    }
  }

  // Función para manejar el cambio de ruta
  function handleRouteChange() {
    updateMeta(window.location.pathname, "asd");
  }

  onMount(() => {
    // Llama a handleRouteChange cuando la aplicación se monta
    handleRouteChange();

    // Añade un listener para el evento 'popstate' para manejar los cambios de ruta
    window.addEventListener('popstate', handleRouteChange);

    // Añade un listener para el evento 'click' en los enlaces para manejar los cambios de ruta
    // Nota: Esto es una simplificación. Podrías necesitar una lógica más compleja para manejar enlaces externos, etc.
    document.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        handleRouteChange();
      }
    });
  });

  onDestroy(() => {
    // Limpia los listeners cuando el componente se destruya
    window.removeEventListener('popstate', handleRouteChange);
    document.removeEventListener('click', handleRouteChange);
  });  

  


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
  
  import UsersTable from './Users/UsersTable.svelte';
  import CreateUser from './Users/CreateUser.svelte';
  import EditUser from './Users/EditUser.svelte';
  import ViewUser from './Users/ViewUser.svelte';

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
      <Route path="/users" component={UsersTable} />
      <Route path="create-user" component={CreateUser} />
      <Route path="edit-user/:id" component={EditUser} />
      <Route path="view-user/:id" component={ViewUser} />
    {:else}
      <Route path="/" component={Login} />
    {/if}
  </main>
  
  </div>
  </div>
</Router>
