<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let show = false;
    let name = '';
    let date = '';
    let status;
    let part = '';
    let certificate = '';

    function handleSave() {
        // Aquí podrías agregar la lógica para procesar o enviar los datos recolectados
        dispatch('save', { name, date, status, part, certificate });
        show = false; // Cierra el modal después de guardar
    }

    function handleClose() {
        show = false;
        // Restablecer valores
        name = '';
        date = '';
        status = false;
        part = '';
        certificate = '';
        dispatch('cancel');
    }
</script>

{#if show}
<div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Detalles del Registro</h5>
                <button type="button" class="btn-close" on:click={handleClose}></button>
            </div>
            <div class="modal-body">
                <div class="form-group mb-3">
                    <label for="name">Nombre:</label>
                    <input type="text" class="form-control" bind:value={name} />
                </div>

                <div class="form-group mb-3">
                    <label for="date">Fecha:</label>
                    <input type="date" class="form-control" bind:value={date} />
                </div>

                <div class="form-group mb-3">
                    <label for="status">Estado:</label>

                    <select class="form-control" bind:value={status}>
                        <option selected value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>

                <div class="form-group mb-3">
                    <label for="part">Parte:</label>
                    <input type="text" class="form-control" bind:value={part} />
                </div>

                <div class="form-group mb-3">
                    <label for="certificate">Certificado:</label>
                    <input type="text" class="form-control" bind:value={certificate} />
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" on:click={handleSave}>Guardar</button>
                <button type="button" class="btn btn-secondary" on:click={handleClose}>Cancelar</button>
            </div>
        </div>
    </div>
</div>
<div class="modal-backdrop show"></div>
{/if}

<style>
    .modal.show {
        display: block;
    }
    .modal-backdrop.show {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1040;
        background-color: #000;
        opacity: 0.5;
    }
</style>
