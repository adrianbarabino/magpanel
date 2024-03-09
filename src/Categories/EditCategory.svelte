<script>
  import { onMount } from 'svelte';
  import Swal from 'sweetalert2';

  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación

  export let id; // ID del categoría para editar

  let category = {
    name: '',
    type: 'projects'
  };


onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/categories/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'),
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del categoría');
      }

      category = await response.json();


    } catch (error) {
      console.error(error.message);
    }
  });

  const saveCategory = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        },
        body: JSON.stringify(category)
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
      const response = await fetch(`https://api.mag-servicios.com/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        },
        body: JSON.stringify(category)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la categoría');
      }

      // Manejar la respuesta exitosa
      console.log('Categoría actualizada con éxito');
Swal.fire({
        title: 'Categoría actualizada con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
                broteNavigate('/categories');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Editar Categoría <small class="text-muted">Asegurate de guardar los cambios</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/categories')}>Categorías</a></li>
    <li class="breadcrumb-item active" aria-current="page">Editar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <div class="form-group">
    <label for="name">Nombre</label>
    <input id="name" class="form-control" type="text" bind:value={category.name} required>
  </div>
  <div class="form-group">
    <label for="type">Tipo</label>
    <select id="type" class="form-control" bind:value={category.type}>
      <option value="projects">Proyectos</option>
      <option value="reports">Reportes</option>
      <option value="clients">Clientes</option>
    </select>
  
  
  <button type="submit" class="btn btn-primary">Actualizar Categoría</button>
</form>
