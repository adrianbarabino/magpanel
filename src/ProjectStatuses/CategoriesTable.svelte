
<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing'; // Usa navigate para la navegación


  let projectStatuses = [];


  let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {

  const response = await fetch('https://api.mag-servicios.com/projectStatuses', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(response);
  projectStatuses = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

});

const deleteProjectStatus = async (id) => {
  const response = await fetch(`https://api.mag-servicios.com/projectStatuses/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer '+localStorage.getItem('accessToken')
    }
  });

  if (response.ok) {
    // Remover el projectStatuse eliminado de la lista
    projectStatuses = projectStatuses.filter(projectStatus => projectStatus.id !== id);
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el projectStatuse');
  }
};



  const editProjectStatus = (id) => {
    navigate(`/edit-projectStatus/${id}`); // Ajusta para usar navigate
  };

  const viewProjectStatus = (id) => {
    navigate(`/view-projectStatus/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <h1 class="mb-4">Ver Estado de Proyectos <small class="text-muted">  <a href="javascript:void(0);" on:click={() => navigate('/create-projectStatus')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a></small></h1>
    <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => navigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Estado de Proyectos</li>
  </ol>
</nav>
  {#if isLoading}
    <div class="d-flex justify-content-center">
      <div class="spinner"></div> <!-- Spinner se muestra mientras isLoading es true -->
    </div>
  {:else}
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
      {#each projectStatuses as { id, name, type}}
        <tr>
          <td>{id}</td>
          <td>{name}</td>
          <td>{type}</td>
          <td>
            <button class="btn btn-primary btn-sm mr-2" on:click={() => viewProjectStatus(id)}>Ver</button>
            <button class="btn btn-success btn-sm mr-2" on:click={() => editProjectStatus(id)}>Editar</button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteProjectStatus(id)}>Eliminar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  {/if}
</div>
