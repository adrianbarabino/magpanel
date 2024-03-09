<script>
  import { onMount } from 'svelte';
  export let id; // Asumiendo que el ID se pasa como prop al componente
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación

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
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
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
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/locations')}>Ubicaciones</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>
    <h2>Detalles de la Ubicación</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{location.name}</dd>

      <dt class="col-sm-3">Latitud</dt>
      <dd class="col-sm-9">{location.lat}</dd>

      <dt class="col-sm-3">Longitud</dt>
      <dd class="col-sm-9">{location.lng}</dd>

      <dt class="col-sm-3">Provincia</dt>
      <dd class="col-sm-9">{location.state}</dd>

      <dt class="col-sm-3">Ciudad</dt>
      <dd class="col-sm-9">{location.city}</dd>

      <dt class="col-sm-3">País</dt>
      <dd class="col-sm-9">{location.country}</dd>

      
    </dl>
  </div>
{/if}
