<script>
  import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación

  export let id; // Asumiendo que el ID se pasa como prop al componente

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


onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/projects/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        }
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los detalles del projecto');
      }

      project = await response.json();


    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <p>Cargando detalles del projecto...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    
<!-- Título y Breadcrumb para "Ver Proyecto" -->
<h1 class="mb-4">Ver Proyecto <small class="text-muted">Detalles del proyecto</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/projects')}>Proyectos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>
    <h2>Detalles del Projecto</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{project.name}</dd>

      <dt class="col-sm-3">Descripción</dt>
      <dd class="col-sm-9">{project.description}</dd>

      <dt class="col-sm-3">Ubicación</dt>
      <dd class="col-sm-9"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate(`/view-location/${project.location_id}`)}>{project.location_name}</a></dd>


      <dt class="col-sm-3">Autor</dt>
      <dd class="col-sm-9"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate(`/view-user/${project.author_id}`)}>{project.author_name}</a></dd>

      <dt class="col-sm-3">Categoría</dt>
      <dd class="col-sm-9"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate(`/view-category/${project.category_id}`)}>{project.category_name}</a></dd>

      <dt class="col-sm-3">Estado</dt>
      <dd class="col-sm-9"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate(`/view-project-status/${project.status_id}`)}>{project.status_name}</a></dd>


    </dl>
  </div>
{/if}
