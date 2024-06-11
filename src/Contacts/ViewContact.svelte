<script>
  import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación

  export let id; // Asumiendo que el ID se pasa como prop al componente

  let contact = {
  name: '',
  position: '',
  phone: '',
  email: '',
  client_ids: [],
  provider_ids: []
};

  let isLoading = true;
  let errorMessage = '';

  let clients = [];
  let providers = [];
onMount(async () => {
    try {

      const responseClients = await fetch('https://api.mag-servicios.com/clients', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          }
        });

        if (!responseClients.ok) {
          throw new Error('Error al cargar los clientes');
        }

        clients = await responseClients.json();


        const responseProviders = await fetch('https://api.mag-servicios.com/providers', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          }
        });

        if (!responseProviders.ok) {
          throw new Error('Error al cargar los Proveedores');
        }

        providers = await responseProviders.json();


      const response = await fetch(`https://api.mag-servicios.com/contacts/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        }
      });

      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los detalles del contacto');
      }

      contact = await response.json();


    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  });
</script>
<h1 class="mb-4">Ver Contacto <small class="text-muted">Detalles del Contacto</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/contacts')}>Contactos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ver</li>
  </ol>
</nav>

{#if isLoading}
  <p>Cargando detalles del contacto...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div class="container mt-4">
    <h2>Detalles del Contacto</h2>
    <dl class="row">
      <dt class="col-sm-3">Nombre</dt>
      <dd class="col-sm-9">{contact.name}</dd>

      <dt class="col-sm-3">Posición</dt>
      <dd class="col-sm-9">{contact.position}</dd>

      <dt class="col-sm-3">Teléfono</dt>
      <dd class="col-sm-9">{contact.phone}</dd>

      <dt class="col-sm-3">Email</dt>
      <dd class="col-sm-9">{contact.email}</dd>

      <dt class="col-sm-3">Empresas</dt>
      <dd class="col-sm-9">

        {#each clients as client}
          {#if contact.client_ids.includes(client.id)}
            <span class="badge bg-primary mr-2">{client.name}</span>
          {/if}
        {/each}
        {#each providers as provider}
          {#if contact.provider_ids.includes(provider.id)}
            <span class="badge bg-info mr-2">{provider.name}</span>
          {/if}
        {/each}
      </dd>

      <dt class="col-sm-3">Creado</dt>
      <dd class="col-sm-9">{contact.created_at}</dd>

      <dt class="col-sm-3">Actualizado</dt>
      <dd class="col-sm-9">{contact.updated_at}</dd>
    </dl>
  </div>
{/if}
