
<script>
  import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'
    import { accessToken } from '../routes';


  let clients = [];
    let rowsPerPageData = localStorage.getItem('rowsPerPage') || 10;

rowsPerPageData = parseInt(rowsPerPageData, 10);

const handler = new DataHandler(
clients, { rowsPerPage: rowsPerPageData, css: true, i18n: {
    search: 'Buscar...',
    show: 'Mostrar',
    entries: 'clientes',
    filter: 'Filtrar',
    rowCount: 'Clientes {start} a {end} de {total}',
    noRows: 'No hay resultados',
    previous: 'Anterior',
    next: 'Siguiente'
}
 })
 const rows = handler.getRows()

const rowsPerPages = handler.getRowsPerPage()

 handler.on('change', () => {

  localStorage.setItem('rowsPerPage', $rowsPerPages )

console.log(handler.getRowsPerPage())
console.log(rowsPerPageData)
    })

  let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {

  const response = await fetch('https://api.mag-servicios.com/clients', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(response);
  clients = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

});
$: clients, handler.setRows(clients)

const deleteClient = async (id) => {
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
  const response = await fetch(`https://api.mag-servicios.com/clients/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer '+localStorage.getItem('accessToken')
    }
  });

  if (response.ok) {
    // Remover el cliente eliminado de la lista
    clients = clients.filter(client => client.id !== id);
Swal.fire(
        'Eliminado',
        'El cliente ha sido eliminado.',
        'success'
      );
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el cliente');
    Swal.fire(
        'Error',
        'No se pudo eliminar el cliente.',
        'error'
      );
    }
  }
};






  const editClient = (id) => {
    broteNavigate(`/edit-client/${id}`); // Ajusta para usar navigate
  };

  const viewClient = (id) => {
    broteNavigate(`/view-client/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <h1 class="mb-4">Ver Clientes <small class="text-muted">  <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-client')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a>
  </small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Clientes</li>
  </ol>
</nav>
  {#if isLoading}
    <div class="d-flex justify-content-center">
      <div class="spinner"></div> <!-- Spinner se muestra mientras isLoading es true -->
    </div>
  {:else}
  <Datatable {handler}>

  <table class="table table-bordered table-hover table-responsive">
    <thead class="thead-dark">
      <tr>
        <Th class="id-column" {handler} orderBy="id">ID</Th>
        <Th {handler} orderBy="name">Nombre</Th>
        <Th {handler} orderBy="code">Código</Th>
        <Th {handler} orderBy="address">Dirección</Th>
        <Th {handler} orderBy="email">Email</Th>
        <Th {handler} orderBy="city">Ciudad</Th>
        <Th class="actions-column" {handler}>Acciones</Th>

      </tr>
      <tr class="filters">
        <ThFilter {handler} filterBy="id" />
        <ThFilter {handler} filterBy="name" />
        <ThFilter {handler} filterBy="code" />
        <ThFilter {handler} filterBy="address"/>
        <ThFilter {handler} filterBy="email"/>
        <ThFilter {handler} filterBy="city"/>
        <th></th>
        </tr>
    </thead>
    <tbody>
      {#each $rows as row (row.id)}
        <tr>
          <td>{row.id}</td>
          <td>{row.name}</td>
          <td>{row.code}</td>
          <td>{row.address}</td>
          <td>{row.email}</td>
          <td>{row.city}</td>
          <td>
            <button class="btn btn-primary btn-sm mr-2" on:click={() => viewClient(row.id)}><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-success btn-sm mr-2" on:click={() => editClient(row.id)}><i class="fa-solid fa-pencil-alt"></i></button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteClient(row.id)}><i class="fa-solid fa-trash-alt"></i></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  </Datatable>
  {/if}
</div>
