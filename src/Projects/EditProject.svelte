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

    category_id: 1,
    status_id: 2, // Campo específico de proyectos, asumiendo que hay un estado del proyecto
  };
  $: project_status_id = project.status_id;

    let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {
    try {

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

  const saveProject = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el projecto');
      }

      // Manejo post actualización exitosa, p.ej., redireccionar al usuario
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const submitForm = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el projecto');
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
    <select id="location_id" class="form-control" value={project.location_id.toString()} on:change={updateLocation}>
      <!-- Opciones del estado del proyecto -->
      <option value="">Seleccione un estado</option>
      <option value="1">Planificación</option>
      <option value="2">En Progreso</option>
      <option value="3">Completado</option>
    </select>
      </div>
  <div class="form-group">
    <label for="author_id">Author</label>
    <select id="author_id" class="form-control" value={project.author_id.toString()} on:change={updateAuthor}>
      <!-- Opciones del estado del proyecto -->
      <option value=0>Seleccione un estado</option>
      <option value=1>Planificación</option>
      <option value=2>En Progreso</option>
      <option value=3>Completado</option>
    </select>
      </div>
  
  <div class="form-group">
    <label for="category_id">ID de Categoría</label>
    <input id="category_id" class="form-control" type="number" bind:value={project.category_id}>
  </div>
  
  <div class="form-group">
    <label for="status_id">Estado del Proyecto</label>
    <select id="status_id" class="form-control" value={project.status_id.toString()} on:change={updateStatus}>
      <!-- Opciones del estado del proyecto -->
      <option value="">Seleccione un estado</option>
      <option value="1">Planificación</option>
      <option value="2">En Progreso</option>
      <option value="3">Completado</option>
    </select>
  </div>

  
  <button type="submit" class="btn btn-primary">Actualizar Projecto</button>
</form>
