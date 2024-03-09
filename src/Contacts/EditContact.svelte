<script>
  import { onMount } from 'svelte';
    import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
    import Swal from 'sweetalert2';
    import MultiSelect from 'svelte-multiselect'

  export let id; // ID del contacto para editar

let contact = {
  name: '',
  position: '',
  phone: '',
  email: '',
  client_ids: []
};

let selected = [];
let clients = [];
let options = [];

    let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {
    try {
      

      const responseClients = await fetch('https://api.mag-servicios.com/clients', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          }
        });

        if (!responseClients.ok) {
          throw new Error('Error al cargar los clientes');
        }

        clients = await responseClients.json();

          // Convertir la lista de clientes en opciones para el MultiSelect
    options = clients.map(client => ({
      label: `${client.name} (ID: ${client.id})`, // Esto es lo que se muestra en la UI
      value: client.id // Esto es el valor que se selecciona, podrías usar el objeto completo si lo necesitas
    }));



      const response = await fetch(`https://api.mag-servicios.com/contacts/${id}`, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'),
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del contacto');
      }

      contact = await response.json();
      selected = options.filter(option => contact.client_ids.includes(option.value));
    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

    } catch (error) {
      console.error(error.message);
    }
  });

  $: if (selected) {
  contact.client_ids = selected.map(client => client.value);
}
  const submitForm = async () => {
    try {

      const response = await fetch(`https://api.mag-servicios.com/contacts/${contact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto'
        },
        body: JSON.stringify(contact)
      });

      if (!response.ok) {
        const responseText = await response.text();
        Swal.fire({
          title: 'Error al actualizar el Contacto',
          text: 'Por favor verifica los datos del formulario: '+responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      // Manejar la respuesta exitosa
      console.log('Contacto actualizado con éxito');
Swal.fire({
        title: 'Contacto actualizado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
                broteNavigate('/contacts');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Editar Contacto <small class="text-muted">Asegurate de guardar los cambios</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/contacts')}>Contactos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Editar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>

    <div class="form-group">
      <label for="name">Nombre</label>
      <input id="name" class="form-control" type="text" bind:value={contact.name} required>
    </div>
  
    <div class="form-group">
      <label for="position">Posición</label>
      <input id="position" class="form-control" type="text" bind:value={contact.position}>
    </div>
  
    <div class="form-group">
      <label for="phone">Teléfono</label>
      <input id="phone" class="form-control" type="tel" bind:value={contact.phone}>
    </div>
  
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" class="form-control" type="email" bind:value={contact.email} required>
    </div>
  
    <div class="form-group">
      <label>Clientes Asociados</label>
  
      <MultiSelect
        bind:selected
        options={options}
        placeholder="Elige un cliente..."
      />
    </div>
  
  <button type="submit" class="btn btn-primary">Actualizar Contacto</button>
</form>