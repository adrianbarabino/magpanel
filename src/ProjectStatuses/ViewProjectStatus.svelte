<script>
  import { onMount } from 'svelte';
  export let id; // Asumiendo que el ID se pasa como prop al componente

  let projectStatus = {
    name: '',
    address: '',
    phone: '',
    email: '',
    web: '',
    city: '',
    projectStatus_id: null, // Asumiendo que projectStatus_id es un número
    company: ''
  };
  let isLoading = true;
  let errorMessage = '';



onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/project-statuses/${id}`, {
        headers: {
          'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
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
  <p>Cargando detalles del categoría...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    <h2>Detalles del Estado de Proyecto</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{projectStatus.name}</dd>

      <dt class="col-sm-3">Dirección</dt>
      <dd class="col-sm-9">{projectStatus.address}</dd>

      <dt class="col-sm-3">Teléfono</dt>
      <dd class="col-sm-9">{projectStatus.phone}</dd>

      <dt class="col-sm-3">Email</dt>
      <dd class="col-sm-9">{projectStatus.email}</dd>

      <dt class="col-sm-3">Web</dt>
      <dd class="col-sm-9">{projectStatus.web}</dd>

      <dt class="col-sm-3">Ciudad</dt>
      <dd class="col-sm-9">{projectStatus.city}</dd>

      <dt class="col-sm-3">ID de Estado de Proyecto</dt>
      <dd class="col-sm-9">{projectStatus.projectStatus_id}</dd>

      <dt class="col-sm-3">Compañía</dt>
      <dd class="col-sm-9">{projectStatus.company}</dd>
    </dl>
  </div>
{/if}
