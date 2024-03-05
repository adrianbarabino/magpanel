<script>
  import { onMount } from 'svelte';
  export let id; // Asumiendo que el ID se pasa como prop al componente

  let user = {
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
      const response = await fetch(`https://api.mag-servicios.com/users/${id}`, {
        headers: {
          'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
        }
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los detalles del usuario');
      }

      user = await response.json();


    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  });
</script>
<h1 class="mb-4">Ver Usuario <small class="text-muted">Detalles del Usuario</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/users')}>Usuarios</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>

{#if isLoading}
  <p>Cargando detalles del usuario...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    <h2>Detalles del Usuario</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre y Apellido</dt>
      <dd class="col-sm-9">{user.name}</dd>

      <dt class="col-sm-3">Usuario</dt>
      <dd class="col-sm-9">{user.username}</dd>

      <dt class="col-sm-3">Rango</dt>
      <dd class="col-sm-9">{#if user.rank === 0} Empleado {/if}
        {#if user.rank === 1} Supervisor {/if}
        {#if user.rank === 2} Admin {/if}</dd>

      <dt class="col-sm-3">Email</dt>
      <dd class="col-sm-9">{user.email}</dd>

      <dt class="col-sm-3">Fecha de Registro</dt>
      <dd class="col-sm-9">
        {#if user.created_at}
          {new Date(user.created_at).toLocaleString()}
        {:else}
          No disponible
        {/if}
      </dd>



      <dt class="col-sm-3">Última modificación</dt>
      <dd class="col-sm-9">
        {#if user.updated_at}
          {new Date(user.updated_at).toLocaleString()}
        {:else}
          No disponible
        {/if}
      </dd>    </dl>
  </div>
{/if}
