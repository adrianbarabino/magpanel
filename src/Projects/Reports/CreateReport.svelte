<script>
    import FileUploader from '../../FileUploader.svelte';
    let progress = 0; // Variable para el progreso de la subida
    function handleProgress(progressValue) {
    progress = progressValue;
  }
  import { broteNavigate } from '../../utils/navigation'; // Usa navigate para la navegación
    import Swal from 'sweetalert2';
    import { onMount } from 'svelte';
    export let id; // Asumiendo que el ID se pasa como prop al componente

    let report = {
        category_id: '',
        fields: [],
        project_id: id,
        project_name: ''    
    };
    let categories = [];
    let selectedCategoryFields = [];

    onMount(async () => {
      try {
  
        const projectsResponse = await fetch('https://api.mag-servicios.com/projects/'+id, {
          headers: {
            'Authorization': 'Bearer '+localStorage.getItem('accessToken')
          }
        });

        if (!projectsResponse.ok) {
          throw new Error('Error al cargar los proyectos');
        }

        const project = await projectsResponse.json();
        report.project_name = project.name;
        const categoryResponse = await fetch('https://api.mag-servicios.com/categories', {
          headers: {
            'Authorization': 'Bearer '+localStorage.getItem('accessToken')
          }
        });
  
        if (!categoryResponse.ok) {
          throw new Error('Error al cargar las categorías');
        }
  
        categories = await categoryResponse.json();
  
        // Filtrar solo las categorías con type = 'clients'
        categories = categories.filter(category => category.type === 'reports');
  
      } catch (error) {
        console.error(error.message);
      }
    });
  
    async function loadCategoryFields() {
    const selectedCategory = categories.find(category => category.id === report.category_id);
    if (selectedCategory && selectedCategory.fields) {
        let fieldsPromises = selectedCategory.fields.map(async field => {
            if (field.type === 'Proveedor') {
                const response = await fetch('https://api.mag-servicios.com/providers', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });

                const providers = await response.json();
                return { ...field, options: providers };
            } else if (field.type === 'Contacto') {
                const response = await fetch('https://api.mag-servicios.com/contacts', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });

                const contacts = await response.json();
                return { ...field, options: contacts };
            } else if (field.type === 'Cliente') {
                const response = await fetch('https://api.mag-servicios.com/clients', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });

                const clients = await response.json();
                return { ...field, options: clients };
            } else {
                return field;
            }
        });

        selectedCategoryFields = await Promise.all(fieldsPromises);
    } else {
        selectedCategoryFields = [];
    }
}


    $: {
        if (report.category_id) {
            loadCategoryFields();
        }
    }

  
    const submitForm = async () => {
      try {
        let reportData = {...report};
        reportData.category_id = parseInt(report.category_id)
        reportData.fields = selectedCategoryFields.map(field => ({ name: field.name, value: field.value }));
        reportData.project_id = parseInt(report.project_id);
        const response = await fetch('https://api.mag-servicios.com/projects/'+reportData.project_id+'/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
          },
          body: JSON.stringify(reportData)
        });
  
        if (!response.ok) {
          const responseText = await response.text();
  
          Swal.fire({
            title: 'Error al crear el Reporte',
            text: 'Por favor verifica los datos del formulario: '+responseText,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          return;
        }
  
        // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de reportes
        console.log('Reporte creado con éxito');
  Swal.fire({
          title: 'Reporte creado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
            broteNavigate('/project-statuses');
  
      } catch (error) {
        console.error(error.message);
      }
    };

    function handleFilesChange(event) {
        const { files } = event.detail;
        const fileFieldIndex = selectedCategoryFields.findIndex(field => field.type === 'Archivo' || field.type === 'PDF');
        if (fileFieldIndex !== -1) {
            selectedCategoryFields[fileFieldIndex].value = files;
        }
    }
    function handleFileUploaded(event) {
    const { file, url } = event.detail;
    const fileFieldIndex = selectedCategoryFields.findIndex(field => field.type === 'Archivo' || field.type === 'PDF');
    if (fileFieldIndex !== -1) {
        selectedCategoryFields[fileFieldIndex].value = url; // Asigna la URL del archivo subido
    }
}

    function handleFilesUploaded(formData) {
    // Lógica para manejar los archivos subidos
    console.log('Archivos subidos:', formData);
  }
  </script>
  <h1 class="mb-4">Crear Reporte <small class="text-muted"></small>Crear un nuevo reporte</h1>
  
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/projects')}>Proyectos</a></li>
      <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/view-project/'+report.project_id+'/')}>{report.project_name}</a></li>
      <li class="breadcrumb-item active" aria-current="page">Agregar Reporte</li>
    </ol>
  </nav>
  <form on:submit|preventDefault={submitForm}>

    
    <div class="form-group">
      <label for="category_id">Categoría</label>
      <select required id="category_id" class="form-control" bind:value={report.category_id}>
        <option disabled value="">Seleccione una categoría</option>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
    </div>
    {#if selectedCategoryFields.length > 0}

      {#each selectedCategoryFields as field, index}

      {#if field.type === 'Texto'}
      <div class="form-group">
        <label for="field[{index}]">{field.name}</label>
        <input id="field[{index}]" name="field[{index}]" class="form-control" type="text" bind:value={field.value} required>
      </div>
      {/if}

      {#if field.type === 'PDF'}
      <div class="form-group">
        <label for="field[{index}]">{field.name}</label>
        <FileUploader folder="pdf" types={['.pdf']}      on:uploadProgress={handleProgress}
    on:filesUploaded={handleFilesUploaded}
    on:fileUploaded={handleFileUploaded} />

      </div>
      {/if}

      {#if field.type === 'Firma'}
      <div class="form-group">
        <label for="field[{index}]">{field.name}</label>
        <canvas id="field[{index}]" name="field[{index}]" class="form-control"  required></canvas>
      </div>
      {/if}

      {#if field.type === 'Proveedor'}
      <div class="form-group">
        <label for="field[{index}]">{field.name}</label>
        <select id="field[{index}]" name="field[{index}]" class="form-control" bind:value={field.value} required>
          <option disabled value="">Seleccione un proveedor</option>
          {#each field.options as provider}
            <option value={provider.id}>{provider.name}</option>
          {/each}
        </select>
      </div>
      {/if}

      {#if field.type === 'Imagen'}
      <div class="form-group">
        <label for="field[{index}]">{field.name}</label>
        <FileUploader folder="images" types={
        ['.jpg',
        '.jpeg',
        '.webp',
        '.png',
        '.jpg',
        '.gif',
        '.svg',
        '.bmp',
        '.tiff',
        '.psd',
        '.raw',
        '.heif',
        '.JPEG',
        '.JPG',
        '.PNG',
        '.GIF',
        '.SVG',
        '.BMP'
      ]
        }      on:uploadProgress={handleProgress}
    on:filesUploaded={handleFilesUploaded}
    on:fileUploaded={handleFileUploaded} />
      </div>
      {/if}

      {#if field.type === 'Contacto'}

      <div class="form-group">
        <label for="field[{index}]">{field.name}</label>
        <select id="field[{index}]" name="field[{index}]" class="form-control" bind:value={field.value} required>
          <option disabled value="">Seleccione un contacto</option>
          {#each field.options as contact}
            <option value={contact.id}>{contact.name}</option>
          {/each}
        </select>
      </div>
      {/if}

      {#if field.type === 'Cliente'}
      <div class="form-group">
        <label for="field[{index}]">{field.name}</label>
        <select id="field[{index}]" name="field[{index}]" class="form-control" bind:value={field.value} required>
          <option disabled value="">Seleccione un cliente</option>
          {#each field.options as client}
            <option value={client.id}>{client.name}</option>
          {/each}
        </select>
      </div>
      {/if}


      {/each}

  {/if}

  
    
  
    <button type="submit" class="btn btn-primary">Crear Reporte</button>
  </form>
  