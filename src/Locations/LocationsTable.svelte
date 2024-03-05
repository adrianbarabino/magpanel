
<script>
  import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import LocationMap from './LocationMap.svelte';
  import Swal from 'sweetalert2';


  let locations = [];


  let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {

  const response = await fetch('https://api.mag-servicios.com/locations', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(response);
  locations = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

});

const deleteLocation = async (id) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });


  if (result.isConfirmed) {
  const response = await fetch(`https://api.mag-servicios.com/locations/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'token-secreto'
    }
  });

  if (response.ok) {
    // Remover el locationo eliminado de la lista
    locations = locations.filter(location => location.id !== id);
Swal.fire(
        'Eliminado',
        'La ubicación ha sido eliminado.',
        'success'
      );
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el locationo');
    Swal.fire(
        'Error',
        'No se pudo eliminar la ubicación.',
        'error'
      );
    }
  }
};



  const editLocation = (id) => {
    broteNavigate(`/edit-location/${id}`); // Ajusta para usar navigate
  };

  const viewLocation = (id) => {
    broteNavigate(`/view-location/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <!-- Título y Breadcrumb para "Ver Ubicaciones" -->
  <h1 class="mb-4">Ver Ubicaciones <small class="text-muted">  <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-location')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a>
  </small></h1>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ubicaciones</li>
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
        <th>Ciudad</th>
        <th>Provincia</th>
        <th>Mapa</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each locations as { id, name, city, state, lat, lng }}
        <tr>
          <td>{id}</td>
          <td>{name}</td>
          <td>{city}</td>
          <td>{state}</td>
          <td>      <LocationMap {lat} {lng} />
          </td>
          <td>
            <button class="btn btn-primary btn-sm mr-2" on:click={() => viewLocation(id)}><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-secondary btn-sm mr-2" on:click={() => editLocation(id)}><i class="fa-solid fa-pencil-alt"></i></button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteLocation(id)}><i class="fa-solid fa-trash-alt"></i></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  {/if}
</div>
