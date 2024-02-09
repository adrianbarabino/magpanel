<script>
  import { navigate } from 'svelte-routing'; // Usa navigate para la navegación

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

  const submitForm = async () => {
    try {
      const response = await fetch('https://api.mag-servicios.com/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto' // Asegúrate de reemplazar 'token-secreto' con tu token real
        },
        body: JSON.stringify(category)
      });

      if (!response.ok) {
        throw new Error('Error al crear el categorye');
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de categoryes
      console.log('Cliente creado con éxito');
          navigate('/');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Crear Cliente <small class="text-muted">Crear un nuevo categorye</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => navigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => navigate('/categories')}>Clientes</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar</li>
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
  

  <button type="submit" class="btn btn-primary">Crear Cliente</button>
</form>
