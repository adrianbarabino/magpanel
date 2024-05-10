
<script>
  import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import { isOnline } from '../stores';
  import { saveProjects, loadProjectsFromIDB } from '../utils/db.js';
  import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'


  let projects = [];
  // get rowsPerPage from localStorage
  
    let rowsPerPageData = localStorage.getItem('rowsPerPage') || 10;

rowsPerPageData = parseInt(rowsPerPageData, 10);

  const rowsPerPageNum = parseInt(rowsPerPageData, 10);
const handler = new DataHandler(
projects, { rowsPerPage: rowsPerPageNum, i18n: {
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
  
  async function loadProjects() {
  console.log("loadProjects");
    if ($isOnline) {
      console.log("isOnline");
      const response = await fetch('https://api.mag-servicios.com/projects', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
      projects = await response.json();
      saveProjects(projects); // Guarda los proyectos en IndexedDB
      isLoading = false;
    } else {
      console.log("isOffline");
      projects = await loadProjectsFromIDB();
      console.log(projects);
      isLoading = false;
    }
  }


  onMount(() => {
    loadProjects();
  });
$: projects, handler.setRows(projects)

const deleteProject = async (id) => {
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
  const response = await fetch(`https://api.mag-servicios.com/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer '+localStorage.getItem('accessToken')
    }
  });

  if (response.ok) {
    // Remover el projecto eliminado de la lista
    projects = projects.filter(project => project.id !== id);
Swal.fire(
        'Eliminado',
        'El proyecto ha sido eliminado.',
        'success'
      );
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el projecto');
    Swal.fire(
        'Error',
        'No se pudo eliminar el proyecto.',
        'error'
      );
    }
  }
};


  const editProject = (id) => {
    broteNavigate(`/edit-project/${id}`); // Ajusta para usar navigate
  };

  const viewProject = (id) => {
    broteNavigate(`/view-project/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <!-- Título y Breadcrumb para "Ver Proyectos" -->
  <h1 class="mb-4">Ver Proyectos <small class="text-muted">  <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-project')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a>
  </small></h1>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Proyectos</li>
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
          <Th {handler} orderBy="code">Código</Th>
          <Th {handler} orderBy="name">Nombre</Th>
          <Th {handler} orderBy="description">Descripcion</Th>
          <Th {handler} orderBy="category_name">Categoria</Th>
          <Th {handler} orderBy="location_name">Ubicación</Th>
          <Th class="actions-column" {handler}>Acciones</Th>

        </tr>
        <tr class="filters">
          <ThFilter {handler} filterBy="id" />
          <ThFilter {handler} filterBy="code" />
          <ThFilter {handler} filterBy="name" />
          <ThFilter {handler} filterBy="description"/>
          <ThFilter {handler} filterBy="category_name" />
          <ThFilter {handler} filterBy="location_name" />
          <th></th>
          </tr>
      </thead>
      <tbody>
        {#each $rows as row (row.id)}
          <tr>
            <td>{row.id}</td>
            <td>
              {#if row.code}
                {row.code}

              {/if}

            </td>
            <td>{row.name}</td>
            <td>{row.description}</td>
            <td>{row.category_name}</td>
            <td>{row.location_name}</td>

            <td>
              <button class="btn btn-primary btn-sm mr-2" on:click={() => viewProject(row.id)}><i class="fa-solid fa-eye"></i></button>
              <button class="btn btn-success btn-sm mr-2" on:click={() => editProject(row.id)}><i class="fa-solid fa-pencil-alt"></i></button>
              <button class="btn btn-danger btn-sm" on:click={() => deleteProject(row.id)}><i class="fa-solid fa-trash-alt"></i></button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    </Datatable>
    
  {/if}
</div>
