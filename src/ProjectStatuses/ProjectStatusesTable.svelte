
<script>
  import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';


  let projectStatuses = [];


  let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {

  const response = await fetch('https://api.mag-servicios.com/project-statuses', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(response);
  projectStatuses = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

});

const deleteProjectStatus = async (id) => {
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
  const response = await fetch(`https://api.mag-servicios.com/project-statuses/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'token-secreto'
    }
  });

  if (response.ok) {
    // Remover el projectStatuse eliminado de la lista
    projectStatuses = projectStatuses.filter(projectStatus => projectStatus.id !== id);
Swal.fire(
        'Eliminado',
        'El estado de proyecto ha sido eliminado.',
        'success'
      );
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el Estado de Proyecto');
    Swal.fire(
        'Error',
        'No se pudo eliminar el estado de proyecto.',
        'error'
      );
    }
  }
};


  const editProjectStatus = (id) => {
    broteNavigate(`/edit-project-status/${id}`); // Ajusta para usar navigate
  };

  const viewProjectStatus = (id) => {
    broteNavigate(`/view-project-status/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <h1 class="mb-4">Ver Estado de Proyectos <small class="text-muted">  <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-project-status')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a></small></h1>
    <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
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
        <th>Orden</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each projectStatuses as { id, status_name, order}}
        <tr>
          <td>{id}</td>
          <td>{status_name}</td>
          <td>{order}</td>
          <td>
            <button class="btn btn-primary btn-sm mr-2" on:click={() => viewProjectStatus(id)}><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-secondary btn-sm mr-2" on:click={() => editProjectStatus(id)}><i class="fa-solid fa-pencil-alt"></i></button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteProjectStatus(id)}><i class="fa-solid fa-trash-alt"></i></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  {/if}
</div>
