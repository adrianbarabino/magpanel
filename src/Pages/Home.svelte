<script>
    import { onMount } from 'svelte';
    import Swal from 'sweetalert2';
    import { getProjects } from '../utils/api';
    import { loadProjectsFromIDB } from '../utils/db';
    let projects = [];
    let logs = [];

    onMount(async () => {
        try {



            const logsResponse = await fetch('https://api.mag-servicios.com/logs?limit=5', {
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                }
            });



            projects = await loadProjectsFromIDB();
            // if not, fetch from the api
            if (!projects.length) {
            projects = await getProjects();
            }



            logs = await logsResponse.json();
        } catch (error) {
            console.error(error.message);
        }
    });

    const submitForm = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        // Aquí puedes hacer algo con los datos, como enviarlos a un servidor
        console.log(data);

        const response = await fetch('https://api.mag-servicios.com/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('accessToken')
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const responseText = await response.text();
            Swal.fire({
                title: 'Error al enviar la consulta',
                text: 'Por favor verifica los datos del formulario: '+responseText,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }else{

        // Mostrar Sweet Alert
        Swal.fire({
            title: '¡Consulta enviada!',
            text: 'Nos pondremos en contacto contigo pronto.',
            icon: 'success',
            confirmButtonText: 'Ok'
        });

        // Limpiar el formulario
        event.target.reset();
        
        }

    };
</script>

<style>
    h2, h3 {
        color: #2c3e50;
    }
    p {
        line-height: 1.6;
    }
    .container {
        max-width: 800px;
        margin: auto;
    }
</style>

<div class="container">
    <div class="welcome-section p-3 bg-light rounded">
        <h2>Bienvenido a la Plataforma de Gestión de MAG Servicios</h2>
        <p>Esta plataforma te permite gestionar de manera eficiente todas las tareas relacionadas con nuestros servicios. Desde aquí, podrás acceder a diferentes módulos diseñados para simplificar y optimizar tus operaciones diarias.</p>
    </div>
    <div class="row">

    <div class="data-section my-3 col-md-6">
        <h3>Últimos Proyectos</h3>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {#each projects.slice(0, 5) as project}
                        <tr>
                            <td>{project.name}</td>
                            <td>{project.status_name}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        </div>
        <div class="data-section my-3 col-md-6">
        <h3>Últimos Registros</h3>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {#each logs as log}
                        <tr>
                            <td>{log.type}</td>
                            <td>{log.created_at}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <div class="feedback-form my-3 col-md-12">
        <h3>Reportar un Problema o Dejar Consultas</h3>
        <form on:submit={submitForm}>

            <div class="mb-3">
                <textarea name="message" class="form-control" placeholder="Describe tu consulta o problema aquí"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
    </div>
</div>
</div>
