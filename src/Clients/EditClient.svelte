<script>
  import { onMount } from 'svelte';
    import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
    import Swal from 'sweetalert2';

  export let id; // ID del cliente para editar

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

    let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/clients/${id}`, {
        headers: {
          'Authorization': 'token-secreto',
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del cliente');
      }

      client = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

    } catch (error) {
      console.error(error.message);
    }
  });

  const saveClient = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto'
        },
        body: JSON.stringify(client)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el cliente');
      }

      // Manejo post actualización exitosa, p.ej., redireccionar al usuario
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const submitForm = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/clients/${client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto'
        },
        body: JSON.stringify(client)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el cliente');
      }

      // Manejar la respuesta exitosa
      console.log('Cliente actualizado con éxito');
Swal.fire({
        title: 'Cliente actualizado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
                broteNavigate('/clients');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Editar Cliente <small class="text-muted">Editar un nuevo cliente</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/clients')}>Clientes</a></li>
    <li class="breadcrumb-item active" aria-current="page">Editar</li>
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
  
  <button type="submit" class="btn btn-primary">Actualizar Cliente</button>
</form>
