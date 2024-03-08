<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';

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

  const submitForm = async () => {
    try {
      const response = await fetch('https://api.mag-servicios.com/project-statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(projectStatus)
      });

      if (!response.ok) {
        throw new Error('Error al crear el projectStatuse');
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de projectStatuses
      console.log('Estado de Proyecto creado con éxito');
Swal.fire({
        title: 'Estado de Proyecto creado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
          broteNavigate('/project-statuses');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Crear Cliente <small class="text-muted">Crear un nuevo projectStatuse</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/project-statuses')}>Clientes</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar</li>
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
  

  <button type="submit" class="btn btn-primary">Crear Cliente</button>
</form>
