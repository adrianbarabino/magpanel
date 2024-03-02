<script>
  import { onMount } from 'svelte';
    import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación

  export let id; // ID del categoría para editar

  let category = {
    name: '',
    address: '',
    phone: '',
    email: '',
    web: '',
    city: '',
    category_id: null,
    company: ''
  };


onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/categories/${id}`, {
        headers: {
          'Authorization': 'token-secreto',
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
          'Authorization': 'token-secreto'
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
          'Authorization': 'token-secreto'
        },
        body: JSON.stringify(category)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la categoría');
      }

      // Manejar la respuesta exitosa
      console.log('Categoría actualizada con éxito');
                broteNavigate('/');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Editar Categoría <small class="text-muted">Editar un nuevo categoría</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => broteNavigate('/categories')}>Categorías</a></li>
    <li class="breadcrumb-item active" aria-current="page">Editar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <div class="form-group">
    <label for="name">Nombre</label>
    <input id="name" class="form-control" type="text" bind:value={category.name} required>
  </div>
  
  <div class="form-group">
    <label for="address">Dirección</label>
    <input id="address" class="form-control" type="text" bind:value={category.address} required>
  </div>
  
  <div class="form-group">
    <label for="phone">Teléfono</label>
    <input id="phone" class="form-control" type="tel" bind:value={category.phone}>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" class="form-control" type="email" bind:value={category.email} required>
  </div>
  
  <div class="form-group">
    <label for="web">Sitio Web</label>
    <input id="web" class="form-control" type="text" bind:value={category.web}>
  </div>
  
  <div class="form-group">
    <label for="city">Ciudad</label>
    <input id="city" class="form-control" type="text" bind:value={category.city} required>
  </div>
  
  <div class="form-group">
    <label for="category_id">ID de Categoría</label>
    <input id="category_id" class="form-control" type="number" bind:value={category.category_id}>
  </div>
  
  <div class="form-group">
    <label for="company">Compañía</label>
    <input id="company" class="form-control" type="text" bind:value={category.company}>
  </div>
  
  <button type="submit" class="btn btn-primary">Actualizar Categoría</button>
</form>
