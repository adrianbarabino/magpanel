<script>
  import { broteNavigate } from '../utils/navigation';
  import Swal from 'sweetalert2';
  import { onMount } from 'svelte';
  import MultiSelect from 'svelte-multiselect'

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
  onMount(async () => {
    try {
      const response = await fetch('https://api.mag-servicios.com/clients', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los clientes');
      }

      clients = await response.json();

        // Convertir la lista de clientes en opciones para el MultiSelect
   options = clients.map(client => ({
    label: `${client.name} (ID: ${client.id})`, // Esto es lo que se muestra en la UI
    value: client.id // Esto es el valor que se selecciona, podrías usar el objeto completo si lo necesitas
  }));



    } catch (error) {
      console.error(error.message);
      // Considera mostrar un mensaje al usuario aquí
    }
  });

  const submitForm = async () => {
    try {
      contact.client_ids = selected.map(client => client.value);
      const response = await fetch('https://api.mag-servicios.com/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify(contact)
      });

      if (!response.ok) {
        const responseText = await response.text();
        Swal.fire({
          title: 'Error al crear el Contacto',
          text: 'Por favor verifica los datos del formulario: ' + responseText,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      console.log('Contacto creado con éxito');
      Swal.fire({
        title: 'Contacto creado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        broteNavigate('/contacts');
      });
    } catch (error) {
      console.error(error.message);
      // Considera mostrar un mensaje al usuario aquí
    }
  };
</script>

<h1 class="mb-4">Crear Contacto <small class="text-muted">Crear un nuevo contacto</small></h1>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/contacts')}>Contactos</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar</li>
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

  <button type="submit" class="btn btn-primary">Crear Contacto</button>
</form>
