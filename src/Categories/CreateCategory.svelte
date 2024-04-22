<script>
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { onMount } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';

  import { slide } from 'svelte/transition';

  let projectCategories = [];
  let projectStatuses = [];
 // on mount
  onMount(async () => {

    
    const categoryResponse = await fetch('https://api.mag-servicios.com/categories', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      });

      if (!categoryResponse.ok) {
        throw new Error('Error al cargar las categorías');
      }

      projectCategories = await categoryResponse.json();

      // Filtrar solo las categorías con type = 'clients'
      projectCategories = projectCategories.filter(category => category.type === 'projects');

      // obtain the project statuses


    
      const projectStatusResponse = await fetch('https://api.mag-servicios.com/project-statuses', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      });

      if (!projectStatusResponse.ok) {
        throw new Error('Error al cargar las categorías');
      }

      projectStatuses = await projectStatusResponse.json();




  });

  let categoryFields = [
    { name: 'Campo', type: 'Texto', id: `${Date.now()}-${Math.random()}`, required: false }
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
    code: '',
    fields: [],
    filters: []
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

      let categoryFieldsData = categoryFields.map(field => ({
        name: field.name,
        type: field.type,
        required: field.required.toString()
      }));

      category.fields = categoryFieldsData;

      // save projectCategory projectStatus and Order if the category is a report
      if (category.type === 'reports') {
        // save as array into filters

        category.filters = [
          {
            name: 'category',
            value: document.getElementById('reportCategory').value
          },
          {
            name: 'unique',
            value: document.getElementById('reportUnique').checked
          },
          {
            name: 'status',
            value: document.getElementById('projectStatus').value
          },
          {
            name: 'order',
            value: document.getElementById('order').value
          }
        ];


      }

      const formData = {
        ...category
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
    { name: '', type: 'Texto', id: `${Date.now()}-${Math.random()}`, required: false }
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

 <!-- Campo Categoría -->
 <div class="form-group">
  <label for="reportCategory">Categoría del Proyecto</label>
  <select id="reportCategory" class="form-control">
    {#each projectCategories as projectCategory}
    <option value="{projectCategory.id}">{projectCategory.name}</option>
  {/each}
  <option value="ALL">Todas las categorías</option>
  </select>
</div>

<div class="form-group">
  <label for="reportUnique">¿Es único para el proyecto?</label>
  <input id="reportUnique" type="checkbox" class="form-control">
</div>


<!-- Campo Estado del proyecto -->
<div class="form-group">
  <label for="projectStatus">Estado del Proyecto</label>
  <select id="projectStatus" class="form-control">
    {#each projectStatuses as projectStatus}
    <option value="{projectStatus.id}">{projectStatus.status_name}</option>
  {/each}
  </select>
</div>

<!-- Campo Orden -->
<div class="form-group">
  <label for="order">Orden</label>
  <input id="order" type="number" class="form-control" min="1" max="50">
</div>


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
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Lista')}>Lista</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Verificacion')}>Verificacion</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Firma')}>Firma</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Imagen')}>Imagen</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Proveedor')}>Proveedor</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Contacto')}>Contacto</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Cliente')}>Cliente</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'FechaHora')}>Fecha</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Correo')}>Correo electrónico</a></li>
      <li><a class="dropdown-item" href="#" on:click={() => updateField(field.id, 'Numero')}>Número</a></li>
    </ul>
    <input type="text" class="form-control field-text" placeholder="Nombre del campo" bind:value={field.name} required>
    <div class="input-group-text field-required form-control">
      <input id="required-{field.id}" type="checkbox" class="custom-checkbox d-none" aria-label="Checkbox para marcar como requerido" bind:checked={field.required} >

      <span class="dnd-drag">
        <i class="fa-solid fa-up-down-left-right"></i>
      </span>
      <label for="required-{field.id}" class="form-check-label required-{field.required}">
        Requerido

        {#if field.required}
          <i class="fas fa-lock"></i>
        {:else}
          <i class="fas fa-lock-open"></i>
        {/if}
      </label>
    </div>
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
