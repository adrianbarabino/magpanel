<script>
    import { createEventDispatcher } from 'svelte';
    export let types = [];
    export let folder = 'pdfs';
    const dispatch = createEventDispatcher();
    let localFiles = [];
    let progress = 0;
    let uploadedFiles = [];
    let abortControllers = new Map(); // Para controlar la cancelación de las subidas

    function handleFileChange(event) {
        localFiles = Array.from(event.target.files);
        uploadFiles();
    }

    async function uploadFiles() {
        const totalFiles = localFiles.length;
        let uploadedCount = 0;

        for (const file of localFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);
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
                    uploadedFiles = [...uploadedFiles, { file, url: fileUrl }];
                    dispatch('fileUploaded', { file, url: fileUrl }); // Añade esta línea para enviar los datos al padre

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

            progress = (uploadedCount / totalFiles) * 100;
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

        const uploadedFile = uploadedFiles.find(f => f.file.name === file.name);
        if (uploadedFile) {
            deleteFile(uploadedFile.url); // Llama a la función para eliminar el archivo subido
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
</script>

<div>
    <input type="file" multiple accept={getAcceptedTypes()} on:change={handleFileChange}>
    <progress max="100" value={progress}></progress>

    {#each localFiles as file}
        <div>
            <span>{file.name}</span>
            {#if uploadedFiles.find(item => item.file.name === file.name)}
                <span style="color: green; margin-left: 5px;">✔️</span>
                <a href={uploadedFiles.find(item => item.file.name === file.name).url} target="_blank">Ver archivo</a>
            {/if}
            <button on:click={() => cancelUpload(file)}>
                <i class="fa fa-trash"></i>
            </button>
        </div>
    {/each}
</div>

<style>
    progress {
        width: 100%;
        margin-top: 10px;
    }
</style>
