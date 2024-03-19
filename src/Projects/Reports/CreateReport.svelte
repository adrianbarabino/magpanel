<script>
  import FileUploader from '../../FileUploader.svelte';
  import SignatureModal from './SignatureModal.svelte';


  import {
    broteNavigate
  } from '../../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import {
    onMount
  } from 'svelte';
  export let id; // Asumiendo que el ID se pasa como prop al componente
  let allFilesUploaded = false; // Variable para rastrear el estado de carga de los archivos

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

      const projectsResponse = await fetch('https://api.mag-servicios.com/projects/' + id, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      });

      if (!projectsResponse.ok) {
        throw new Error('Error al cargar los proyectos');
      }

      const project = await projectsResponse.json();
      report.project_name = project.name;
      const categoryResponse = await fetch('https://api.mag-servicios.com/categories', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
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
          return {
            ...field,
            options: providers
          };
        } else if (field.type === 'Contacto') {
          const response = await fetch('https://api.mag-servicios.com/contacts', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
          });

          const contacts = await response.json();
          return {
            ...field,
            options: contacts
          };
        } else if (field.type === 'Cliente') {
          const response = await fetch('https://api.mag-servicios.com/clients', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
          });

          const clients = await response.json();
          return {
            ...field,
            options: clients
          };
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
      if (!allFilesUploaded) {
        Swal.fire({
          title: 'Archivos no cargados',
          text: 'Por favor espera a que todos los archivos se carguen antes de enviar el reporte.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
      let reportData = {
        ...report
      };
      reportData.category_id = parseInt(report.category_id)
      reportData.fields = selectedCategoryFields.map(field => ({
        name: field.name,
        value: field.value,
        type: field.type // Agregando el type aquí
      }));
      reportData.project_id = parseInt(report.project_id);
      const response = await fetch('https://api.mag-servicios.com/projects/' + reportData.project_id + '/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem(
            'accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        const responseText = await response.text();

        Swal.fire({
          title: 'Error al crear el Reporte',
          text: 'Por favor verifica los datos del formulario: ' + responseText,
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
      broteNavigate('/view-project/' + report.project_id + '/');

    } catch (error) {
      console.error(error.message);
    }
  };

  function handleFilesUploaded(event) {
    const {
      files
    } = event.detail;

    checkAllFilesUploaded();
  }


  function handleFileUploaded(event) {
    const {
      file,
      url
    } = event.detail;
    const fileFieldIndex = selectedCategoryFields.findIndex(field => field.type === 'Archivo' || field.type === 'PDF');

    if (fileFieldIndex !== -1) {
      const newFile = {
        file,
        url,
        id: Date.now()
      }; // Añade un identificador único al archivo

      // Comprobar si el campo ya tiene un valor asignado que sea un array
      if (Array.isArray(selectedCategoryFields[fileFieldIndex].value)) {
        // Si ya es un array, simplemente añadimos el nuevo archivo al array existente
        selectedCategoryFields[fileFieldIndex].value.push(newFile);
      } else {
        // Si no es un array, lo iniciamos con el archivo actual
        selectedCategoryFields[fileFieldIndex].value = [newFile];
      }
      //checkAllFilesUploaded();

    }
  }

  function handleFileRemoved(event) {

    const removedFile = event.detail.file;
    console.log("removedFile", removedFile)
    selectedCategoryFields.forEach(field => {
      if (field.type === 'Imagen' || field.type === 'PDF') {
        // Remover el archivo de la lista de archivos del campo

        console.log("field.value", field.value)
        field.value = field.value.filter(f => f.id !== removedFile
        .id); // Asumiendo que cada archivo tiene un ID único
        console.log("field.value", field.value)



      }
    });

    // Actualiza el estado si es necesario para reflejar la eliminación en la UI
    selectedCategoryFields = [...selectedCategoryFields];
  }


  function checkAllFilesUploaded() {
    allFilesUploaded = selectedCategoryFields.every(field => {
      if (field.type === 'Archivo' || field.type === 'PDF') {
        return field.value && field.value.length >
        0; // Verifica que cada campo de archivo tenga al menos un archivo cargado
      }
      return true; // Para los campos que no son de archivo, asume que están "cargados"
    });
  }

  let showModal = false;
  let signatureImage = null; // Para almacenar la imagen de la firma

  function handleSave(data) {
    // recibir data de la modal
    console.log(data);

    // Asumiendo que tienes un campo que puede contener varias firmas
    let signatureField = selectedCategoryFields.find(field => field.type === 'Firma');
    if (!signatureField) {
      signatureField = {
        type: 'Firma',
        value: []
      };
      selectedCategoryFields.push(signatureField);
    }

    if (!signatureField.value) {
      signatureField.value = [];
    }
    console.log(signatureField)
    signatureField.value.push({
      signature: data.detail.signatureImage,
      clarification: data.detail.clarification,
      position: data.detail.position,
      id: data.detail.timestamp
    });
    signatureField.value = [...signatureField.value];
    selectedCategoryFields = selectedCategoryFields.map(field =>
      field.type === 'Firma' ? {
        ...field,
        value: [...field.value]
      } : field
    );
    console.log(signatureField)



    showModal = false;
  }

  function handleCancel() {
    showModal = false;
  }

  function openSignatureModal() {
    console.log("We open de Modal")
    showModal = true;
  }

  function removeSignature(index) {
    console.log("We remove the signature", index)
    let field = selectedCategoryFields.find(field => field.type === 'Firma');
    if (field.type === 'Firma' && field.value && index >= 0) {
      console.log("we remove the signature: ");
      console.log(field.value[index]);
      field.value.splice(index, 1);
      field.value = field.value.slice(); // Esto es para asegurar la reactividad en Svelte
    }
    selectedCategoryFields = selectedCategoryFields.map(field =>
      field.type === 'Firma' ? {
        ...field,
        value: [...field.value]
      } : field);
  }
</script>


<h1 class="mb-4">Crear Reporte <small class="text-muted"></small>Completá todos los campos</h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event)=> broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event)=>
        broteNavigate('/projects')}>Proyectos</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event)=>
        broteNavigate('/view-project/'+report.project_id+'/')}>{report.project_name}</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar Reporte</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>

  <div class="row">
    <div class="col-md-12 mb-2">
      <div class="form-group row">
        <label class="col-md-3" for="category_id">Categoría: </label>
        <div class="col-md-9">
        <select required id="category_id" class="form-control" bind:value={report.category_id}>
          <option disabled value="">Seleccione una categoría</option>
          {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
      </div>
    </div>
      </div>

    {#if selectedCategoryFields.length > 0}

      {#each selectedCategoryFields as field, index}

      {#if field.type === 'Texto'}
      <div class="col-md-12 mb-2">
        <div class="form-group row">
        <label class="col-md-3" for="field[{index}]">{field.name}: </label>
        <div class="col-md-9">
        <input id="field[{index}]" name="field[{index}]" class="form-control" type="text" bind:value={field.value} required>
      </div>     
    </div>
     </div>

      {/if}

      {#if field.type === 'PDF'}
      <div class="col-md-12 mb-2 fileContainer pdfContainer">
        <div class="form-group row">
        <label class="col-md-3" for="field[{index}]">{field.name}: </label>
        <div class="col-md-9">
          <FileUploader folder="pdf" types={['.pdf']}      
          on:filesUploaded={handleFilesUploaded}
          on:fileUploaded={handleFileUploaded}
          on:fileRemoved={handleFileRemoved} 
          />
        </div>
        

  </div>
</div>
{/if}

      {#if field.type === 'Firma'}      
      <div class="col-md-12 mb-2 signatureContainer">
        <div class="form-group row">

        <label for="add-signature" class="col-md-3">Firmas 
        : </label>


        {#if field.value && field.value.length > 0}
        <div class="col-md-8">
            <div class="row">
              {#each field.value as signature, index (signature.id)}
              <div class="col-md-4 col-sm-6">
                <div class="card m-2 signature-card">
                    <img src={signature.signature} class="card-img-top" alt="Firma">
                    <div class="card-body">
                        <p class="card-text">Aclaración: {signature.clarification}</p>
                        <p class="card-text">Cargo: {signature.position}</p>
                        <button type="button" class="btn btn-danger btn-sm signature-delete-btn" on:click={removeSignature(index)} ><i class="fa fa-trash" ></i></button>
                    </div>
                </div>
            </div>
            
                {/each}
            </div>
          </div>
        {:else}

        <div class="col-md-8">
          <div class="row">
        <div class="col-md-12 col-sm-6">
                  <div class="card m-2">
                      <div class="card-body">
                          <p class="card-text">No hay firmas aún, usá el botón + para agregar las firmas.</p>
                        </div>
                  </div>
              </div>
          </div>
        </div>

        {/if}
        <div class="col-md-1">
          <div class="row">
            <div class="col-md-12">
          <button type="button" id="add-signature" class="btn btn-block btn-lg btn-outline-success" on:click={openSignatureModal}>+</button>
            </div>
          </div>

        </div>
      </div>

  </div>




{/if}
    <SignatureModal 
      show={showModal}
    on:save={handleSave} on:cancel={handleCancel} />

      {#if field.type === 'Proveedor'}
      
      <div class="col-md-12 mb-2">
        <div class="form-group row">
        <label class="col-md-3" for="field[{index}]">{field.name}: </label>
        <div class="col-md-9">
        <select id="field[{index}]" name="field[{index}]" class="form-control" bind:value={field.value} required>
          <option disabled value="">Seleccione un proveedor</option>
          {#each field.options as provider}
            <option value={provider.id}>{provider.name}</option>
          {/each}
        </select>
        </div>
      </div>      </div>

      {/if}



      {#if field.type === 'Imagen'}
      <div class="col-md-12 mb-2 fileContainer imageContainer">
        <div class="form-group row">
        <label class="col-md-3" for="field[{index}]">{field.name}: </label>
        <div class="col-md-9">

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
        }
        on:uploadProgress={handleProgress}
        on:filesUploaded={handleFilesUploaded}
        on:fileUploaded={handleFileUploaded}
        on:fileRemoved={handleFileRemoved} 
        />
      </div>
      </div>      </div>

      {/if}

      {#if field.type === 'Contacto'}

      <div class="col-md-12 mb-2">
        <div class="form-group row">
        <label class="col-md-3" for="field[{index}]">{field.name}: </label>
        <div class="col-md-9">
        <select id="field[{index}]" name="field[{index}]" class="form-control" bind:value={field.value} required>
          <option disabled value="">Seleccione un contacto</option>
          {#each field.options as contact}
            <option value={contact.id}>{contact.name}</option>
          {/each}
        </select>
      </div>
      </div>
    </div>
    {/if}

      {#if field.type === 'Cliente'}
      <div class="col-md-12 mb-2">
      <div class="form-group row">
        <label class="col-md-3" for="field[{index}]">{field.name}: </label>
        <div class="col-md-9">
        <select id="field[{index}]" name="field[{index}]" class="form-control" bind:value={field.value} required>
          <option disabled value="">Seleccione un cliente</option>
          {#each field.options as client}
            <option value={client.id}>{client.name}</option>
          {/each}
        </select>
        </div>
      </div>
    </div>
    {/if}


      {/each}

  {/if}

  
</div>
  
    <button type="submit" class="btn btn-primary">Crear Reporte</button>
  </form>
  