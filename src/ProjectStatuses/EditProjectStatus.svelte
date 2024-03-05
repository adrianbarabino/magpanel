<script>
  import { onMount } from 'svelte';
    import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
    import Swal from 'sweetalert2';

  export let id; // ID del categoría para editar

  let projectStatus = {
    name: '',
    address: '',
    phone: '',
    email: '',
    web: '',
    city: '',
    projectStatus_id: null,
    company: ''
  };

    let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/project-statuses/${id}`, {
        headers: {
          'Authorization': 'token-secreto',
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del categoría');
      }

      projectStatus = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

    } catch (error) {
      console.error(error.message);
    }
  });

  const saveProjectStatus = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/project-statuses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto'
        },
        body: JSON.stringify(projectStatus)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la categoría');
      }

      // Manejo post actualización exitosa, p.ej., redireccionar al usuario
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const submitForm = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/project-statuses/${projectStatus.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto'
        },
        body: JSON.stringify(projectStatus)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la categoría');
      }

      // Manejar la respuesta exitosa
      console.log('Estado de Proyecto actualizado con éxito');
Swal.fire({
        title: 'Estado de Proyecto actualizado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
                broteNavigate('/');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Editar Estado de Proyecto <small class="text-muted">Editar un nuevo categoría</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/project-statuses')}>Estado de Proyectos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Editar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <div class="form-group">
    <label for="name">Nombre</label>
    <input id="name" class="form-control" type="text" bind:value={projectStatus.name} required>
  </div>
  
  <div class="form-group">
    <label for="address">Dirección</label>
    <input id="address" class="form-control" type="text" bind:value={projectStatus.address} required>
  </div>
  
  <div class="form-group">
    <label for="phone">Teléfono</label>
    <input id="phone" class="form-control" type="tel" bind:value={projectStatus.phone}>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" class="form-control" type="email" bind:value={projectStatus.email} required>
  </div>
  
  <div class="form-group">
    <label for="web">Sitio Web</label>
    <input id="web" class="form-control" type="text" bind:value={projectStatus.web}>
  </div>
  
  <div class="form-group">
    <label for="city">Ciudad</label>
    <input id="city" class="form-control" type="text" bind:value={projectStatus.city} required>
  </div>
  
  <div class="form-group">
    <label for="projectStatus_id">ID de Estado de Proyecto</label>
    <input id="projectStatus_id" class="form-control" type="number" bind:value={projectStatus.projectStatus_id}>
  </div>
  
  <div class="form-group">
    <label for="company">Compañía</label>
    <input id="company" class="form-control" type="text" bind:value={projectStatus.company}>
  </div>
  
  <button type="submit" class="btn btn-primary">Actualizar Estado de Proyecto</button>
</form>
