<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import CreateClient from '../Clients/CreateClient.svelte';
  import CreateLocation from '../Locations/CreateLocation.svelte';
  import { onMount } from 'svelte';
  import { getLocations, getProjectStatuses, getCategories, getClients } from '../utils/api';
  
  let project = {
    name: '',
    description: '', // Campo específico de proyectos
    location_id: '',
    client_id: '',
    category_id: '',
    status_id: '', // Campo específico de proyectos, asumiendo que hay un estado del proyecto
  };
  // Variables y estado de la aplicación
  let showClientModal = false;
  let showLocationModal = false;

  let categories = [];
  let locations = [];
  let clients = [];
  let projectStatuses = [];
  // parse int 

  function handleClientAdded(event) {
    const newClient = event.detail.responseData;
    console.log(event);
    console.log(newClient);

    clients = [...clients, newClient];
    showClientModal = false;
    // set as selected
    project.client_id = newClient.id;
  }

  function handleLocationAdded(event) {
    const newLocation = event.detail.responseData;
    console.log(event);
    console.log(newLocation);
    locations = [...locations, newLocation];
    showLocationModal = false;
    // set as selected
    project.location_id = newLocation.id;
  }
  let isLoading = true;
  // add onmount
  onMount(async () => {
    try {
      
      categories = await getCategories();

      // Filtrar solo las categorías con type = 'clients'
      categories = categories.filter(category => category.type === 'projects');


      clients = await getClients();



      locations = await getLocations();


      projectStatuses = await getProjectStatuses()

      isLoading = false;
    } catch (error) {
      console.error(error.message);
    }
  });
  const submitForm = async () => {
    try {

      // check if the user completed the form

      project.location_id = parseInt(project.location_id);
      project.status_id = parseInt(project.status_id);
      project.client_id = parseInt(project.client_id);

      const response = await fetch('https://api.mag-servicios.com/projects', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        const responseText = await response.text();

        Swal.fire({
          title: 'Error al crear el Proyecto',
          text: 'Por favor verifica los datos del formulario: '+responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de projectos
      console.log('Proyecto creado con éxito');
Swal.fire({
        title: 'Proyecto creado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
          broteNavigate('/projects');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<!-- Título y Breadcrumb para "Nuevo Proyecto" -->
<h1 class="mb-4">Nuevo Proyecto <small class="text-muted">Crea un nuevo proyecto</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/projects')}>Proyectos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Nuevo</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <div class="form-group">
    <label for="name">Nombre del Proyecto</label>
    <input id="name" class="form-control" type="text" bind:value={project.name} required>
  </div>

  <div class="form-group">
    <label for="description">Descripción</label>
    <textarea id="description" class="form-control" bind:value={project.description} required></textarea>
  </div>
  


  <div class="form-group">
    <label for="category_id">Categoría</label>
    <select required id="category_id" class="form-control" bind:value={project.category_id}>
      <option disabled value="">Seleccione una categoría</option>
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
  </div>
  
<!-- UI del formulario principal -->
<div class="form-group">
  <label for="category_id">Cliente:</label>
<select id="client_id" class="form-control"  on:change="{e => e.target.value === 'new' && (showClientModal = true)}">
  <option value="">Seleccione un cliente</option>
  <option value="new">+ Agregar nuevo cliente</option>
  {#each clients as client}
    <option value="{client.id}">{client.name}</option>
  {/each}
</select>
</div>
<div class="form-group">
  <label for="category_id">Ciudad del Proyecto</label>

<select id="location_id" class="form-control"  on:change="{e => e.target.value === 'new' && (showLocationModal = true)}">
  <option value="">Seleccione una ubicación</option>
  <option value="new">+ Agregar nueva ubicación</option>
  {#each locations as location}
    <option value="{location.id}">{location.name}</option>
  {/each}
</select>
</div>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 90%;
    max-width: 500px;
  }
  form .modal-content form .form-group {
    padding:0.2em 0.4em!important;
    max-width: 45%!important;
    display: inline-block;
}
form .modal-content nav{
    display:none;
}
form .modal-content {
    text-align:center;
    margin-top:4em;
}

form .modal-content h1{
    text-align:center;
    font-size:2em;
}
form .modal-content h1 small{
    display:none;
}

form .modal-content form button{
    display:block;
    width:100%;
    
}
</style>

{#if showClientModal}
  <div class="modal">
    <div class="modal-content">
      <CreateClient redirectOnComplete={false} on:clientAdded={handleClientAdded} />
    </div>
  </div>
{/if}

{#if showLocationModal}
  <div class="modal">
    <div class="modal-content">
      <CreateLocation redirectOnComplete={false} on:locationAdded="{handleLocationAdded}" />
    </div>
  </div>
{/if}
  <div class="form-group">
    <label for="status_id">Estado del Proyecto</label>
    <select required id="status_id" class="form-control" bind:value={project.status_id}>
      <option disabled value="">Seleccione un estado</option>
      {#each projectStatuses as status}
        <option value={status.id}>{status.status_name}</option>
      {/each}
  </div>

  <button type="submit" class="btn btn-primary">Crear Proyecto</button>
</form>