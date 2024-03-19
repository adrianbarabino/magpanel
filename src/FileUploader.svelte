<script>
    import Swal from 'sweetalert2';
    import { createEventDispatcher } from 'svelte';

    export let types = []; // Tipos de archivo aceptados
    export let folder = 'pdfs'; // Carpeta de destino
    let localFiles = []; // Lista de archivos seleccionados
    let uploadedFiles = []; // Lista de archivos subidos
    let abortControllers = new Map(); // Mapa para controlar la cancelación de subidas

    const dispatch = createEventDispatcher();


    function handleFileChange(event) {
        localFiles = [...localFiles, ...Array.from(event.target.files)];
    console.log("Archivo(s) seleccionado(s) con clic:", localFiles);
    uploadFiles();
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    console.log("Archivos arrastrados:", files);

    const validFiles = files.filter(file => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return types.includes("."+fileExtension);
    });
    console.log("Archivos válidos (drag and drop):", validFiles);

    if (validFiles.length > 0) {
        localFiles = [...localFiles, ...validFiles];
        uploadFiles();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Los archivos arrastrados no son válidos según los tipos aceptados.',
        });
    }
}

    // Función para manejar el evento dragover en el área de drop
    function handleDragOver(event) {
        event.preventDefault();
    }

    async function uploadFiles() {
        const totalFiles = localFiles.length;
        let uploadedCount = 0;
        console.log(localFiles);
    console.log("Iniciando carga de archivos:", localFiles);
    for (const file of localFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        console.log("Contenido de formData antes de la carga:");
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }
            console.log(formData);
            console.log(formData.get('file'))
            console.log(formData.get('folder'))

            const abortController = new AbortController(); // Controlador para cancelar la solicitud

            try {

                const response = await fetch('https://api.mag-servicios.com/attachments', {
                    method: 'POST',
                    body: formData,
                    signal: abortController.signal, // Asociamos el signal al fetch
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });

                uploadedCount++;
                if (response.ok) {
                    const fileUrl = await response.text();
                    uploadedFiles = [...uploadedFiles, { file, url: fileUrl, id: Date.now() }];
                    dispatch('fileUploaded', { file, url: fileUrl, id: Date.now() }); // Añade esta línea para enviar los datos al padre

                } else {
                    console.error('Error al subir archivo:', response.statusText);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Subida cancelada:', file.name);
                } else {
                    console.error('Error de red:', error);
                }
            }

            abortControllers.set(file.name, abortController);
        }

        dispatch('filesUploaded', uploadedFiles);
    }

    function cancelUpload(file) {

    const controller = abortControllers.get(file.name);
    if (controller) {
        controller.abort(); // Cancela la subida
        abortControllers.delete(file.name);
        localFiles = localFiles.filter(f => f.name !== file.name); // Elimina el archivo de la lista local
    }

    // Eliminar el archivo del listado de archivos subidos
    const fileIndex = uploadedFiles.findIndex(f => f.file.name === file.name);
    if (fileIndex !== -1) {
        const uploadedFile = uploadedFiles[fileIndex];
        console.log(uploadedFile);
        file.id = uploadedFiles[fileIndex].id

        // Eliminar el archivo de uploadedFiles
        uploadedFiles.splice(fileIndex, 1);

        // Actualizar el estado para reflejar la eliminación en la UI
        uploadedFiles = [...uploadedFiles];

        // get file id from uploadedFiles 

        // Opcional: Notificar al componente padre sobre la cancelación y eliminación
        dispatch('fileRemoved', { file });

        // Si el archivo fue subido, proceder a eliminarlo del servidor
        if (uploadedFile) {
            deleteFile(uploadedFile.url); // Llama a la función para eliminar el archivo subido del servidor
        }
    }
}



    async function deleteFile(fileUrl) {
    try {
        // Suponemos que tienes un endpoint en tu API para eliminar archivos
        // y que fileUrl contiene la ruta necesaria para identificar el archivo a eliminar.

        // sacar la primera parte de la url hasta el .com/ 
        fileUrl = fileUrl.split('.com/')[1];
        const formData = new FormData();
            formData.append('fileId', fileUrl);
        const response = await fetch('https://api.mag-servicios.com/attachment-remove', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),

            },
            
            body: formData
        });

        if (response.ok) {
            console.log('Archivo eliminado correctamente.');
            // Elimina el archivo de la lista de archivos subidos
            uploadedFiles = uploadedFiles.filter(f => f.url !== fileUrl);
        } else {
            throw new Error(`Error al eliminar el archivo: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
    }
}

    function getAcceptedTypes() {
        return types.length > 0 ? types.join(',') : '*';
    }
    function handleClick() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    }
</script>


<div class="drop-area" on:drop={handleDrop} on:dragover={handleDragOver} on:click={handleClick}>
    Arrastra tus archivos aquí o <strong>clickea para seleccionarlos</strong>
    <input id="fileInput" type="file" multiple accept={getAcceptedTypes()} on:change={handleFileChange} hidden>
</div>

{#each localFiles as file}
    <div>
        <span class="badge bg-primary">{file.name}</span>
        {#if uploadedFiles.find(item => item.file.name === file.name)}
            <a href={uploadedFiles.find(item => item.file.name === file.name).url}  class="btn btn-success btn-sm" target="_blank"><i class="fa-solid fa-eye"></i>
            </a>
        {:else}
        <a href="#" class="btn btn-secondary btn-sm" target="_blank" disabled><i class="fa fa-spinner fa-spin"></i></a>
        {/if}
        <a href="#" on:click={() => cancelUpload(file)} class="btn btn-danger btn-sm text-white">
            <i class="fa fa-trash"></i>
        </a>
    </div>
{/each}