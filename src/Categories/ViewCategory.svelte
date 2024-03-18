<script>
  import { onMount } from 'svelte';
  export let id; // Asumiendo que el ID se pasa como prop al componente
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  let category = {
    name: '',
    type: ''
  };
  let isLoading = true;
  let errorMessage = '';


onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/categories/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
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
<h1 class="mb-4">Ver Categoría <small class="text-muted">Detalles de Categoría</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/categories')}>Categorías</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>

{#if isLoading}
  <p>Cargando detalles de categoría...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    <h2>Detalles de Categoría</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{category.name}</dd>

      <dt class="col-sm-3">Tipo</dt>
      <dd class="col-sm-9">{category.type}</dd>

      {#if category.fields && category.fields.length > 0}
        <dt class="col-sm-3">Campos</dt>
        <dd class="col-sm-9">
          <ul>
            {#each category.fields as field}
              <li>{field.name} ({field.type})</li>
            {/each}
          </ul>
        </dd>
      {/if}
      {#if category.code && category.code.length > 0}
        <dt class="col-sm-3">Código</dt>
        <dd class="col-sm-9">{category.code}</dd>
      {/if}



    </dl>
  </div>
{/if}
