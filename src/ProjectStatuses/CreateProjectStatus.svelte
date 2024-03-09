<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { onMount } from 'svelte';
  let projectStatus = {
    status_name : '',
    category_id: '',
    order: ''
  };
  let categories = [];

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

    } catch (error) {
      console.error(error.message);
    }
  });


  const submitForm = async () => {
    try {

      projectStatus.category_id = parseInt(projectStatus.category_id)
      projectStatus.order = parseInt(projectStatus.order);
      const response = await fetch('https://api.mag-servicios.com/project-statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(projectStatus)
      });

      if (!response.ok) {
        const responseText = await response.text();

        Swal.fire({
          title: 'Error al crear el Estado de Proyecto',
          text: 'Por favor verifica los datos del formulario: '+responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
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
<h1 class="mb-4">Crear Estado de Proyecto <small class="text-muted"></small>Crear un nuevo estado para tus proyectos</h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/project-statuses')}>Estados de Proyecto</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <div class="form-group">
    <label for="status_name">Nombre</label>
    <input id="status_name" class="form-control" type="text" bind:value={projectStatus.status_name} required>
  </div>
  
  <div class="form-group">
    <label for="category_id">Categoría</label>
    <select required id="category_id" class="form-control" bind:value={projectStatus.category_id}>
      <option disabled value="">Seleccione una categoría</option>
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
  </div>

  <div class="form-group">
    <label for="address">Orden</label>
    <input id="address" class="form-control" type="number" bind:value={projectStatus.order} required min="0" max="100">
  </div>


  

  <button type="submit" class="btn btn-primary">Crear Estado de Proyecto</button>
</form>
