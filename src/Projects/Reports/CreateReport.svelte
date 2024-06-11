<script>
import Select from 'svelte-select';
import FileUploader from '../../FileUploader.svelte';
import FechaHora from '../../FechaHora.svelte';

import SignatureModal from './SignatureModal.svelte';
  import ListModal from './ListModal.svelte';
  import { getProjects, getReportsByProjectId, getCategories, getProjectStatuses } from '../../utils/api';
  let step = 1; // Controla el paso actual del wizard
  let stepsTitles = ["Tipo", "Datos", "Verificación"];
let selectedCategory;
let verificationArray = [];
let selectComponent;
const now = new Date();
    const formattedNow = `${now.getFullYear()}-${("0" + (now.getMonth() + 1)).slice(-2)}-${("0" + now.getDate()).slice(-2)} ${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}`;

let fechaHoraValue = formattedNow;

function handleDateChange(event) {
  console.log("We are handling the date change");
  console.log(event);
  console.log(event.detail);

  fechaHoraValue = event.detail;
  const fileFieldIndex = selectedCategoryFields.findIndex(field => field.type === 'FechaHora');
  selectedCategoryFields[fileFieldIndex].value = fechaHoraValue;

  console.log(fechaHoraValue);
}
function updateVerification(event) {
  console.log("We are updating the verification array");

  // set the field in selectedCategoryFields
  selectedCategoryFields = selectedCategoryFields.map(field => {
    if (field.type === 'Verificacion') {
      field.value = verificationArray.value;
    }
    return field;
  });
  console.log("We are updating the verification array");

}
function nextStep() {
  // Validación para el paso actual antes de avanzar
  if (step === 1) {
    
    // Verificar si la categoría ha sido seleccionada
    console.log(selectedCategory);
    if (!selectedCategory || selectedCategory === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debés seleccionar una categoría antes de continuar.'
      });
      return; // No avanzar al siguiente paso
    }
  } else if (step === 2) {
    // Validación para los campos del reporte en el paso 2
    let allFieldsValid = true;
    for (let field of selectedCategoryFields) {
      console.log(field);
      if (field.required === 'true' && !field.value) {
        console.log("Encontramos uno");
        allFieldsValid = false;
        break;
      }
    }

    if (!allFieldsValid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debés completar todos los campos requeridos antes de continuar.'
      });
      return; // No avanzar al siguiente paso
    }
  }

  // Si todas las validaciones pasan, incrementar el paso
  step += 1;
}

  let listOpen = false;

  function prevStep() {
    step -= 1;
  }



  import {
    broteNavigate
  } from '../../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import {
    onMount, afterUpdate 
  } from 'svelte';
  
  export let id; // Asumiendo que el ID se pasa como prop al componente
  import flatpickr from 'flatpickr';

let dateTimePicker;
let reports = [];

// Función para cargar todos los reportes del proyecto
async function loadReports(projectId) {
  try {

    let data = await getReportsByProjectId(projectId);

    // foreach the data if is loaded


        // check if one of the reports is id 70
        console.log(data);
    data.forEach(report => {
      console.log("El ID del reporte es: "+report.category_id)
      if (report.category_id === 70) {
        console.log('Reporte 70 encontrado:', report);
        // get the fields
        report.fields.forEach(field => {
          console.log(field);
          if (field.type === 'Lista') {
            console.log('Lista encontrada:', field);
            verificationArray = field.value;
          }
        });
        console.log('Reporte 70 encontrado:', report);
      }
    });
    if (data === null || data.length === 0) {
      console.log('No hay reportes aún, estás a tiempo de crear uno nuevo.');
      reports = [];
    } else {
      reports = data;
    }

  } catch (error) {
    console.error('Error al cargar los reportes:', error);
  }
}

