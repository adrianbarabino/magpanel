<!-- LocationMap.svelte -->
<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import { uniqueId } from 'lodash-es'; // Asumiendo que tienes lodash instalado
  
    export let lat;
    export let lng;
  
    // Genera un ID único para cada instancia del mapa basado en las coordenadas
    let mapId = `map-${uniqueId()}`;
    let mapContainer;
  
    onMount(() => {
      const map = L.map(mapId).setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.marker([lat, lng]).addTo(map);
  
      // El mapa necesita ser visible para que este llamado funcione correctamente
      setTimeout(() => map.invalidateSize(), 100);
    });
    console.log("hola");
    console.log(location);
  </script>
  
  <style>
    .map-container {
      height: 200px;
      width: 200px;
      overflow: hidden;
    }
  </style>
  
  <!-- Usa el ID único para el contenedor del mapa -->
  <div id="{mapId}" class="map-container"></div>
  