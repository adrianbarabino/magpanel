<script>
    import { onMount } from 'svelte';
    //import { broteNavigate } from './utils/navigation';
    import { accessToken } from './routes';
  
    let countdown = 3;
    // Función para manejar la salida del sistema
    async function handleLogout() {
      try {
        // Eliminar el token de acceso del almacenamiento local
        localStorage.removeItem('accessToken');
        
      // Simular un tiempo de espera para asegurar que la operación se haya completado
      const intervalId = setInterval(() => {
        if (countdown > 1) {
          countdown--;
        } else {
          clearInterval(intervalId);
          // Redirigir al usuario a la página de inicio después de completar la operación
          accessToken.set(null);
          //broteNavigate('/login');
        }
      }, 1000);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // Manejar cualquier error que pueda ocurrir durante el proceso de cierre de sesión
      }
    }
  
    // Ejecutar la función handleLogout() después de que el componente se monte en el DOM
    onMount(handleLogout);
  </script>
  
  <div class="container mt-4">
    <h1 class="mb-4">Salir <small class="text-muted"> del sistema </small> </h1>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={handleLogout}>Inicio</a></li>
        <li class="breadcrumb-item active" aria-current="page">Salir</li>
      </ol>
    </nav>
  
    <p>
        {#if countdown > 0}
        Saliendo del sistema en {countdown} segundos...
      {:else}
        Esperamos verte pronto.
      {/if}

    </p>
    <p>
      Esperamos verte pronto.
    </p>
  </div>
  