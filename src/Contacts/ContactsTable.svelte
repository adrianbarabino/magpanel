
<script>
  import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'

  let clients = [];
  let providers = [];
  let contacts = [];
    let rowsPerPageData = localStorage.getItem('rowsPerPage') || 10;

rowsPerPageData = parseInt(rowsPerPageData, 10);

const handler = new DataHandler(
contacts, { rowsPerPage: rowsPerPageData, css: true, i18n: {
    search: 'Buscar...',
    show: 'Mostrar',
    entries: 'contactos',
    filter: 'Filtrar',
    rowCount: 'Contactos {start} a {end} de {total}',
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

  
  const responseClients = await fetch('https://api.mag-servicios.com/clients', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(responseClients);
  clients = await responseClients.json();

  const responseProviders = await fetch('https://api.mag-servicios.com/providers', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(responseProviders);
  providers = await responseProviders.json();


  const response = await fetch('https://api.mag-servicios.com/contacts', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(response);
  contacts = await response.json();

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

});
$: contacts, handler.setRows(contacts)

const deleteContact = async (id) => {
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
  const response = await fetch(`https://api.mag-servicios.com/contacts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer '+localStorage.getItem('accessToken')
    }
  });

  if (response.ok) {
    // Remover el contacto eliminado de la lista
    contacts = contacts.filter(contact => contact.id !== id);
Swal.fire(
        'Eliminado',
        'El contacto ha sido eliminado.',
        'success'
      );
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el contacto');
    Swal.fire(
        'Error',
        'No se pudo eliminar el contacto.',
        'error'
      );
    }
  }
};


  const editContact = (id) => {
    broteNavigate(`/edit-contact/${id}`); // Ajusta para usar navigate
  };

  const viewContact = (id) => {
    broteNavigate(`/view-contact/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <h1 class="mb-4">Ver Contactos <small class="text-muted">  <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-contact')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a>
  </small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Contactos</li>
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
        <Th {handler} orderBy="position">Posición</Th>
        <Th {handler} orderBy="phone">Teléfono</Th>
        <Th {handler} orderBy="email">Email</Th>
        <Th {handler} orderBy="client_ids">Empresa</Th>
        <Th class="actions-column" {handler}>Acciones</Th>

      </tr>
      <tr class="filters">
        <ThFilter {handler} filterBy="id" />
        <ThFilter {handler} filterBy="name" />
        <ThFilter {handler} filterBy="position" />
        <ThFilter {handler} filterBy="phone"/>
        <ThFilter {handler} filterBy="email"/>
        <ThFilter {handler} filterBy="client_ids"/>
        <th></th>
        </tr>
    </thead>
    <tbody>
      {#each $rows as row (row.id)}
        <tr>
          <td>{row.id}</td>
          <td>{row.name}</td>
          <td>{row.position}</td>
          <td>{row.phone}</td>
          <td>{row.email}</td>
          <td>

            {#each clients as client}
            {#if row.connections.client_ids}
              {#if row.connections.client_ids.includes(client.id)}
              <a href="javascript:void(0);" class="badge bg-primary mr-1" on:click={(event) =>  broteNavigate(`/view-client/${client.id}`)}>{client.name}</a>
              
              {/if}
              {/if}
            {/each}
            {#each providers as provider}
            {#if row.connections.provider_ids}
              {#if row.connections.provider_ids.includes(provider.id)}
              <a href="javascript:void(0);" class="badge bg-info mr-1" on:click={(event) =>  broteNavigate(`/view-provider/${provider.id}`)}>{provider.name}</a>
              
              {/if}
              {/if}
            {/each}
          
          </td>
          <td>
            <button class="btn btn-primary btn-sm mr-2" on:click={() => viewContact(row.id)}><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-success btn-sm mr-2" on:click={() => editContact(row.id)}><i class="fa-solid fa-pencil-alt"></i></button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteContact(row.id)}><i class="fa-solid fa-trash-alt"></i></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  </Datatable>
  {/if}
</div>
