
<script>
    import { onMount } from 'svelte';
    import { broteNavigate } from '../../utils/navigation'; // Usa navigate para la navegación
    import Swal from 'sweetalert2';
    import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'
    export let id;
    console.log(id);

  
    let reports = [];
    const handler = new DataHandler(reports, { rowsPerPage: 10, i18n: {
      search: 'Buscar...',
      show: 'Mostrar',
      entries: 'reportes',
      filter: 'Filtrar',
      rowCount: 'Reportes {start} a {end} de {total}',
      noRows: 'No hay resultados',
      previous: 'Anterior',
      next: 'Siguiente'
  }
   })
   const rows = handler.getRows()
  
    let isLoading = true; // Añade esta variable para controlar el estado de carga
  
  onMount(async () => {
  
    const response = await fetch('https://api.mag-servicios.com/reports', {
      method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
      headers: {
        // Agrega tus headers aquí
        'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
      }
    });
    console.log(response);
    reports = await response.json();
  
      isLoading = false; // Establece isLoading en false una vez que los datos están cargados
  
  });
  $: reports, handler.setRows(reports)
  
  const deleteReport = async (id) => {
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
    const response = await fetch(`https://api.mag-servicios.com/reports/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer '+localStorage.getItem('accessToken')
      }
    });
  
    if (response.ok) {
      // Remover el proveedor eliminado de la lista
      reports = reports.filter(report => report.id !== id);
  Swal.fire(
          'Eliminado',
          'El proveedor ha sido eliminado.',
          'success'
        );
    } else {
      // Manejar errores, por ejemplo, mostrar un mensaje de error
      console.error('Error al eliminar el proveedor');
      Swal.fire(
          'Error',
          'No se pudo eliminar el proveedor.',
          'error'
        );
      }
    }
  };
  
  
    const editReport = (id) => {
      broteNavigate(`/edit-report/${id}`); // Ajusta para usar navigate
    };
  
    const viewReport = (id) => {
      broteNavigate(`/view-report/${id}`); // Ajusta para usar navigate
    };
  </script>
  
  <div class="container mt-4">

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
          <Th {handler} orderBy="category_name">Categoría</Th>
          <Th {handler} orderBy="author_name">Autor</Th>
          <Th {handler} orderBy="updated_at">Última modificación</Th>
          <Th class="actions-column" {handler}>Acciones</Th>
  
        </tr>
        <tr class="filters">
          <ThFilter {handler} filterBy="id" />
          <ThFilter {handler} filterBy="category_name" />
          <ThFilter {handler} filterBy="author_name" />
          <ThFilter {handler} filterBy="updated_at"/>

          <th></th>
          </tr>
      </thead>
      <tbody>
        {#each $rows as row (row.id)}
          <tr>
            <td>{row.id}</td>
            <td>{row.category_name}</td>
            <td>{row.author_name}</td>
            <td>{row.updated_at}</td>

            <td>
              <button class="btn btn-primary btn-sm mr-2" on:click={() => viewReport(row.id)}><i class="fa-solid fa-eye"></i></button>
              <button class="btn btn-success btn-sm mr-2" on:click={() => editReport(row.id)}><i class="fa-solid fa-pencil-alt"></i></button>
              <button class="btn btn-danger btn-sm" on:click={() => deleteReport(row.id)}><i class="fa-solid fa-trash-alt"></i></button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    </Datatable>
    {/if}
  </div>
  