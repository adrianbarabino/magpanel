<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import LocationMap from '../Locations/LocationMap.svelte'; // Importa el componente de mapa de ubicación
  import ReportsTable from './Reports/ReportsTable.svelte'; // Importa el componente de Reportes
  import { loadSingleProjectFromDB } from '../utils/db.js'; // Importa la función para cargar un proyecto desde IndexedDB
  import { isOnline } from '../stores';

  export let id; // Asumiendo que el ID se pasa como prop al componente

  import Swal from 'sweetalert2';
  let project = {
    name: '',
    description: '', // Campo específico de proyectos
    location_id: 1,
    author_id: 2,

    category_id: 1,
    status_id: 2, // Campo específico de proyectos, asumiendo que hay un estado del proyecto
  };
  let isLoading = true;
  let errorMessage = '';


  // Reactividad en respuesta al cambio de ID
  $: if (id) {
    fetchProject(id);
  }

  async function fetchProject(id) {

    console.log("ID del proyecto:", id); // Agregar este console.log para verificar el ID


 
    isLoading = true;
    errorMessage = '';
    if ($isOnline){
    try {
      const response = await fetch(`https://api.mag-servicios.com/projects/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        }
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los detalles del proyecto');
      }

      project = await response.json();
      if (!project.id) {
        Swal.fire({
          title: 'Error',
          text: 'El proyecto no existe',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        throw new Error('El proyecto no existe');
      }
    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  }else{  
    project = await loadSingleProjectFromDB(id);
    console.log("Project from DB", project)
    if (!project) {
    throw new Error('El proyecto no se encontró en la base de datos');
  }
    isLoading = false;  
  
  }
  }
  
</script>

{#if isLoading}

  <p>Cargando detalles del projecto...</p>{:else if errorMessage}
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/projects')}>Proyectos</a></li>
      <li class="breadcrumb-item active" aria-current="page">Ver</li>
    </ol>
  </nav>
  
  <p>{errorMessage}</p>
{:else}

<div class="container mt-4">
    


    <div class="d-flex justify-content-between">
      <h1>{project.name}</h1>
      <div>
        <!-- Botones o acciones para el proyecto -->
        <button class="btn btn-primary" on:click={() => broteNavigate(`/edit-project/${id}`)}>Editar Proyecto</button>
        <!-- Otros botones o acciones pueden ir aquí -->
      </div>
    </div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
        <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/projects')}>Proyectos</a></li>
        <li class="breadcrumb-item active" aria-current="page">Ver</li>
      </ol>
    </nav>
    <div class="card mt-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 col-lg-6">
            <h5 class="card-title">Detalles</h5>
            <p class="card-text">{project.description}</p>
            <h5 class="card-title">Fecha de Creación</h5>
            <p class="card-text"> {new Date(project.created_at).toLocaleString()}</p>
            <h5 class="card-title">Fecha de Actualización</h5>
            <p class="card-text"> {new Date(project.updated_at).toLocaleString()}</p>

          </div>
          <div class="col-md-6 col-lg-3">
            <h5>Autor</h5>
            <p><a href="javascript:void(0);" on:click={() => broteNavigate(`/view-user/${project.author_id}`)}>{project.author_name}</a></p>
            <h5>Categoría</h5>
            <p><a href="javascript:void(0);" on:click={() => broteNavigate(`/view-category/${project.category_id}`)}>{project.category_name}</a></p>
            <h5>Estado</h5>
            <p><a href="javascript:void(0);" on:click={() => broteNavigate(`/view-project-status/${project.status_id}`)}>{project.status_name}</a></p>
            </div>
          <div class="col-md-12 col-lg-3">
              <h5>Ubicación</h5>
              {#if $isOnline }


              <LocationMap lat="{project.location_lat}"  lng="{project.location_lng}" />
              <p><a href="javascript:void(0);" on:click={() => broteNavigate(`/view-location/${project.location_id}`)}>{project.location_name}</a></p>
              {:else}
              <span>Mapa no disponible sin conexión</span>
              <p>{project.location_name}</p>
              {/if}

          </div>
        </div>
      </div>
    </div>



    <!-- Aquí se insertaría el componente de Reportes -->
    <div class="mt-4">
      <div class="d-flex justify-content-between">
        <h1>Reportes del Proyecto</h1>
        <div>
          <!-- Botones o acciones para el proyecto -->
          <button class="btn btn-success" on:click={() => broteNavigate(`/create-report/${id}`)}>Agregar reporte</button>
          <!-- Otros botones o acciones pueden ir aquí -->
        </div>
      </div>
      <ReportsTable projectId="{id}" />
    </div>
  </div>
{/if}

<style>
  .card-title {
    font-weight: bold;
  }
</style>