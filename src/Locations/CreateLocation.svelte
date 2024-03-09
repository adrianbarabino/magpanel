<script>
    import { onMount } from 'svelte';

  import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
  import Swal from 'sweetalert2';
  import L from 'leaflet';

  let location = {
    id: 0,
    name: '',
    lat: -34.603722, // Valores predeterminados para la inicialización del mapa
    lng: -58.381592,
    state: '',
    city: '',
    country: 'Argentina' // Argentina como predeterminado
  };
  let map;
  let marker;
  const provincesArgentina = ['Buenos Aires', 'Santa Cruz', 'Chubut', 'Tierra del Fuego', 'Rio Negro', 'Neuquen']
  const regionsChile = ['Magallanes']
  // Variables reactivas para manejar las provincias/estados basados en el país seleccionado
  let statesOptions = location.country === 'Argentina' ? provincesArgentina : regionsChile;

  $: {
    location.state = statesOptions.includes(location.state) ? location.state : '';
  }
  $: location.state = statesOptions.includes(location.state) ? location.state : '';
  async function getDeviceLocation() {
    if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
        return;
    }

    try {
        navigator.geolocation.getCurrentPosition(function(position) {
            location.lat = position.coords.latitude;
            location.lng = position.coords.longitude;

            // Actualiza el marcador cada vez que se obtiene una nueva ubicación
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([location.lat, location.lng]).addTo(map);
            map.setView([location.lat, location.lng], 13);
        });
    } catch (error) {
        console.error(error.message);
    }
}
  // parse int 

  onMount(async () => {
  try {

  let mapId = `map`;


map = L.map(mapId).setView([location.lat, location.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  let marker = L.marker([location.lat, location.lng]).addTo(map);
// Agregando manejador de clic en el mapa para actualizar las coordenadas
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    location.lat = lat;
    location.lng = lng;

    // Actualiza el marcador cada vez que se hace clic en una nueva ubicación
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map);
  });
  // El mapa necesita ser visible para que este llamado funcione correctamente
  setTimeout(() => map.invalidateSize(), 100);

} catch (error) {
  console.error(error.message);
}
  });
  
  
  const submitForm = async () => {
    try {


      const response = await fetch('https://api.mag-servicios.com/locations', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(location)
      });

      if (!response.ok) {
        throw new Error('Error al crear el locationo');
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de locationos
      console.log('Ubicación creada con éxito');
Swal.fire({
        title: 'Ubicación creada con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
          broteNavigate('/locations');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<!-- Título y Breadcrumb para "Nuevo Categoria" -->
<h1 class="mb-4">Nueva Ubicación <small class="text-muted">Crea un nueva ubicación</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/locations')}>Ubicaciones</a></li>
    <li class="breadcrumb-item active" aria-current="page">Nueva</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <!-- Campo para el nombre -->
  <div class="form-group">
    <label for="name">Nombre</label>
    <input id="name" class="form-control" type="text" bind:value={location.name} required>
  </div>

  <!-- Selector de país -->
  <div class="form-group">
    <label for="country">País</label>
    <select id="country" class="form-control" bind:value={location.country}>
      <option value="Argentina">Argentina</option>
      <option value="Chile">Chile</option>
    </select>
  </div>

  <!-- Selector de provincia/estado -->
  <div class="form-group">
    <label for="state">Provincia/Estado</label>
    <select id="state" class="form-control" bind:value={location.state}>
      {#each statesOptions as state}
        <option value="{state}">{state}</option>
      {/each}
    </select>
  </div>

  <!-- Campo para la ciudad -->
  <div class="form-group">
    <label for="city">Ciudad</label>
    <input id="city" class="form-control" type="text" bind:value={location.city} required>
  </div>

  <button on:click|preventDefault={getDeviceLocation} class="btn btn-secondary">Obtener ubicación del dispositivo</button>
  <!-- Contenedor del mapa -->
  <div id="map" style="height: 200px;"></div>
  <!-- Campo para la ciudad -->
  <div class="form-group">
    <label for="lat">Latitud</label>
    <input id="lat" class="form-control" type="text" bind:value={location.lat} required>
  </div>
  <!-- Campo para la ciudad -->
  <div class="form-group">
    <label for="lng">Longitud</label>
    <input id="lng" class="form-control" type="text" bind:value={location.lng} required>
  </div>

  <button type="submit" class="btn btn-primary">Crear Ubicación</button>
</form>