// Lógica para verificar si la categoría seleccionada es única y ya fue utilizada
function isCategoryUniqueAndUsed(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  console.log(category);

  if (category && category.unique) {
    console.log("La categoria es unica");
    console.log(reports);
    console.log(reports.some(report => report.category_id === categoryId));
    return reports.some(report => report.category_id === categoryId);
  }
  return false;
}
function handleCategoryChange(event) {
  let category_id;
  categories.forEach(category => {
    if (category.name === event.detail.value) {
      category_id = category.id
    }
  });
  console.log("Estamos ejecutando el handleCategoryChange");
  console.log("El id de la categoria es: ", category_id);
  console.log(event);
  if (isCategoryUniqueAndUsed(category_id)) {
    Swal.fire({
      title: 'Categoría Única Ya Utilizada',
      text: 'Esta categoría ya ha sido asignada a otro reporte en este proyecto y no puede repetirse.',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });

    event.detail.value = '';
    // reset the category_id
    report = { ...report, category_id: '', category_name: ''};
    selectedCategory = '';
    console.log(selectComponent);
    // clear the select 

    // reset the value of the Select


  }else{


  // find the ID by name 
  console.log('Categoría seleccionada:', event.detail.value);

  report = { ...report, category_id: category_id, category_name: event.detail.value};

    console.log('Categoría seleccionada:', report.category_id);
    selectedCategory = event.detail.value;
  }

  }

