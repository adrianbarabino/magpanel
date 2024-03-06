<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';

  let client = {
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
      const response = await fetch('https://api.mag-servicios.com/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto' // Asegúrate de reemplazar 'token-secreto' con tu token real
        },
        body: JSON.stringify(client)
      });

      if (!response.ok) {
        throw new Error('Error al crear el cliente');
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de clientes
      console.log('Cliente creado con éxito');
Swal.fire({
        title: 'Cliente creado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
          broteNavigate('/clients');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Crear Cliente <small class="text-muted">Crear un nuevo cliente</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/clients')}>Clientes</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <div class="form-group">
    <label for="name">Nombre</label>
    <input id="name" class="form-control" type="text" bind:value={client.name} required>
  </div>
  
  <div class="form-group">
    <label for="address">Dirección</label>
    <input id="address" class="form-control" type="text" bind:value={client.address} required>
  </div>
  
  <div class="form-group">
    <label for="phone">Teléfono</label>
    <input id="phone" class="form-control" type="tel" bind:value={client.phone}>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" class="form-control" type="email" bind:value={client.email} required>
  </div>
  
  <div class="form-group">
    <label for="web">Sitio Web</label>
    <input id="web" class="form-control" type="text" bind:value={client.web}>
  </div>
  
  <div class="form-group">
    <label for="city">Ciudad</label>
    <input id="city" class="form-control" type="text" bind:value={client.city} required>
  </div>
  
  <div class="form-group">
    <label for="category_id">ID de Categoría</label>
    <input id="category_id" class="form-control" type="number" bind:value={client.category_id}>
  </div>
  
  <div class="form-group">
    <label for="company">Compañía</label>
    <input id="company" class="form-control" type="text" bind:value={client.company}>
  </div>
  

  <button type="submit" class="btn btn-primary">Crear Cliente</button>
</form>
