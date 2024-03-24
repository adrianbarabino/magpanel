<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { dndzone } from 'svelte-dnd-action';

  import { slide } from 'svelte/transition';


  let categoryFields = [
    { name: 'Campo', type: 'Texto', id: `${Date.now()}-${Math.random()}` }
    // Asumo que tienes una estructura similar para tus campos
    // Agrega más campos según sea necesario
  ];

  function updateField(fieldId, type) {
    const index = categoryFields.findIndex(field => field.id === fieldId);
    if (index !== -1) {
      categoryFields[index].type = type;
      categoryFields = [...categoryFields]; // Actualizar para reactividad
    }
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
      const formData = {
      ...category,
      fields: categoryFields
    };
      const response = await fetch('https://api.mag-servicios.com/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(formData)
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
    categoryFields = [
      ...categoryFields,
      { name: '', type: 'Texto', id: `${Date.now()}-${Math.random()}` }
    ];
  };

  let removeField = (fieldId) => {
    categoryFields = categoryFields.filter(field => field.id !== fieldId);
  };
  function handleDndUpdate({ detail }) {
    console.log(detail);
    console.log(categoryFields);
    categoryFields = [...detail.items];
    console.log(categoryFields);

  }

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
  <div use:dndzone={{ items: categoryFields, flipDurationMs: 300 }}
  on:consider={handleDndUpdate}
  on:finalize={handleDndUpdate}>
  {#each categoryFields as field (field.id)}  
  
  <div id="{field.id}" class="input-group mb-3">
    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {field.type}
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Texto')}>Texto</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'PDF')}>PDF</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Firma')}>Firma</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Imagen')}>Imagen</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Proveedor')}>Proveedor</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Contacto')}>Contacto</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Cliente')}>Cliente</a></li>
    </ul>
    <input type="text" class="form-control" placeholder="Nombre del campo" bind:value={field.name} required>
    <button type="button" class="btn btn-danger" on:click={() => removeField(field.id)}>
      <i class="fa fa-trash"></i>
    </button>
  </div>
{/each}
</div>
  <button type="button" class="btn btn-secondary" on:click={addFields}>Agregar Campo</button>
{/if}




  <button type="submit" class="btn btn-primary">Crear Categoría</button>
</form>
