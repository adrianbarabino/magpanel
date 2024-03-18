<script>
  import { onMount } from 'svelte';
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
      categoryFields = data.fields || [];

    } catch (error) {
      console.error(error.message);
    }
  });

  function updateField(index, type) {
    categoryFields[index].type = type;
  }



  const submitForm = async () => {


    try {
      const formData = {
        ...category,
        fields: categoryFields
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
  categoryFields = [...categoryFields, { name: '', type: 'Texto' }];
};

let removeField = (index) => {
  categoryFields = [...categoryFields.slice(0, index), ...categoryFields.slice(index + 1)];
};

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
          <li><a class="dropdown-item" href="#" on:click={() => updateField(index, 'Proveedor')}>Proveedor</a></li>
          <li><a class="dropdown-item" href="#" on:click={() => updateField(index, 'Contacto')}>Contacto</a></li>
          <li><a class="dropdown-item" href="#" on:click={() => updateField(index, 'Cliente')}>Cliente</a></li>
        </ul>
        <input type="text" class="form-control" placeholder="Nombre del campo" bind:value={field.name} required>
        <button type="button" class="btn btn-danger" on:click={() => removeField(index)}>
          <i class="fa fa-trash"></i>
        </button>
      </div>
    {/each}
    <button type="button" class="btn btn-secondary" on:click={addFields}>Agregar Campo</button>
  {/if}

  <button type="submit" class="btn btn-primary">Actualizar Categoría</button>
</form>
