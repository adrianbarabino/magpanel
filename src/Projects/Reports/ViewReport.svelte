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
        
        // verificar si dentro de los fields hay alguno con type Proveedores, Contacto o Cliente, para hacer los fetch correspondientes

        for (let key in report.fields) {
          console.log(report.fields[key].type);
          if (report.fields[key].type === 'Proveedor') {
            let response = await fetch(`https://api.mag-servicios.com/providers/${report.fields[key].value}`, {
              headers: {
                'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
              }
            });
            if (!response.ok) {
              throw new Error('Hubo un problema al obtener los detalles del proveedor');
            }
            let provider = await response.json();
            let providerData = {
              name: provider.name,
              id: provider.id
            }
            report.fields[key].value = providerData;
          }
          if (report.fields[key].type === 'Contacto') {
            let response = await fetch(`https://api.mag-servicios.com/contacts/${report.fields[key].value}`, {
              headers: {
                'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
              }
            });
            if (!response.ok) {
              throw new Error('Hubo un problema al obtener los detalles del contacto');
            }
            let contact = await response.json();
            let contactData = {
              name: contact.name,
              id: contact.id
            }
            report.fields[key].value = contactData;
          }
          if (report.fields[key].type === 'Cliente') {
            let response = await fetch(`https://api.mag-servicios.com/clients/${report.fields[key].value}`, {
              headers: {
                'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
              }
            });
            if (!response.ok) {
              throw new Error('Hubo un problema al obtener los detalles del cliente');
            }
            let client = await response.json();
            let clientData = {
              name: client.name,
              id: client.id
            }
            report.fields[key].value = clientData;
          }
        }

  
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
          <dt class="col-sm-3" style="text-transform:capitalize;">{report.fields[key].name}</dt>


          {#if report.fields[key].type === 'PDF'}

          {#if Array.isArray(report.fields[key].value)}
          <dd class="col-sm-9">
              
                {#each report.fields[key].value as value}
                  {#if value.url}
                  <span class="badge bg-primary m-2 text-white">
                    
                  <a href={value.url} class="text-white" target="_blank">
                      Archivo
                      #{report.fields[key].value.indexOf(value)+1} 
                      <i class="fas fa-external-link-alt"></i>
                  </a>
                    </span>
                  {/if}
                {/each}
              
            </dd>
          {:else}
            <dd class="col-sm-9">{report.fields[key].value}</dd>
          {/if}
    
          {:else if report.fields[key].type === 'Proveedor'}
          <dd class="col-sm-9"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/view-provider/'+report.fields[key].value.id+'/')}>{report.fields[key].value.name}</a></dd>
          {:else if report.fields[key].type === 'Contacto'}
          <dd class="col-sm-9"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/view-contact/'+report.fields[key].value.id+'/')}>{report.fields[key].value.name}</a></dd>
          {:else if report.fields[key].type === 'Cliente'}
          <dd class="col-sm-9"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/view-client/'+report.fields[key].value.id+'/')}>{report.fields[key].value.name}</a></dd>

          {:else if report.fields[key].type === 'Firma'}
          

          {#if Array.isArray(report.fields[key].value)}
          <div class="col-sm-9 row mb-3">

          {#each report.fields[key].value as value}
          <div class="col-4 p-2">
            <div class="card">
              <img src={value.signature} class="card-img-top" alt="Firma" style="max-width: 200px; max-height: 200px;"/>
              <div class="card-body">
                <h5 class="card-title">{value.position}</h5>
                <p class="card-text">{value.clarification}</p>
              </div>
            </div>
          </div>

        {/each}          </div>

          {/if}
         

          {:else}

          <dd class="col-sm-9">{report.fields[key].value}</dd>
          {/if}

          
        {/each}
        
        <dt class="col-sm-3">Autor </dt>
        <dd class="col-sm-9">{report.author_name}</dd>
        <dt class="col-sm-3">Fecha de Creación</dt>
        <dd class="col-sm-9">{report.created_at}</dd>

        
    
      </dl>
    </div>
  {/if}
  