<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { onMount } from 'svelte';

  let provider = {
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
    if (provider.name && !codeModified) {      
      provider.code = provider.name.replace(/\s/g, '').toUpperCase().substring(0, 4);
    }
  }
  
  let errorMessage = '';

function validateCode() {
  const pattern = /^[A-Z0-9]{4}$/;
  if (!pattern.test(provider.code)) {
    errorMessage = 'El código debe tener exactamente 4 caracteres alfanuméricos en mayúsculas';
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

      // Filtrar solo las categorías con type = 'providers'
      categories = categories.filter(category => category.type === 'providers');


    } catch (error) {
      console.error(error.message);
    }
  });

  const submitForm = async () => {
    try {
      if (!validateCode()) {
        return;
      }
      const response = await fetch('https://api.mag-servicios.com/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(provider)
      });

      if (!response.ok) {
        const responseText = await response.text();

        Swal.fire({
          title: 'Error al crear el Proveedor',
          text: 'Por favor verifica los datos del formulario: '+responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de proveedores
      console.log('Proveedor creado con éxito');
Swal.fire({
        title: 'Proveedor creado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
          broteNavigate('/providers');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Crear Proveedor <small class="text-muted">Crear un nuevo proveedor</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/providers')}>Proveedores</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <div class="form-group">
    <label for="name">Nombre</label>
    <input id="name" class="form-control" type="text" bind:value={provider.name} required>
  </div>
  
  <div class="form-group">
    <label for="code">Código</label>
    <input id="code" class="form-control" type="text" bind:value={provider.code} on:input="{e => { provider.code = e.target.value.toUpperCase(); codeModified = true; }}" maxlength="4">
    {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}
  </div>
  <div class="form-group">
    <label for="address">Dirección</label>
    <input id="address" class="form-control" type="text" bind:value={provider.address} required>
  </div>
  
  <div class="form-group">
    <label for="phone">Teléfono</label>
    <input id="phone" class="form-control" type="tel" bind:value={provider.phone}>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" class="form-control" type="email" bind:value={provider.email} required>
  </div>
  
  <div class="form-group">
    <label for="web">Sitio Web</label>
    <input id="web" class="form-control" type="text" bind:value={provider.web}>
  </div>
  
  <div class="form-group">
    <label for="city">Ciudad</label>
    <input id="city" class="form-control" type="text" bind:value={provider.city} required>
  </div>
  
  <div class="form-group">
    <label for="category_id">Categoría</label>
    <select id="category_id" class="form-control" bind:value={provider.category_id}>
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>

  </div>
  
  <div class="form-group">
    <label for="company">Compañía</label>
    <input id="company" class="form-control" type="text" bind:value={provider.company}>
  </div>
  

  <button type="submit" class="btn btn-primary">Crear Proveedor</button>
</form>
