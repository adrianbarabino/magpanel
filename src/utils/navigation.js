// src/utils/navigation.js

import { navigate } from 'svelte-routing';
import { updateMeta } from '../metatags.js'; // Importa desde el archivo JS

// Función para manejar el cambio de ruta y actualizar metadatos, etc.
  function handleRouteChange() {
    updateMeta(window.location.pathname, "asd");
  }


// Función de envoltura para navigate que también llama a handleRouteChange
export function broteNavigate(to, options = {}) {
  navigate(to, options); // Llama a la función navigate original con los parámetros proporcionados
  handleRouteChange(); // Llama a tu función handleRouteChange después de navegar
}