afterUpdate(() => {
    if (dateTimePicker && dateTimePicker.parentElement) {
      flatpickr(dateTimePicker, {
        
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        onChange: function(selectedDates, dateStr, instance) {
          // actualiza el valor del campo con la fecha seleccionada
          instance.element.value = dateStr;
        }
      });

    
    }
  });

  let allFilesUploaded = true; // Variable para rastrear el estado de carga de los archivos

  let report = {
    category_id: '',
    fields: [],
    project_id: id,
    project_name: ''
  };
  let categories = [];
  let projectStatuses = [];
  let selectedCategoryFields = [];

  onMount(async () => {
    
    try {
      loadReports(id);


      const project = await getProjects(id);
      report.project_name = project.name;
      console.log("El proyecto es: ", project)


      


      projectStatuses = await getProjectStatuses();
      // add item with id 0 and status_name 'No disponible'
      projectStatuses.unshift({id: 0, status_name: 'No disponible'});
      console.log(projectStatuses);



      categories = await getCategories();
      console.log(categories)
      console.log("We load the categories");

      // Filtrar solo las categorías con type = 'clients'
     // categories = categories.filter(category => category.type === 'reports');
      let projectCategoryId = project.category_id;
    // Filtrar solo las categorías de tipo 'reports' que correspondan al proyecto o sean generales (ALL)
    categories = categories.filter(category => category.type === 'reports');


    // Separar categorías en ALL y específicas
    const allCategories = categories.filter(category => {
        const categoryFilter = category.filters?.find(f => f.name === 'category');
        return categoryFilter && categoryFilter.value === 'ALL';
    }).sort((a, b) => parseInt(a.filters.find(f => f.name === 'order').value) - parseInt(b.filters.find(f => f.name === 'order').value));
    console.log(allCategories);

    const projectSpecificCategories = categories.filter(category => {
        const categoryFilter = category.filters?.find(f => f.name === 'category');
        return categoryFilter && categoryFilter.value === projectCategoryId.toString();
    }).sort((a, b) => parseInt(a.filters.find(f => f.name === 'order').value) - parseInt(b.filters.find(f => f.name === 'order').value));
    console.log(projectSpecificCategories);

    // Calcular la cantidad de categorías 'ALL' y ajustar el orden de las categorías específicas
    const allCategoryCount = allCategories.length;
    projectSpecificCategories.forEach(category => {
      console.log("La categoria es ", category);
        const orderIndex = category.filters.findIndex(f => f.name === 'order');
        console.log("El index es: ", orderIndex);
        if (orderIndex >= 0) {
            let currentOrder = parseInt(category.filters[orderIndex].value);
            console.log(category.filters[orderIndex]);
            category.filters[orderIndex].value = currentOrder + allCategoryCount;
            category.order = currentOrder + allCategoryCount;
            console.log("El nuevo orden es: ", category.filters[orderIndex].value)
        }
    });

    // ahora agregale el order a las otras categorias
    allCategories.forEach(category => {
        const orderIndex = category.filters.findIndex(f => f.name === 'order');
        if (orderIndex >= 0) {
            let currentOrder = parseInt(category.filters[orderIndex].value);
            category.filters[orderIndex].value = currentOrder;
            category.order = currentOrder;
        }
    });


    // Concatenar las listas, donde las categorías 'ALL' van primero
    categories = allCategories.concat(projectSpecificCategories);

    // ahora agregale el order a las otras categorias
    categories.forEach(category => {
        const uniqueIndex = category.filters.findIndex(f => f.name === 'unique');
        if (uniqueIndex >= 0) {
            category.unique = category.filters[uniqueIndex].value
            // convert from string to boolean
            category.unique = category.unique === 'true';
        }
        const statusIndex = category.filters.findIndex(f => f.name === 'status');
        if (statusIndex >= 0) {
          // search in projectStatuses
          console.log(projectStatuses);
          console.log(category.filters[statusIndex].value);
          const status = projectStatuses.find(status => status.id === parseInt(category.filters[statusIndex].value));
          category.status = status ? status.status_name : '';
          category.label = category.name;
          category.value = category.name;
          category.disabled = isCategoryUniqueAndUsed(category.id);
          if(category.disabled){
            category.status = 'No disponible';
          }
        }
    });
    
    // ahora ordenar todos por el order
    categories = categories.sort((a, b) => a.order - b.order);

    console.log(categories);


    } catch (error) {
      console.error(error.message);
    }
  });
  function isValidEmail(email) {
    // Utiliza una expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  } 
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
// Asumiendo que cada field puede tener un dateTimePicker
$: if (dateTimePicker && selectedCategoryFields) {
  selectedCategoryFields.forEach((field) => {
    if (field.type === 'FechaHora' && !field.dateTimePickerInitialized) {
      flatpickr(dateTimePicker, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        onChange: function(selectedDates, dateStr, instance) {
          // actualiza el valor del campo con la fecha seleccionada
          instance.element.value = dateStr;
          field.value = dateStr; // Actualiza directamente el valor del campo
        }
      });
      field.dateTimePickerInitialized = true; // Marcar como inicializado para evitar re-inicializaciones innecesarias
    }
  });
}


  $: {
    if (report.category_id) {
      if (isCategoryUniqueAndUsed(report.category_id)) {
    Swal.fire({
      title: 'Categoría Única Ya Utilizada',
      text: 'Esta categoría ya ha sido asignada a otro reporte en este proyecto y no puede repetirse.',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
    report.category_id = '';
    
  }else{
    console.log("Cargando campos de la categoría, pasamos el unique check");

    loadCategoryFields();

  }
      
    }
  }


  const submitForm = async () => {
    if (step < 3) {
      nextStep(); // Avanza al próximo paso si no es el último
    } else {
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
      // check if selectedCategoryFields has a verification field
      let verificationField = selectedCategoryFields.find(field => field.type === 'Verificacion');
      if (verificationField) {
        // foreach the selectedCategoryFields and update the verification field
        selectedCategoryFields = selectedCategoryFields.map(field => {
          if (field.type === 'Verificacion') {
            console.log(field);
            console.log("Acabamos de actualizar el campo de verificacion");
            console.log("Ahora es");
            console.log(verificationArray);
            field.value = verificationArray;
          }
          return field;
        });

      }
    
      reportData.fields = selectedCategoryFields.map(field => ({
        name: field.name,
        value: field.value,
        type: field.type // Agregando el type aquí
      }));

      
      reportData.project_id = parseInt(report.project_id);

      if (navigator.onLine) {

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
    }else{
              // Guardar la acción para sincronizar más tarde si no hay conexión
              saveActionForLater({ type: 'submitForm', url: 'https://api.mag-servicios.com/projects/' + reportData.project_id + '/reports', data: { ...reportData } });
        Swal.fire({
            icon: 'info',
            title: 'Guardado en modo offline',
            text: 'Tu informe se enviará automáticamente cuando se restablezca la conexión.',
            confirmButtonText: 'Ok'
        });
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
      console.error('Error al enviar formulario:', error);
    }
  }
  };

  function handleFilesUploaded(event) {
    const {
      files
    } = event.detail;

    checkAllFilesUploaded();
  }


  function handleFileSaved() {
    console.log("We saved the file")
    checkAllFilesUploaded();
  } 
  function handleFileUpdated(){
    checkAllFilesUploaded();

  }

  function handleFileUploaded(event) {

    const {
      file,
      url
    } = event.detail;
    console.log("file", file)
    console.log("url", url)
    console.log("selectedCategoryFields", selectedCategoryFields)
    console.log("File uploaded event", event.detail);
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
      console.log(field);
      if (field.type === 'Archivo' || field.type === 'PDF') {
        console.log(field.value);
        console.log("Estamos verificando los archivos");
        return field.value && field.value.length >
        0; // Verifica que cada campo de archivo tenga al menos un archivo cargado
      }
      return true; // Para los campos que no son de archivo, asume que están "cargados"
    });
  }

  let showModal = false;
  let showListModal = false;
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
  function handleListSave(data) {
    // recibir data de la modal
    console.log(data);

    // Asumiendo que tienes un campo que puede contener varias firmas
    let listField = selectedCategoryFields.find(field => field.type === 'Lista');
    if (!listField) {
      listField = {
        type: 'Lista',
        value: []
      };
      selectedCategoryFields.push(listField);
    }

    if (!listField.value) {
      listField.value = [];
    }
    console.log(listField)
    listField.value.push({
      name: data.detail.name,
      date: data.detail.date,
      status: data.detail.status,
      part: data.detail.part,
      certificate: data.detail.certificate,
      id: data.detail.timestamp
    });
    listField.value = [...listField.value];
    selectedCategoryFields = selectedCategoryFields.map(field =>
      field.type === 'Lista' ? {
        ...field,
        value: [...field.value]
      } : field
    );
    console.log(listField)



    showListModal = false;
  }

  function handleCancel() {
    showModal = false;
  }

  function handleListCancel() {
    showListModal = false;
  }

  function openSignatureModal() {
    console.log("We open de Modal")
    showModal = true;
  }

  function openListModal() {
    console.log("We open de Modal")
    showListModal = true;
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

  
  function removeList(index) {
    console.log("We remove the list", index)
    let field = selectedCategoryFields.find(field => field.type === 'Lista');
    if (field.type === 'Lista' && field.value && index >= 0) {
      console.log("we remove the list: ");
      console.log(field.value[index]);
      field.value.splice(index, 1);
      field.value = field.value.slice(); // Esto es para asegurar la reactividad en Svelte
    }
    selectedCategoryFields = selectedCategoryFields.map(field =>
      field.type === 'Lista' ? {
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


<div class="stepwizard">
  <div class="stepwizard-row row setup-panel">
        {#each stepsTitles as title, index}
        <div class="stepwizard-step col-sm-4"> 
          <a href="#step-{index + 1}" type="button" class={step === index + 1 ? 'btn text-white btn-success btn-circle' : 'btn text-white btn-default btn-circle'} disabled="disabled">{index + 1}</a>
          <p><small>{title}</small></p>
      </div>

      {/each}
  </div>
</div>






<form on:submit|preventDefault={submitForm}>

  <div class="row">
    {#if step === 1}

    <div class="col-12 row mb-2">
      <h2 class="col-md-12">¿Que tipo de reporte vas a hacer?</h2>

  

      <div class="form-group row mb-2">
        <label class="col-md-3">Categoría:</label>
        <div class="col-md-9">
          <Select 
          bind:this={selectComponent}
          placeholder="Seleccione una categoría"
          value={selectedCategory}
          on:change={handleCategoryChange}
          items={categories}
          grouped
          groupBy={(item) => item.status}

        >
          </Select>
        </div>
    </div>
    
    <button type="button" class="btn btn-primary" on:click={nextStep}>Siguiente</button>

      </div>
      {:else if step === 2}

      <div class="row">
        <h2 class="col-md-12">Detalles del reporte: {selectedCategory}</h2>
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
          on:fileSaved={handleFileUploaded}
          on:fileUpdated={handleFileUpdated}
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
<SignatureModal 
show={showModal}
on:save={handleSave} on:cancel={handleCancel} />



{/if}


{#if field.type === 'Lista'}
<div class="col-md-12 mb-2">
    <div class="form-group row">
        <label for="list-container" class="col-md-3">Detalles: </label>
        {#if field.value && field.value.length > 0}
<div class="col-md-12">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Fecha</th>
        <th>Estado</th>
        <th>Parte</th>
        <th>Certificado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each field.value as item, index (item.id)}
      <tr>
        <td>{item.name}</td>
        <td>{item.date}</td>
        <td>{item.status ? 'Activo' : 'Inactivo'}</td>
        <td>{item.part}</td>
        <td>{item.certificate}</td>
        <td>
          <button type="button" class="btn btn-danger btn-sm" on:click={() => removeList(index)}>
            <i class="fa fa-trash"></i> Eliminar
          </button>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>
{:else}
        <div class="col-md-8">
            <div class="row">
                <div class="col-md-12 col-sm-6">
                    <div class="card m-2">
                        <div class="card-body">
                            <p class="card-text">No hay elementos aún, usá el botón + para agregar nuevos detalles.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/if}
        <div class="col-md-1">
            <div class="row">
                <div class="col-md-12">
                  <button type="button" id="add-list" class="btn btn-block btn-lg btn-outline-success" on:click={openListModal}>+</button>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}



<ListModal 
show={showListModal}
on:save={handleListSave} on:cancel={handleListCancel} />

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



      {#if field.type === 'Verificacion'}
      <div class="col-md-12 mb-2">
          <div class="form-group row">
              <label for="list-container" class="col-md-3">Detalles: </label>
              {#if verificationArray && verificationArray.length > 0}
      <div class="col-md-12">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Parte</th>
              <th>Certificado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {#each verificationArray as item, index (item.id)}
            <tr>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td>{item.status ? 'Activo' : 'Inactivo'}</td>
              <td>{item.part}</td>
              <td>{item.certificate}</td>
              <td>
                <select  name="verification" class="form-control" 
                on:change={(event) => updateVerification(event, index)}
                bind:value={item.verification} required>
                  <option selected value="OK">OK</option>
                  <option value="Revisar">Revisar</option>
                  <option value="Reparar">Reparar</option>
                </select>
                
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {:else}
              <div class="col-md-8">
                  <div class="row">
                      <div class="col-md-12 col-sm-6">
                          <div class="card m-2">
                              <div class="card-body">
                                  <p class="card-text">No hay cargado un DTM aún en el sistema.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              {/if}

          </div>
      </div>
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
        on:fileSaved={handleFileUploaded}
        on:fileUpdated={handleFileUpdated}
        on:fileRemoved={handleFileRemoved} 
        />
      </div>
      </div>      </div>

      {/if}
      {#if field.type === 'FechaHora'}
      <div class="col-md-12 mb-2">
        <div class="form-group row">
          <label class="col-md-3" for="field-{index}">{field.name}: </label>
          <div class="col-md-9">
            <FechaHora on:change={handleDateChange} id="field-{index}"  name="field[{index}]" bind:value={fechaHoraValue} />


          </div>
        </div>
      </div>
    {/if}
    {#if field.type === 'Correo'}
  <div class="col-md-12 mb-2">
    <div class="form-group row">
      <label class="col-md-3" for="field-{index}">{field.name}: </label>
      <div class="col-md-9">
        <input type="email" id="field-{index}" name="field[{index}]" class="form-control"
               bind:value={field.value} required>
        {#if field.value !== undefined && !isValidEmail(field.value)}
          <div class="invalid-feedback" style="display: block;">
            Por favor, introduce un correo electrónico válido.
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
    {#if field.type === 'Numero'}
  <div class="col-md-12 mb-2">
    <div class="form-group row">
      <label class="col-md-3" for="field-{index}">{field.name}: </label>
      <div class="col-md-9">
        <input type="number" id="field-{index}" name="field[{index}]" class="form-control" bind:value={field.value} required>
      </div>
    </div>
  </div>
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
  <button type="button" class="btn btn-primary" on:click={prevStep}>Anterior</button>
  <button type="button" class="btn btn-primary" on:click={nextStep}>Siguiente</button>
</div>
  {:else if step === 3}
  <!-- Paso 3: Confirmación y envío -->
  <div>
    <h2>Confirmación</h2>
    <p>Revisa que toda la información sea correcta y presiona 'Enviar'.</p>

    <table class="table">
      <tbody>
        <tr>
          <th scope="row">Tipo de reporte</th>
          <td>{selectedCategory}</td>
        </tr>
        <tr>
          <th scope="row">Proyecto</th>
          <td>{report.project_name}</td>
        </tr>
        {#each Object.keys(selectedCategoryFields) as key}
        <tr>
          <th scope="row">{selectedCategoryFields[key].name}</th>


          {#if selectedCategoryFields[key].type === 'PDF'}

          {#if Array.isArray(selectedCategoryFields[key].value)}
          <td>
              
                {#each selectedCategoryFields[key].value as value}
                  {#if value.url}
                  <span class="badge bg-primary m-2 text-white">
                    
                  <a href={value.url} class="text-white" target="_blank">
                      Archivo
                      #{selectedCategoryFields[key].value.indexOf(value)+1} 
                      <i class="fas fa-external-link-alt"></i>
                  </a>
                    </span>
                  {/if}
                {/each}
              
            </td>
          {:else}
            <td>{selectedCategoryFields[key].value}</td>
          {/if}
    
          {:else if selectedCategoryFields[key].type === 'Proveedor'}
          <td><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/view-provider/'+selectedCategoryFields[key].value.id+'/')}>{selectedCategoryFields[key].value.name}</a></td>
          {:else if selectedCategoryFields[key].type === 'Contacto'}
          <td><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/view-contact/'+selectedCategoryFields[key].value.id+'/')}>{selectedCategoryFields[key].value.name}</a></td>
          {:else if selectedCategoryFields[key].type === 'Cliente'}
          <td><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/view-client/'+selectedCategoryFields[key].value.id+'/')}>{selectedCategoryFields[key].value.name}</a></td>

          {:else if selectedCategoryFields[key].type === 'Firma'}
          <td>

          {#if Array.isArray(selectedCategoryFields[key].value)}
          <div class="col-sm-9 row mb-3">

          {#each selectedCategoryFields[key].value as value}
          <div class="col-4 p-2">
            <div class="card">
              <img src={value.signature} class="card-img-top" alt="Firma" style="max-width: 200px; max-height: 200px;"/>
              <div class="card-body">
                <h5 class="card-title">{value.position}</h5>
                <p class="card-text">{value.clarification}</p>
              </div>
            </div>
          </div>

        {/each} 
      
      </div>


          {/if}
        </td>
        {:else if selectedCategoryFields[key].type === 'Lista'}
      

        {#if Array.isArray(selectedCategoryFields[key].value)}
        <td>
        <div class="col-sm-9 row mb-3">

          <table class="table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Estado</th>
                <th scope="col">Fecha</th>
                <th scope="col">Parte</th>
                <th scope="col">Certificado</th>
              </tr>
            </thead>
            <tbody>
              {#each selectedCategoryFields[key].value as value}
                <tr>
                  <td>{value.name}</td>
                  <td>
                    {#if value.status === 'true'}
                      Activo
                    {:else}
                      Inactivo
                    {/if}
                  </td>
                  <td>{value.date}</td>
                  <td>{value.part}</td>
                  <td>{value.certificate}</td>
                </tr>
              {/each}
            </tbody>
          </table>
      </div>
      </td>
      {/if}
       
      {:else if selectedCategoryFields[key].type === 'Verificacion'}
        

      {#if Array.isArray(verificationArray)}
      <td>
      <div class="col-sm-9 row mb-3">

        <table class="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Estado</th>
              <th scope="col">Fecha</th>
              <th scope="col">Parte</th>
              <th scope="col">Certificado</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each verificationArray as value }
              <tr>
                <td>{value.name}</td>
                <td>
                  {#if value.status === 'true'}
                    Activo
                  {:else}
                    Inactivo
                  {/if}
                </td>
                <td>{value.date}</td>
                <td>{value.part}</td>
                <td>{value.certificate}</td>
                <td>{value.verification}</td>
              </tr>
            {/each}
          </tbody>
        </table>
    </div>
    </td>
    {/if}
     
          {:else}

          <td>{selectedCategoryFields[key].value}</td>
          {/if}

        </tr>  
        {/each}
        
      </tbody>
    </table>
    <button type="button" class="btn btn-primary" on:click={prevStep}>Anterior</button>
    <button type="submit">Enviar</button>
  </div>
{/if}
</div>
  
  </form>
  