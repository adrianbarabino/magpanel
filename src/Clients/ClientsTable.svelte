
<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing'; // Usa navigate para la navegación


  let clients = [];

 
  let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {

  const response = await fetch('https://api.mag-servicios.com/clients', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(response);
  clients = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

});

const deleteClient = async (id) => {
  const response = await fetch(`https://api.mag-servicios.com/clients/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'token-secreto'
    }
  });

  if (response.ok) {
    // Remover el cliente eliminado de la lista
    clients = clients.filter(client => client.id !== id);
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el cliente');
  }
};



  const editClient = (id) => {
    navigate(`/edit-client/${id}`); // Ajusta para usar navigate
  };

  const viewClient = (id) => {
    navigate(`/view-client/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <h1 class="mb-4">Ver Clientes <small class="text-muted">  <a href="javascript:void(0);" on:click={() => navigate('/create-client')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a>
  </small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => navigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Clientes</li>
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
        <th>Dirección</th>
        <th>Email</th>
        <th>Ciudad</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each clients as { id, name, address, email, city }}
        <tr>
          <td>{id}</td>
          <td>{name}</td>
          <td>{address}</td>
          <td>{email}</td>
          <td>{city}</td>
          <td>
            <button class="btn btn-primary btn-sm mr-2" on:click={() => viewClient(id)}><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-secondary btn-sm mr-2" on:click={() => editClient(id)}><i class="fa-solid fa-pencil-alt"></i></button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteClient(id)}><i class="fa-solid fa-trash-alt"></i></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  {/if}
</div>
