<script>
  import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación

  export let id; // Asumiendo que el ID se pasa como prop al componente

  let provider = {
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
      const response = await fetch(`https://api.mag-servicios.com/providers/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        }
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los detalles del proveedor');
      }

      provider = await response.json();


    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  });
</script>
<h1 class="mb-4">Ver Proveedor <small class="text-muted">Detalles del Proveedor</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/providers')}>Proveedores</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>

{#if isLoading}
  <p>Cargando detalles del proveedor...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    <h2>Detalles del Proveedor</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{provider.name}</dd>

      <dt class="col-sm-3">Dirección</dt>
      <dd class="col-sm-9">{provider.address}</dd>

      <dt class="col-sm-3">Teléfono</dt>
      <dd class="col-sm-9">{provider.phone}</dd>

      <dt class="col-sm-3">Email</dt>
      <dd class="col-sm-9">{provider.email}</dd>

      <dt class="col-sm-3">Web</dt>
      <dd class="col-sm-9">{provider.web}</dd>

      <dt class="col-sm-3">Ciudad</dt>
      <dd class="col-sm-9">{provider.city}</dd>

      <dt class="col-sm-3">ID de Categoría</dt>
      <dd class="col-sm-9">{provider.category_id}</dd>

      <dt class="col-sm-3">Compañía</dt>
      <dd class="col-sm-9">{provider.company}</dd>
    </dl>
  </div>
{/if}
