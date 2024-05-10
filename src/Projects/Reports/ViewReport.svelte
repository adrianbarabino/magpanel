<script>
    import { onMount } from 'svelte';
    import { saveAs } from 'file-saver';  // Asegúrate de instalar file-saver: npm install file-saver
    import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
    export let id; // Asumiendo que el ID se pasa como prop al componente
    import { loadSingleReportFromDB } from '../../utils/db'; // Importa la función para cargar un reporte desde IndexedDB
    import { isOnline } from '../../stores';
    import { getClients } from '../../utils/api';
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
        isLoading = true;
        errorMessage = '';
        if($isOnline){

       
        const response = await fetch(`https://api.mag-servicios.com/reports/${id}`, {
          headers: {
            'Authorization': 'Bearer '+localStorage.getItem('accessToken'), // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
          }
        });
  
        if (!response.ok) {
          throw new Error('Hubo un problema al obtener los detalles de el reporte');
        }
  
        report = await response.json();
      }else{
        report = await loadSingleReportFromDB(id);
      }
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

            let client = await getClients(report.fields[key].value);

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

    async function createPDF() {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Añadir fondo gris oscuro en la cabecera
    page.drawRectangle({
        x: 0,
        y: height - 100,
        width: width,
        height: 100,
        color: rgb(0.3, 0.3, 0.3),
        opacity: 1,
    });

    // Ajustar la posición y tamaño del logo
    const imageUrl = '/logoblanco.png';
    const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes);
    page.drawImage(image, {
        x: width / 2 - 100, // Centrar el logo en la página, ajusta según necesidad
        y: height - 90, // Ajustar la posición vertical para más espacio
        width: 200, // Ajustar el ancho como sea necesario
        height: 80 // Ajustar la altura como sea necesario
    });

    // Agregar los datos del proyecto debajo del logo, centrados
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 12; // Aumentar el tamaño de fuente si es necesario
    let y = height - 150; // Ajustar según la posición del logo

    // Dibujar el nombre del proyecto
    page.drawText(`${report.category_name}`, {
        x: 50,
        y: y,
        size: fontSize,
        font: fontBold
    });

    // Ajustar el resto de los datos del proyecto debajo
    y -= 15; // Ajustar el espacio entre líneas

    // Dibujar el nombre del proyecto
    page.drawText(`Proyecto: ${report.project_name}`, {
        x: 50,
        y: y,
        size: fontSize,
        font: fontBold
    });

    // Ajustar el resto de los datos del proyecto debajo
    y -= 15; // Ajustar el espacio entre líneas
    page.drawText(`Autor: ${report.author_name}`, {
        x: 50,
        y: y,
        size: fontSize,
        font: font
    });

    y -= 15; // Ajustar espacio para la fecha
    page.drawText(`Fecha de Creación: ${report.created_at}`, {
        x: 50,
        y: y,
        size: fontSize,
        font: font
    });


    y -= 50; // Espacio después del encabezado antes de cualquier contenido adicional


    for (const [key, field] of Object.entries(report.fields)) {
        // Verifica el tipo de campo y aplica lógica condicional
        if (field.type === 'PDF' && Array.isArray(field.value)) {
            field.value.forEach((item, index) => {
                if (item.url) {
                    page.drawText(`PDF Archivo ${index + 1}: ${item.url}`, { x: 50, y, size: fontSize, font });
                    y -= 10;
                }
            });
        } else if (field.type === 'Proveedor' || field.type === 'Contacto' || field.type === 'Cliente') {
            page.drawText(`${key}: ${field.value.name} (ID: ${field.value.id})`, { x: 50, y, size: fontSize, font });
            y -= 10;
        }  else if (field.type === 'FechaHora') {
            page.drawText(`${field.name}: ${field.value})`, { x: 50, y, size: fontSize, font });
            y -= 10;
        }  else if (field.type === 'Texto') {
            page.drawText(`${field.name}: ${field.value}`, { x: 50, y, size: fontSize, font });
            y -= 10;
        } else if (field.type === 'Firma' && Array.isArray(field.value)) {
          for (const signature of field.value) {
                const signatureImageBytes = await fetch(signature.signature).then(res => res.arrayBuffer());
                const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
                page.drawImage(signatureImage, {
                    x: 50,
                    y: y - 50,
                    width: 100,
                    height: 50
                });
                page.drawText(`Firma - ${signature.position}: ${signature.clarification}`, { x: 160, y: y - 25, size: fontSize, font });
                y -= 60; // Ajusta el espacio para las firmas
                if (y < 50) {
                    page = pdfDoc.addPage();
                    y = height - 50;
                }
            }
        } else         if (field.type === 'Lista' && Array.isArray(field.value)) {
            // Encabezados de la tabla
            const headers = ['Nombre', 'Estado', 'Fecha'];
            const columnWidth = 150;
            let x = 50;  // Posición inicial x para las columnas

            // Dibujar encabezados
            headers.forEach((header, index) => {
                page.drawText(header, { x: x + index * columnWidth, y, size: fontSize, font });
            });
            y -= 20;  // Espacio antes de comenzar a listar los elementos

            // Dibujar las filas de la tabla
            for (const item of field.value) {
                let xValue = 50;  // Restablecer la posición x para cada nueva fila
                page.drawText(item.name, { x: xValue, y, size: fontSize, font });
                xValue += columnWidth;  // Mover a la siguiente columna
                page.drawText(item.status, { x: xValue, y, size: fontSize, font });
                xValue += columnWidth;  // Mover a la siguiente columna
                page.drawText(item.date, { x: xValue, y, size: fontSize, font });

                y -= 15;  // Espacio entre filas
                if (y < 50) {  // Comprobar si se necesita una nueva página
                    page = pdfDoc.addPage();
                    y = height - 50;
                }
            }
            y -= 20;  // Espacio adicional después de la tabla
        }  else if (field.type === 'Verificacion' && Array.isArray(field.value)) {
    // Encabezados de la tabla y ancho específico para cada uno
    const headers = [
        { text: 'Nombre', width: 160 },
        { text: 'Estado', width: 60 },
        { text: 'Fecha', width: 90 },
        { text: 'Parte y Certificado', width: 120 },
        { text: 'Verificación', width: 60 }
    ];
    let x = 50;  // Posición inicial x para las columnas
    const yStart = y;  // Posición inicial y (asume una variable 'y' ya definida)

    // Dibujar encabezados
    headers.forEach(header => {
        page.drawText(header.text, { x: x, y: yStart, size: fontSize, font });
        x += header.width;  // Mover x a la siguiente posición de columna
    });
    y = yStart - 20;  // Espacio antes de comenzar a listar los elementos

    // Dibujar las filas de la tabla
    for (const item of field.value) {
        let xValue = 50;  // Restablecer la posición x para cada nueva fila
        page.drawText(item.name, { x: xValue, y, size: fontSize, font });
        xValue += headers[0].width;  // Mover a la siguiente columna

        page.drawText(item.status, { x: xValue, y, size: fontSize, font });
        xValue += headers[1].width;  // Mover a la siguiente columna

        page.drawText(item.date, { x: xValue, y, size: fontSize, font });
        xValue += headers[2].width;  // Mover a la siguiente columna

        page.drawText(item.part + " / " + item.certificate, { x: xValue, y, size: fontSize, font });
        xValue += headers[3].width;  // Mover a la siguiente columna

        page.drawText(item.verification, { x: xValue, y, size: fontSize, font });
        y -= 15;  // Espacio entre filas

        if (y < 50) {  // Comprobar si se necesita una nueva página
            page = pdfDoc.addPage();
            y = height - 50;  // Restablecer la posición y al inicio de la nueva página
        }
    }
    y -= 20;  // Espacio adicional después de la tabla
} else {
            // Para otros tipos o valores simples
            page.drawText(`${key}: ${field}`, { x: 50, y, size: fontSize, font });
            y -= 10;
        }

        // Añadir nueva página si es necesario
        if (y < 50) {
            page = pdfDoc.addPage();
            y = height - 50;
        }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'reporte.pdf');
}

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

        {/each} 
      
      </div>

          {/if}
         
          {:else if report.fields[key].type === 'Lista'}
        

          {#if Array.isArray(report.fields[key].value)}
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
                {#each report.fields[key].value as value}
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
        {/if}
         
        {:else if report.fields[key].type === 'Verificacion'}
        

        {#if Array.isArray(report.fields[key].value)}
        <div class="col-sm-9 row mb-3">

          <table class="table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Estado</th>
                <th scope="col">Fecha</th>
                <th scope="col">Parte</th>
                <th scope="col">Certificado</th>
                <th scope="col">Verificación</th>
              </tr>
            </thead>
            <tbody>
              {#each report.fields[key].value as value}
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
      <button on:click={createPDF}>Descargar PDF</button>

    </div>
  {/if}
  