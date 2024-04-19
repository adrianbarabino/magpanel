<script>
    import { createEventDispatcher } from 'svelte';
    import SignaturePad from './SignaturePad.svelte';


    const dispatch = createEventDispatcher();
    export let show = false;
    let clarification = '';
    let rsvp;
    let position = '';
    let signaturePad;

    let signatureImage = '';

    // Usar una declaración reactiva para obtener la imagen de la firma
    

    function handleSave() {
        
        console.log("Guardamos");
        console.log(signaturePad)
        console.log(signatureImage)
        signatureImage = signaturePad.getSignatureImage();
        console.log(signatureImage)

        if (signatureImage) {
            // generate timestamp U
 
            let timestamp = new Date();
            // timestamp format in unix time
            timestamp = Math.floor(timestamp.getTime() / 1000);
            dispatch('save', { signatureImage, clarification, position, timestamp });
            signaturePad.clearSignature(); // Limpia el canvas después de guardar
            clarification = '';
            position = '';
            signatureImage = '';

            show = false; // Cierra el modal después de guardar
        }
    }

    function handleClose() {
        show = false;
        signaturePad.clearSignature(); // Limpia el canvas al cerrar sin guardar
        // clear inputs
        signatureImage = '';
        clarification = '';
        position = '';


        dispatch('cancel');
    }
</script>

{#if show}
<div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Firma</h5>
                <button type="button" class="btn-close" on:click={handleClose}></button>
            </div>
            <div class="modal-body">
                <SignaturePad bind:this={signaturePad} id="signature-pad" />
                <div class="form-group mb-3">
                    <label for="clarification">Aclaración</label>
                    <input type="text" class="form-control" placeholder="Aclaración" bind:value={clarification} />
                </div>

                <div class="form-group mb-3">
                    <label for="rsvp">Asistio</label>
                    <input type="checkbox" class="form-control" bind:value={rsvp} />
                </div>

                <div class="form-group mb-3">
                    <label for="position">Cargo</label>
                    <input type="text" class="form-control" placeholder="Cargo" bind:value={position} />
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
