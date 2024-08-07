<script>
    import { createEventDispatcher } from 'svelte';

import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { onMount } from 'svelte';
  export let redirectOnComplete = true; // Valor por defecto que permite la redirección
  const dispatch = createEventDispatcher();

  let client = {
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    web: '',
    city: '',
    category_id: null,
    company: ''
  };

  let categories = [];
  
  let codeModified = false;
  $: {
    if (client.name && !codeModified) {      
      client.code = client.name.replace(/\s/g, '').toUpperCase().substring(0, 4);
    }
  }

  
  let errorMessage = '';

async function uniqueCodeCheck() {
  const response = await fetch('https://api.mag-servicios.com/clients/check/'+client.code, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+localStorage.getItem('accessToken')
    }
  });
  return response;
}

async function validateCode() {
  const pattern = /^[A-Z0-9]{4}$/;
  if (!pattern.test(client.code)) {
    errorMessage = 'El código debe tener exactamente 4 caracteres alfanuméricos en mayúsculas';
    // fire swal
    Swal.fire({
      title: 'Error al validar el código',
      text: 'El código debe tener exactamente 4 caracteres alfanuméricos en mayúsculas',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return false;
  }

  // check if code already exists from api
  const response = await uniqueCodeCheck();
    console.log(response.status);
  if (response.ok) {
    // we need to check if is ok, ok equals exists 

    errorMessage = 'Error al validar el código, ya existe un cliente con este código';
    // fire swal
    Swal.fire({
      title: 'Error al validar el código',
      text: 'Ya existe un cliente con este código',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return false;
  }
  errorMessage = '';

  return true;
}


  onMount(async () => {
    try {


      // Obtener las categorías de la API para mostrarlas en el select
      
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
      categories = categories.filter(category => category.type === 'clients');


    } catch (error) {
      console.error(error.message);
    }
  });

  const submitForm = async () => {
    try {
      if (!(await validateCode())) {
        return;
      }

      

      // Check website and add http:// or https:// if missing
      if (client.web && !client.web.startsWith('http')) {
        client.web = 'http://' + client.web;
      }


      const response = await fetch('https://api.mag-servicios.com/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(client)
      });

      if (!response.ok) {
        const responseText = await response.text();

        Swal.fire({
          title: 'Error al crear el Cliente',
          text: 'Por favor verifica los datos del formulario: '+responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de clientes
      console.log('Cliente creado con éxito');
Swal.fire({
        title: 'Cliente creado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      if (redirectOnComplete) {
      // Lógica para redirigir al usuario
      broteNavigate('/clients');
    } else {
      let responseData = await response.json()
      // Emite un evento para notificar que la creación fue exitosa
      dispatch('clientAdded', { responseData });
    }

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
    <label for="code">Código</label>
    <input id="code" class="form-control" type="text" bind:value={client.code} on:input="{e => { client.code = e.target.value.toUpperCase(); codeModified = true; }}" maxlength="4">
    {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}
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
    <label for="category_id">Categoría</label>
    <select id="category_id" class="form-control" bind:value={client.category_id}>
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>

  </div>
  
  <div class="form-group">
    <label for="company">Compañía</label>
    <input id="company" class="form-control" type="text" bind:value={client.company}>
  </div>
  

  <button type="submit" class="btn btn-primary">Crear Cliente</button>
</form>
