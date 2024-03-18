<script>
    import Swal from 'sweetalert2';
  import { onMount } from 'svelte';
  import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'
  import { broteNavigate } from './utils/navigation'; // Asegúrate de tener esta utilidad para la navegación

  let logs = [];
  let handler;
  let rows;
  let isLoading = true; // Controla el estado de carga
  let expandedLogId = null; // Rastrea el ID del log expandido

  onMount(async () => {
    const response = await fetch('https://api.mag-servicios.com/logs', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'), // Usa el token de acceso almacenado
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Maneja el caso de una respuesta no exitosa
      console.error('Error al cargar los logs');
      return;
    }

    logs = await response.json(); // Asume que la API devuelve un array de logs
    isLoading = false;
    handler = new DataHandler(logs, { rowsPerPage: rowsPerPageData, i18n: {
    search: 'Buscar...',
    show: 'Mostrar',
    entries: 'entradas',
    filter: 'Filtrar',
    rowCount: 'Registros {start} a {end} de {total}',
    noRows: 'No hay resultados',
    previous: 'Anterior',
    next: 'Siguiente'
}
 })
     rows = handler.getRows()
  });

  function toggleExpansion(logId) {
    expandedLogId = expandedLogId === logId ? null : logId; // Alternar la expansión
  }

  function formatValue(value) {
    if (!value) return '';
    const formatted = JSON.stringify(JSON.parse(value), null, 2);
    return formatted;
  }


</script>

<div class="container mt-4">
  <h1 class="mb-4">Ver Registros del Sistema</h1>

  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => broteNavigate('/')}>Inicio</a></li>
      <li class="breadcrumb-item active" aria-current="page">Registros</li>
    </ol>
  </nav>

  {#if isLoading}
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
    </div>
  {:else}
  <Datatable {handler}>
    <table class="table table-bordered table-hover table-responsive">
      <thead class="thead-dark">
            <tr>
                <Th {handler} orderBy="id">ID</Th>
                <Th {handler} orderBy="type">Tipo</Th>
                <Th {handler} orderBy="old_value">Valor anterior</Th>
                <Th {handler} orderBy="new_value">Valor nuevo</Th>
                <Th {handler} orderBy="username">Usuario</Th>
                <Th {handler} orderBy="created_at">Fecha</Th>
            </tr>
            <tr class="filters">
                <th></th>
                <ThFilter {handler} filterBy="type" />
                <ThFilter {handler} filterBy="old_value"/>
                <ThFilter {handler} filterBy="new_value"/>
                <ThFilter {handler} filterBy="username"/>
                <ThFilter {handler} filterBy="created_at"/>
            </tr>
        </thead>
        <tbody>
            {#each $rows as row}
                <tr>
                    <td>{row.id}</td>
                    <td>{row.type}</td>
                    <td class:expanded={expandedLogId === row.id} on:click={() => toggleExpansion(row.id)}>
                      <div class="value-container">{@html formatValue(row.old_value)}</div>
                    </td>
                    <td class:expanded={expandedLogId === row.id} on:click={() => toggleExpansion(id)}>
                      <div class="value-container">{@html formatValue(row.new_value)}</div>
                    </td>
                    <td>{row.username}</td>
                    <td>{row.created_at}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</Datatable>
 {/if}
</div>
