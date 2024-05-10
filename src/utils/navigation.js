// src/utils/navigation.js

import { navigate } from 'svelte-routing';
import Swal from 'sweetalert2'; // Importa desde el paquete npm
import { updateMeta } from '../metatags.js'; // Importa desde el archivo JS
import { isOnline } from '../stores.js'; // Importa desde el archivo JS
import { get } from 'svelte/store'; // Importa desde el paquete npm
// Función para manejar el cambio de ruta y actualizar metadatos, etc.
  function handleRouteChange() {
    updateMeta(window.location.pathname, "asd");
  }


// Función de envoltura para navigate que también llama a handleRouteChange
export function broteNavigate(to, options = {}, event = null) {
  if (event) {
    event.preventDefault(); // Evita que el evento de clic predeterminado se propague
  }
  const online = get(isOnline); // Obtiene el estado actual de la conexión

  const allowedOfflineRoutes = ['/view-project', '/projects', '/create-report', '/view-report', '/edit-report'];

  console.log(online);
  if (online || allowedOfflineRoutes.some(route => to.startsWith(route))) {
    console.log("La ruta está permitida: ", to);
    navigate(to, options);
    updateMeta(window.location.pathname, "asd");
    handleRouteChange();
    // check if screen width is below 500px and nav#sidebar is active
    if (window.innerWidth < 500 && document.getElementById('sidebar').classList.contains('active')) {
      document.getElementById('sidebar').classList.toggle('active');
      document.getElementById('content').classList.toggle('sidebar');
    }
  } else {
    Swal.fire({
      title: 'Sin conexión',
      text: 'No estás conectado. Solo puedes acceder a funciones limitadas.',
      icon: 'warning',
      confirmButtonText: 'OK',
    });

  }
}
