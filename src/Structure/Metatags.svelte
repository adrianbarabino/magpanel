<script>
  import { pageMeta } from '../stores.js'; // Asegúrate de importar correctamente el store

  // Función para actualizar los metadatos basada en la ruta
  export function updateMeta(route) {
    console.log("Cambiamos la ruta: "+route);

    const metatags = {
      '/': { title: 'Inicio', slug: 'inicio' },
      '/clients': { title: 'Clientes', slug: 'clientes' },
      // Agrega el resto de tus rutas y sus metadatos aquí
    };

    const meta = metatags[route] || {
      title: 'Título Predeterminado',
      slug: 'slug-predeterminado',
    };

    pageMeta.set(meta);
  }
</script>
