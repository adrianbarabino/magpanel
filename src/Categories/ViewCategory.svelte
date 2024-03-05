<script>
  import { onMount } from 'svelte';
  export let id; // Asumiendo que el ID se pasa como prop al componente

  let category = {
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
      const response = await fetch(`https://api.mag-servicios.com/categories/${id}`, {
        headers: {
          'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
        }
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los detalles de la categoría');
      }

      category = await response.json();


    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  });
</script>
<h1 class="mb-4">Ver Categoría <small class="text-muted">Detalles del Categoría</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/categories')}>Categorías</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>

{#if isLoading}
  <p>Cargando detalles del categoría...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    <h2>Detalles del Categoría</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{category.name}</dd>

      <dt class="col-sm-3">Dirección</dt>
      <dd class="col-sm-9">{category.address}</dd>

      <dt class="col-sm-3">Teléfono</dt>
      <dd class="col-sm-9">{category.phone}</dd>

      <dt class="col-sm-3">Email</dt>
      <dd class="col-sm-9">{category.email}</dd>

      <dt class="col-sm-3">Web</dt>
      <dd class="col-sm-9">{category.web}</dd>

      <dt class="col-sm-3">Ciudad</dt>
      <dd class="col-sm-9">{category.city}</dd>

      <dt class="col-sm-3">ID de Categoría</dt>
      <dd class="col-sm-9">{category.category_id}</dd>

      <dt class="col-sm-3">Compañía</dt>
      <dd class="col-sm-9">{category.company}</dd>
    </dl>
  </div>
{/if}
