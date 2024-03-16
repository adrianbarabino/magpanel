<script>
    import { onMount } from 'svelte';
    export let id; // Asumiendo que el ID se pasa como prop al componente
    import { broteNavigate } from '../../utils/navigation'; // Usa navigate para la navegación
    let report = {
        category_name: '',
        fields: {},
        author_name: '',
        created_at: '',
        project_id: '',
        project_name: ''
    };
    let isLoading = true;
    let errorMessage = '';
  
  
  onMount(async () => {
      try {
        const response = await fetch(`https://api.mag-servicios.com/reports/${id}`, {
          headers: {
            'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
          }
        });
  
        if (!response.ok) {
          throw new Error('Hubo un problema al obtener los detalles de el reporte');
        }
  
        report = await response.json();
        
        // hacer un array en los fields, y reemplazar "_" por " ", y hacer todo capitalize
        let fields = {};
        for (let key in report.fields) {
          let newKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          fields[newKey] = report.fields[key];
        }
        report.fields = fields;
        
  
      } catch (error) {
        errorMessage = error.message;
      } finally {
        isLoading = false;
      }
    });
  </script>
  <h1 class="mb-4">Ver Reporte <small class="text-muted">Detalles de Reporte</small></h1>
  

  
  {#if isLoading}
    <p>Cargando detalles de reporte...</p>
  {:else if errorMessage}
    <p>{errorMessage}</p>
  {:else}
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/projects')}>Proyectos</a></li>
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/view-project/'+report.project_id+'/')}>{report.project_name}</a></li>
      <li class="breadcrumb-item active" aria-current="page">Ver Reporte</li>
    </ol>
  </nav>

    <div class="container mt-4">
      <h2>{report.category_name}</h2>
      <dl class="row">


        {#each Object.keys(report.fields) as key}
          <dt class="col-sm-3" style="text-transform:capitalize;">{key}</dt>
          <dd class="col-sm-9">{report.fields[key]}</dd>
        {/each}
        
        <dt class="col-sm-3">Autor </dt>
        <dd class="col-sm-9">{report.author_name}</dd>
        <dt class="col-sm-3">Fecha de Creación</dt>
        <dd class="col-sm-9">{report.created_at}</dd>

        
    
      </dl>
    </div>
  {/if}
  