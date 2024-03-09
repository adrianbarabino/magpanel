<script>
  import { onMount } from 'svelte';
  export let id; // Asumiendo que el ID se pasa como prop al componente
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación

  let projectStatus = {
    name: '',
    projectStatus_id: null, // Asumiendo que projectStatus_id es un número
    order: null // Asumiendo que order es un número
  };
  let isLoading = true;
  let errorMessage = '';



onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/project-statuses/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        }
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los detalles de la categoría');
      }

      projectStatus = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  });
</script>
<h1 class="mb-4">Ver Estado de Proyecto <small class="text-muted">Detalles del Estado de Proyecto</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/project-statuses')}>Estado de Proyectos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>

{#if isLoading}
  <p>Cargando detalles de estado de proyecto...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    <h2>Detalles del Estado de Proyecto</h2>
    <dl class="row">
      <!--<dt class="col-sm-3">ID de Estado de Proyecto</dt>
      <dd class="col-sm-9">{projectStatus.id}</dd> NO SABIA SI DEJAR ID PARA MOSTRARLO-->

      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{projectStatus.status_name}</dd>

      <dt class="col-sm-3">Orden</dt>
      <dd class="col-sm-9">{projectStatus.order}</dd>
    </dl>
  </div>
{/if}
