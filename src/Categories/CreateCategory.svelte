<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { slide } from 'svelte/transition';


  let categoryFields = [
    { name: 'Campo', type: 'Texto' }
    // Asumo que tienes una estructura similar para tus campos
    // Agrega más campos según sea necesario
  ];

  function updateField(index, type) {
    categoryFields[index].type = type;
  }
    let category = {
    name: '',
    type: 'reports',
    code: ''
  };
  let codeModified = false;
  $: {
    if (category.name && !codeModified) {      
      category.code = category.name.replace(/\s/g, '').toUpperCase().substring(0, 3);
    }
  }
  let errorMessage = '';

function validateCode() {
  const pattern = /^[A-Z0-9]{3}$/;
  if (!pattern.test(category.code)) {
    errorMessage = 'El código debe tener exactamente 3 caracteres alfanuméricos en mayúsculas';
    return false;
  }
  errorMessage = '';
  return true;
}



  const submitForm = async () => {
    try {
      if (!validateCode()) {
        return;
      }
      const response = await fetch('https://api.mag-servicios.com/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(category)
      });

      if (!response.ok) {
        const responseText = await response.text();

        Swal.fire({
          title: 'Error al crear la Categoría',
          text: 'Por favor verifica los datos del formulario: '+responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de categoryes
      console.log('Categoria creada con éxito');
Swal.fire({
        title: 'Categoría creada con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });


      
          broteNavigate('/categories');

    } catch (error) {
      console.error(error.message);
    }
  };

let addFields = () => {
  categoryFields = [...categoryFields, { name: '', type: 'Texto' }];
};

let removeField = (index) => {
  categoryFields = [...categoryFields.slice(0, index), ...categoryFields.slice(index + 1)];
};

</script>
<h1 class="mb-4">Crear Categoría <small class="text-muted">Crear una nueva categoría</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/categories')}>Categorías</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  
  <div class="form-group">
    <label for="type">Tipo</label>
    <select id="type" class="form-control" bind:value={category.type}>
      <option value="projects">Proyectos</option>
      <option value="reports">Reportes</option>
      <option value="clients">Clientes</option>
      <option value="providers">Proveedores</option>
    </select>
    </div>
  
  <div class="form-group">
    <label for="name">Nombre</label>
    <input id="name" class="form-control" type="text" bind:value={category.name} required>
  </div>
  
  {#if category.type === 'projects'}
    <div class="form-group" transition:slide>
      
      <label for="code">Código</label>
      <input id="code" class="form-control" type="text" bind:value={category.code} on:input="{e => { category.code = e.target.value.toUpperCase(); codeModified = true; }}">
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </div>
  {/if}

  {#if category.type === 'reports'}
  <label for="fields">Campos</label>

  {#each categoryFields as field, index (index)}
  <div class="input-group mb-3">
    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {field.type}
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" on:click={() => updateField(index, 'Texto')}>Texto</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(index, 'PDF')}>PDF</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(index, 'Firma')}>Firma</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(index, 'Imagen')}>Imagen</a></li>
    </ul>
    <input type="text" class="form-control" placeholder="Nombre del campo" bind:value={field.name} required>
    <button type="button" class="btn btn-danger" on:click={() => removeField(index)}>
      <i class="fa fa-trash"></i>
    </button>
  </div>
{/each}

  <button type="button" class="btn btn-secondary" on:click={addFields}>Agregar Campo</button>
{/if}




  <button type="submit" class="btn btn-primary">Crear Categoría</button>
</form>
