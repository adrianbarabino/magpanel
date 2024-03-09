<script>
  import { onMount } from 'svelte';
    import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
    import Swal from 'sweetalert2';

  export let id; // ID del projecto para editar
  // Cuando se selecciona una nueva opción, actualiza project.status_id como un entero
  function updateStatus(event) {
    project.status_id = parseInt(event.target.value, 10);
  } 
  // Cuando se selecciona una nueva opción, actualiza project.status_id como un entero
  function updateLocation(event) {
    project.status_id = parseInt(event.target.value, 10);
  } 
  
  // Cuando se selecciona una nueva opción, actualiza project.status_id como un entero
  function updateAuthor(event) {
    project.author_id = parseInt(event.target.value, 10);
  }
  let project = {
    name: '',
    description: '', // Campo específico de proyectos
    location_id: 1,
    author_id: 2,
    client_id : 1,
    category_id: 1,
    status_id: 2, // Campo específico de proyectos, asumiendo que hay un estado del proyecto
  };

  $: project_status_id = project.status_id;

  let categories = [];
  let locations = [];
  let clients = [];
  let projectStatuses = [];

    let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {
    try {

      
      const categoryResponse = await fetch('https://api.mag-servicios.com/categories', {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        }
      });

      if (!categoryResponse.ok) {
        throw new Error('Error al cargar las categorías');
      }

      categories = await categoryResponse.json();

      // Filtrar solo las categorías con type = 'clients'
      categories = categories.filter(category => category.type === 'projects');

      const clientResponse = await fetch('https://api.mag-servicios.com/clients', {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        }
      });

      if (!clientResponse.ok) {
        throw new Error('Error al cargar las categorías');
      }

      clients = await clientResponse.json();



      const locationResponse = await fetch('https://api.mag-servicios.com/locations', {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        }
      });

      if (!locationResponse.ok) {
        throw new Error('Error al cargar las ubicaciones');
      }

      locations = await locationResponse.json();

      const projectStatusResponse = await fetch('https://api.mag-servicios.com/project-statuses', {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        }
      });
      
      if (!projectStatusResponse.ok) {
        throw new Error('Error al cargar los estados del proyecto');
      }

      projectStatuses = await projectStatusResponse.json();

      const response = await fetch(`https://api.mag-servicios.com/projects/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'),
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del projecto');
      }

      project = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

      
    } catch (error) {
      console.error(error.message);
    }
  });

  
  const submitForm = async () => {
    try {

      // set to int
      project.location_id = parseInt(project.location_id, 10);
      project.category_id = parseInt
      (project.category_id, 10);
      project.client_id = parseInt(project.client_id, 10);
      project.status_id = parseInt(project.status_id, 10);

  


      const response = await fetch(`https://api.mag-servicios.com/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        const responseText = await response.text();

        Swal.fire({
          title: 'Error al actualizar el Proyecto',
          text: 'Por favor verifica los datos del formulario: '+responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      // Manejar la respuesta exitosa
      console.log('Proyecto actualizado con éxito');
Swal.fire({
        title: 'Proyecto actualizado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
                broteNavigate('/projects');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
  <!-- Título de la sección con subtítulo usando <small> -->
    <h1 class="mb-4">Editar Proyecto <small class="text-muted">Asegurate de guardar los cambios</small></h1>

    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
        <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/projects')}>Proyectos</a></li>
        <li class="breadcrumb-item active" aria-current="page">Editar</li>
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
    <label for="city">Ciudad del Proyecto</label>
    <select required id="location_id" class="form-control" bind:value={project.location_id}>
      <option disabled value="">Seleccione una ciudad</option>
      {#each locations as location}
        <option value={location.id}>{location.name}</option>
      {/each}
    </select>
      </div>

  <div class="form-group">
    <label for="category_id">Categoría</label>
    <select required id="category_id" class="form-control" bind:value={project.category_id}>
      <option disabled value="">Seleccione una categoría</option>
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
  </div>
  
  <div class="form-group">
    <label for="client_id">Cliente</label>
    <select required id="client_id" class="form-control" bind:value={project.client_id}>
      <option disabled value="">Seleccione un cliente</option>
      {#each clients as client}
        <option value={client.id}>{client.name}</option>
      {/each}
  </div>
  
  <div class="form-group">
    <label for="status_id">Estado del Proyecto</label>
    <select required id="status_id" class="form-control" bind:value={project.status_id}>
      <option disabled value="">Seleccione un estado</option>
      {#each projectStatuses as status}
        <option value={status.id}>{status.status_name}</option>
      {/each}
  </div>

  
  <button type="submit" class="btn btn-primary">Actualizar Projecto</button>
</form>
