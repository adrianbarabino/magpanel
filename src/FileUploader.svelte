<script>
    import Swal from 'sweetalert2';
    import { createEventDispatcher } from 'svelte';
    import { isOnline } from './stores.js';
    import { saveFileLocally } from './utils/api.js';

    export let types = [];
    export let folder = 'pdfs';
    let files = [];
    let online = false;
    let localFiles = [];
    let uploadedFiles = [];
    let abortControllers = new Map();

    const dispatch = createEventDispatcher();

    isOnline.subscribe(value => {
        online = value;
        if (online) {
            // Intentar subir archivos que estaban en cola
            localFiles.forEach(file => {
                if (file.status === 'saved') uploadFile(file);
            });
        }
    });

    function handleFileChange(event) {
        const newFiles = Array.from(event.target.files);
        localFiles = [...localFiles, ...newFiles.map(file => ({ file, status: 'pending', name: file.name }))];

        uploadFiles();
    }

    function uploadFiles() {
    // Crear un nuevo array para manejar correctamente la reactividad
    let index = 0;
    localFiles = localFiles.map(file => {
        if (online && file.status === 'pending') {
            // Establecer inicialmente el estado a 'uploading'
            const updatedFile = { ...file, status: 'uploading' };
            
            uploadFile(updatedFile).then(response => {
                // Actualización exitosa, establece el estado a 'complete'
                response.status = 'complete';
                localFiles[index].status = 'complete';
                response.url = response.url;
                response.name = response.file.name;
                // Actualizar la lista de archivos subidos
                uploadedFiles = [...uploadedFiles, response];
                // Disparar un evento para informar que el archivo se ha subido
                dispatch('fileUploaded', response);
                console.log("Archivo subido:", response);
                console.log("UploadedFiles array:", uploadedFiles);
                console.log("LocalFiles array:", localFiles);
            }).catch(error => {
                console.error('Error al subir archivo:', error);
                // En caso de error, establecer el estado a 'error'
                updatedFile.status = 'error';
                dispatch('fileError', updatedFile);
            });

            // Retornar el archivo con estado 'uploading' mientras se sube
            return updatedFile;
        } else if (!online) {
            saveFileLocally(file.file);
            dispatch('fileSaved', file);

            // Si está offline, marcar como 'saved locally'
            return { ...file, status: 'saved locally' };
        }
        index += 1;
        return file;
    });

    // Disparar un evento una vez que todos los archivos hayan sido procesados
    dispatch('filesUploaded', uploadedFiles);
}


async function uploadFile(fileWrapper) {
    if (!online) {
        return Promise.reject(new Error("No hay conexión a internet"));
    }

    const formData = new FormData();
    formData.append('file', fileWrapper.file);
    formData.append('folder', folder);
    const abortController = new AbortController();
    fileWrapper.abortController = abortController;

    try {
        const response = await fetch('https://api.mag-servicios.com/attachments', {
            method: 'POST',
            body: formData,
            signal: abortController.signal,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        });

        if (response.ok) {
            const fileUrl = await response.text();
            return { ...fileWrapper, status: 'complete', url: fileUrl }; // Devuelve un objeto actualizado
        } else {
            throw new Error('Error al subir archivo: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error de red o subida cancelada:', error);
        throw error; // Re-lanza el error para manejarlo en el catch de .then()
    }
}



    function cancelUpload(fileWrapper) {
        fileWrapper.abortController?.abort();
        localFiles = localFiles.filter(f => f !== fileWrapper);
        uploadedFiles = uploadedFiles.filter(f => f !== fileWrapper);
        dispatch('fileRemoved', fileWrapper);
    }

    // Función para manejar el evento dragover en el área de drop
    function handleDragOver(event) {
        event.preventDefault();
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

async function deleteFile(fileUrl) {
    if (!online) {
        console.log("Intento de eliminar archivo mientras se está offline.");
        // Aquí podrías, por ejemplo, almacenar las URLs para eliminar más tarde.
        
        return;
    }

    try {
        fileUrl = fileUrl.split('.com/')[1]; // Considera validar la URL antes de modificarla
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
            uploadedFiles = uploadedFiles.filter(f => f.url.split('.com/')[1] !== fileUrl);
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


<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="drop-area" on:drop={handleDrop} on:dragover={handleDragOver} on:click={handleClick}>
    Arrastra tus archivos aquí o <strong>clickea para seleccionarlos</strong>
    <input id="fileInput" type="file" multiple accept={getAcceptedTypes()} on:change={handleFileChange} hidden>
</div>

{#each localFiles as file}
    <div>
        <span class="badge bg-primary">{file.name}</span>
        {#if file.status == 'complete'}
            <a href={uploadedFiles.find(item => item.file.name === file.name).url} class="btn btn-success btn-sm" target="_blank"><i class="fa-solid fa-eye"></i></a>
        {:else if file.status == 'uploading'}
            <a href="#" class="btn btn-secondary btn-sm" target="_blank" disabled><i class="fa fa-spinner fa-spin"></i></a>
        {:else if file.status === 'saved locally'}
            <span class="badge bg-info">
                <i class="fa fa-save"></i>
            </span>
        {/if}
        <a href="#" on:click={() => cancelUpload(file)} class="btn btn-danger btn-sm text-white"><i class="fa fa-trash"></i></a>
    </div>
{/each}