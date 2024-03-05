<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';

  let project = {
    name: '',
    description: '', // Campo específico de proyectos
    location_id: '',
    author_id: '1',

    category_id: null,
    status_id: null, // Campo específico de proyectos, asumiendo que hay un estado del proyecto
  };

  // parse int 

  const submitForm = async () => {
    try {
      project.location_id = parseInt(project.location_id);
      project.author_id = parseInt(project.author_id);
      project.status_id = parseInt(project.status_id);

      const response = await fetch('https://api.mag-servicios.com/projects', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto' // Asegúrate de reemplazar 'token-secreto' con tu token real
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        throw new Error('Error al crear el projecto');
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
    <label for="city">Ciudad del Proyecto</label>
    <select id="location_id" class="form-control" bind:value={project.location_id}>
      <!-- Opciones del estado del proyecto -->
      <option value="">Seleccione un estado</option>
      <option value="1">Planificación</option>
      <option value="2">En Progreso</option>
      <option value="3">Completado</option>
    </select>
      </div>
  <div class="form-group">
    <label for="author_id">Author</label>
    <select id="author_id" class="form-control" bind:value={project.author_id}>
      <!-- Opciones del estado del proyecto -->
      <option value="">Seleccione un estado</option>
      <option value="1">Planificación</option>
      <option value="2">En Progreso</option>
      <option value="3">Completado</option>
    </select>
      </div>
  
  <div class="form-group">
    <label for="category_id">ID de Categoría</label>
    <input id="category_id" class="form-control" type="number" bind:value={project.category_id}>
  </div>
  
  <div class="form-group">
    <label for="status_id">Estado del Proyecto</label>
    <select id="status_id" class="form-control" bind:value={project.status_id}>
      <!-- Opciones del estado del proyecto -->
      <option value="">Seleccione un estado</option>
      <option value="1">Planificación</option>
      <option value="2">En Progreso</option>
      <option value="3">Completado</option>
    </select>
  </div>

  <button type="submit" class="btn btn-primary">Crear Proyecto</button>
</form>