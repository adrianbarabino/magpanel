<script>
  import { onMount } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
  import Swal from 'sweetalert2';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import { slide } from 'svelte/transition';

  export let id; // ID del categoría para editar

  let categoryFields = []; // Inicializar los campos de la categoría
  let category = {
    name: '',
    type: '',
  };


  onMount(async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/categories/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'),
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos de la categoría');
      }

      const data = await response.json();
      category = { ...data };
      categoryFields = data.fields.map(field => ({ ...field, id: field.id || Date.now() + Math.random(), required: field.required === 'true' || false}));


    } catch (error) {
      console.error(error.message);
    }
  });

  function updateField(fieldId, type) {
    const index = categoryFields.findIndex(field => field.id === fieldId);
    if (index !== -1) {
      categoryFields[index].type = type;
      categoryFields = [...categoryFields]; // Actualizar para reactividad
    }
  }



  const submitForm = async () => {


    try {
      let categoryFieldsData = categoryFields.map(field => ({
        name: field.name,
        type: field.type,
        required: field.required.toString()
      }));


      const formData = {
        ...category,
        fields: categoryFieldsData
      };

      const response = await fetch(`https://api.mag-servicios.com/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const responseText = await response.text();
        Swal.fire({
          title: 'Error al actualizar la Categoría',
          text: 'Por favor verifica los datos del formulario: '+responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

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

  let addFields = () => {
    categoryFields = [
      ...categoryFields,
      { name: '', type: 'Texto', id: `${Date.now()}-${Math.random()}`, required: false}
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


<h1 class="mb-4">Editar Categoría <small class="text-muted">Asegurate de guardar los cambios</small></h1>

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
    <label for="type">Tipo</label>
    <select id="type" class="form-control" bind:value={category.type}>
      <option value="projects">Proyectos</option>
      <option value="reports">Reportes</option>
      <option value="clients">Clientes</option>
      <option value="providers">Proveedores</option>
    </select>
  </div>



  {#if category.type === 'reports'}
    <label for="fields">Campos</label>
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
        <input type="text" class="form-control" placeholder="Nombre del campo" bind:value={field.name} required>
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

  <button type="submit" class="btn btn-primary">Actualizar Categoría</button>
</form>
