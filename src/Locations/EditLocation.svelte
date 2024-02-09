<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import L from 'leaflet';
  

  // Provincias/Estados de Argentina y Chile
  const provincesArgentina = ['Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', /* ... otras provincias ... */];
  const regionsChile = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', /* ... otras regiones ... */];

  let map;
  let marker;
  
  export let id;

  let location = {
    id: 0,
    name: '',
    lat: -34.603722, // Valores predeterminados para la inicialización del mapa
    lng: -58.381592,
    state: '',
    city: '',
    country: 'Argentina' // Argentina como predeterminado
  };

  // Variables reactivas para manejar las provincias/estados basados en el país seleccionado
  let statesOptions = location.country === 'Argentina' ? provincesArgentina : regionsChile;

  $: {
    location.state = statesOptions.includes(location.state) ? location.state : '';
  }
  $: location.state = statesOptions.includes(location.state) ? location.state : '';



onMount(async () => {
  try {

    const response = await fetch(`https://api.mag-servicios.com/locations/${id}`, {
      headers: {
        'Authorization': 'token-secreto',
      }
    });

    
    if (!response.ok) {
      throw new Error('Error al cargar los datos dla ubicación');
    }
    let mapId = `map`;

    location = await response.json();
    const map = L.map(mapId).setView([location.lat, location.lng], 13);
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

const saveLocation = async () => {
  try {
    const response = await fetch(`https://api.mag-servicios.com/locations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token-secreto'
      },
      body: JSON.stringify(location)

    });

    if (!response.ok) {
      throw new Error('Error al actualizar la ubicación');
    }

    console.log('Ubicación editada con éxito');

    navigate('/locations');
    // Manejo post actualización exitosa, p.ej., redireccionar al usuario
  } catch (error) {
    console.error(error.message);
  }
};

const submitForm = async () => {
  try {
    const response = await fetch(`https://api.mag-servicios.com/locations/${locations.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token-secreto'
      },
      body: JSON.stringify(locations)
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la ubicación');
    }

    // Manejar la respuesta exitosa
    console.log('Locationo actualizado con éxito');
              navigate('/');

  } catch (error) {
    console.error(error.message);
  }
};
</script>


<form on:submit|preventDefault={saveLocation}>
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
  <button type="submit" class="btn btn-primary">Editar Ubicación</button>
</form>

<style>
  /* Estilos adicionales si son necesarios */
</style>
