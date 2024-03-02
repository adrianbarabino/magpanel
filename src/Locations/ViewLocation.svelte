<script>
  import { onMount } from 'svelte';
  export let id; // Asumiendo que el ID se pasa como prop al componente

  let location = {
    name: '',
    address: '',
    phone: '',
    email: '',
    web: '',
    city: '',
    category_id: null, // Asumiendo que category_id es un número
    company: ''
  };
  let isLoading = true;
  let errorMessage = '';


onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/locations/${id}`, {
        headers: {
          'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
        }
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los detalles del locationo');
      }

      location = await response.json();


    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <p>Cargando detalles del locationo...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    
<!-- Título y Breadcrumb para "Ver Proyecto" -->
<h1 class="mb-4">Ver Ubicación <small class="text-muted">Detalles de la ubicación</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => broteNavigate('/locations')}>Proyectos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>
    <h2>Detalles de la Ubicación</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{location.name}</dd>

      <dt class="col-sm-3">Dirección</dt>
      <dd class="col-sm-9">{location.address}</dd>

      <dt class="col-sm-3">Teléfono</dt>
      <dd class="col-sm-9">{location.phone}</dd>

      <dt class="col-sm-3">Email</dt>
      <dd class="col-sm-9">{location.email}</dd>

      <dt class="col-sm-3">Web</dt>
      <dd class="col-sm-9">{location.web}</dd>

      <dt class="col-sm-3">Ciudad</dt>
      <dd class="col-sm-9">{location.city}</dd>

      <dt class="col-sm-3">ID de Categoría</dt>
      <dd class="col-sm-9">{location.category_id}</dd>

      <dt class="col-sm-3">Compañía</dt>
      <dd class="col-sm-9">{location.company}</dd>
    </dl>
  </div>
{/if}
