
<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing'; // Usa navigate para la navegación


  let projects = [];


onMount(async () => {

  const response = await fetch('https://api.mag-servicios.com/projects', {
    method: 'GET', // Método HTTP, GET es el predeterminado y es opcional en este caso
    headers: {
      // Agrega tus headers aquí
      'Authorization': 'token-secreto', // Asegúrate de reemplazar 'token-secreto' con tu token real
      'Content-Type': 'application/json' // Este header es común pero puede que no sea necesario dependiendo de tu API
    }
  });
  console.log(response);
  projects = await response.json();
});

const deleteProject = async (id) => {
  const response = await fetch(`https://api.mag-servicios.com/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'token-secreto'
    }
  });

  if (response.ok) {
    // Remover el projecto eliminado de la lista
    projects = projects.filter(project => project.id !== id);
  } else {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error('Error al eliminar el projecto');
  }
};



  const editProject = (id) => {
    navigate(`/edit-project/${id}`); // Ajusta para usar navigate
  };

  const viewProject = (id) => {
    navigate(`/view-project/${id}`); // Ajusta para usar navigate
  };
</script>

<div class="container mt-4">
  <!-- Título y Breadcrumb para "Ver Proyectos" -->
  <h1 class="mb-4">Ver Proyectos <small class="text-muted">  <a href="javascript:void(0);" on:click={() => navigate('/create-project')} class="addBtn btn-success btn btn-sm mb-3 inline ">Agregar</a>
  </small></h1>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => navigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Proyectos</li>
  </ol>
</nav>
  <table class="table table-bordered table-hover table-responsive">
    <thead class="thead-dark">
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Descricion</th>
        <th>Categoria</th>
        <th>Ciudad</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each projects as { id, name, description, category_id, status_id }}
        <tr>
          <td>{id}</td>
          <td>{name}</td>
          <td>{description}</td>
          <td>{category_id}</td>
          <td>{status_id}</td>
          <td>
            <button class="btn btn-primary btn-sm mr-2" on:click={() => viewProject(id)}>Ver</button>
            <button class="btn btn-secondary btn-sm mr-2" on:click={() => editProject(id)}>Editar</button>
            <button class="btn btn-danger btn-sm" on:click={() => deleteProject(id)}>Eliminar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
