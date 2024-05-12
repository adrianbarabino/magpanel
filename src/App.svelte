<script>
  import { Router, Route, Link } from 'svelte-routing';
  import { writable } from 'svelte/store';
  import { onMount, onDestroy } from 'svelte';
  import { updateMeta } from './metatags.js'; // Importa desde el archivo JS
  import { pageMeta } from './stores.js';
  import { isOnline } from './stores.js';
  // Importa el store accessToken desde el archivo donde está definido
  import { accessToken } from './routes.js';
  import { darkMode } from './routes.js';
  import { fetchAndStoreInitialData, loadProjectsAndReportsFromDB } from './utils/api';
  let darkModeOn = darkMode
  let isLoading = false;

  // Este bloque reaccionará automáticamente a los cambios en pageMeta
  $: {
    document.title = $pageMeta.title;

    let baseClass = $accessToken ? `page-${$pageMeta.slug}` : 'page-login';
    document.body.className = $darkMode ? `${baseClass} dark-mode` : baseClass;
  

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

  $: {
    if (!$isOnline) {
      document.body.classList.add('offline');
    } else {
      document.body.classList.remove('offline');
    }
  }

  
  // Este bloque se ejecutará cada vez que $accessToken cambie
  $: if ($accessToken) {
    fetchData();
  }

  async function fetchData() {
    if (isLoading) return;
    isLoading = true;

    
    if (navigator.onLine) {
      console.log("We gonna fetch data");
      await fetchAndStoreInitialData();
    } else {
      console.log("We gonna load data from DB");
      const { projects, reports } = await loadProjectsAndReportsFromDB();
      console.log('Loaded from DB:', projects, reports);
      // Implementa la lógica para mostrar estos datos en la UI
    }
    isLoading = false;
    
  }

  onMount(() => {
    // Llama a fetchData en montaje inicial si accessToken ya está disponible
    if ($accessToken) fetchData();
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



  // Creamos un store para almacenar los datos del usuario
  const name = writable(JSON.parse(localStorage.getItem('name')));

  import ClientsTable from './Clients/ClientsTable.svelte';
  import CreateClient from './Clients/CreateClient.svelte';
  import EditClient from './Clients/EditClient.svelte';
  import ViewClient from './Clients/ViewClient.svelte';
  
  import ContactsTable from './Contacts/ContactsTable.svelte';
  import CreateContact from './Contacts/CreateContact.svelte';
  import EditContact from './Contacts/EditContact.svelte';
  import ViewContact from './Contacts/ViewContact.svelte';
  
  import ProjectsTable from './Projects/ProjectsTable.svelte';
  import CreateProject from './Projects/CreateProject.svelte';
  import EditProject from './Projects/EditProject.svelte';
  import ViewProject from './Projects/ViewProject.svelte';
  
  import CreateReport from './Projects/Reports/CreateReport.svelte';
  import EditReport from './Projects/Reports/EditReport.svelte';
  import ViewReport from './Projects/Reports/ViewReport.svelte';

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

  import ProvidersTable from './Providers/ProvidersTable.svelte';
  import EditProvider from './Providers/EditProvider.svelte';
  import CreateProvider from './Providers/CreateProvider.svelte';
  import ViewProvider from './Providers/ViewProvider.svelte';

  import Sidebar from './Structure/Sidebar.svelte';
  import PasswordRecovery from './Auth/PasswordRecovery.svelte';
  import Footer from './Structure/Footer.svelte';
  import Login from './Auth/Login.svelte';
  import Logout from './Auth/Logout.svelte';
  import Home from './Pages/Home.svelte';
  import Settings from './Pages/Settings.svelte';
  import NotFound from './Pages/NotFound.svelte';
  import Datasets from './Pages/Datasets.svelte';
  import Navbar from './Navigation/Navbar.svelte';
  import Logs from './Pages/Logs.svelte';

</script>

<Router>
  <div class="wrapper d-flex align-items-stretch">
    <Sidebar />
    <div id="content" class="p-4 p-md-5 mt-5">
      <Navbar />

      <main>
        {#if $accessToken}
          <Route path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/logout" component={Logout} />
          <Route path="/datasets" component={Datasets} />
          <Route path="/settings" component={Settings} />  
          <Route path="/logs" component={Logs} />  
          
          <Route path="/clients" component={ClientsTable} />
          <Route path="/create-client" component={CreateClient} />
          <Route path="/edit-client/:id" component={EditClient} />
          <Route path="/view-client/:id" component={ViewClient} />
          
          <Route path="/providers" component={ProvidersTable} />
          <Route path="/create-provider" component={CreateProvider} />
          <Route path="/edit-provider/:id" component={EditProvider} />
          <Route path="/view-provider/:id" component={ViewProvider} />
          
          <Route path="/contacts" component={ContactsTable} />
          <Route path="/create-contact" component={CreateContact} />
          <Route path="/edit-contact/:id" component={EditContact} />
          <Route path="/view-contact/:id" component={ViewContact} />

          <Route path="/projects" component={ProjectsTable} />
          <Route path="/create-project" component={CreateProject} />
          <Route path="/edit-project/:id" component={EditProject} />
          <Route path="/view-project/:id" component={ViewProject} />
          <Route path="/create-report/:id" component={CreateReport} />
          <Route path="/edit-report/:id" component={EditReport} />
          <Route path="/view-report/:id" component={ViewReport} />
          
          <Route path="/categories" component={CategoriesTable} />
          <Route path="/create-category" component={CreateCategory} />
          <Route path="/edit-category/:id" component={EditCategory} />
          <Route path="/view-category/:id" component={ViewCategory} />
          <Route path="/locations" component={LocationsTable} />
          <Route path="/create-location" component={CreateLocation} />
          <Route path="/edit-location/:id" component={EditLocation} />
          <Route path="/view-location/:id" component={ViewLocation} />
          <Route path="/project-statuses" component={ProjectStatusesTable} />
          <Route path="/create-project-status" component={CreateProjectStatus} />
          <Route path="/edit-project-status/:id" component={EditProjectStatus} />
          <Route path="/view-project-status/:id" component={ViewProjectStatus} />
          <Route path="/users" component={UsersTable} />
          <Route path="/create-user" component={CreateUser} />
          <Route path="/edit-user/:id" component={EditUser} />
          <Route path="/view-user/:id" component={ViewUser} />
          <Route path="/login" component={Home} />

          <Route path="*" component={NotFound} />

        {:else}
        <Route path="/login" component={Login} />
        <Route path="/password-recovery/:token" component={PasswordRecovery} />

          <Route path="*" component={Login} />
        {/if}
      </main>
    </div>
  </div>
  <Footer />

</Router>
