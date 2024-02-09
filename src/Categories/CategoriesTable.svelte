
<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing'; // Usa navigate para la navegación


  let categories = [];


onMount(async () => {

  const response = await fetch('https://api.mag-servicios.com/categories', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(response);
  categories = await response.json();
});

const deleteCategory = async (id) => {
  const response = await fetch(`https://api.mag-servicios.com/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'token-secreto'
    }
  });

  if (response.ok) {
    // Remover el categorye eliminado de la lista
    categories = categories.filter(category => category.id !== id);
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el categorye');
  }
};



  const editCategory = (id) => {
    navigate(`/edit-category/${id}`); // Ajusta para usar navigate
  };

  const viewCategory = (id) => {
    navigate(`/view-category/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <h1 class="mb-4">Ver Categorías <small class="text-muted">  <a href="javascript:void(0);" on:click={() => navigate('/create-category')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a></small></h1>
    <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => navigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Categorías</li>
  </ol>
</nav>
  <table class="table table-bordered table-hover table-responsive">
    <thead class="thead-dark">
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Tipo</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each categories as { id, name, type}}
        <tr>
          <td>{id}</td>
          <td>{name}</td>
          <td>{type}</td>
          <td>
            <button class="btn btn-primary btn-sm mr-2" on:click={() => viewCategory(id)}>Ver</button>
            <button class="btn btn-secondary btn-sm mr-2" on:click={() => editCategory(id)}>Editar</button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteCategory(id)}>Eliminar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
