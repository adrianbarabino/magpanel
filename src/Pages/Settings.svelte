<script>
  import { onMount, createEventDispatcher } from 'svelte';

  let settings = [];
  let isLoading = true;
  let showToast = false;
  const dispatch = createEventDispatcher();

  onMount(async () => {
    try {
      const response = await fetch('https://api.mag-servicios.com/settings', {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('accessToken'),
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los ajustes de configuración');
      }

      settings = await response.json();
      isLoading = false;
    } catch (error) {
      console.error(error.message);
      // Aquí podrías manejar el error de carga, quizás con una notificación o mensaje en la UI
    }
  });

  const updateSetting = async (id, value) => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/settings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken')
        },
        body: JSON.stringify({ value })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el ajuste');
      }

      // Muestra la notificación
      showToast = true;
      setTimeout(() => {
        showToast = false;
      }, 3000); // La notificación desaparece después de 3 segundos

    } catch (error) {
      console.error(error.message);
      // Aquí podrías manejar el error de actualización, quizás con una notificación o mensaje en la UI
    }
  };
</script>

<style>
  .toast {
    position: fixed;
    top: 20px; /* Posición inicial más baja */
    right: 20px;
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,.2);
    transition: all 0.5s ease-in-out; /* Transición suavizada para todas las propiedades */
    transform: translateY(-60px); /* Empieza desde arriba y entra hacia abajo */
    opacity: 0; /* Empieza invisible */
  }

  .toast.show {
    top: 100px; /* Mueve hacia arriba para su posición final */
    transform: translateY(0); /* Mueve a su posición natural */
    opacity: 1; /* Hace visible */
  }
</style>

<div class="container mt-4">
  <!-- Título y Breadcrumb para "Ver Ubicaciones" -->
  <h1 class="mb-4">Configuracion del Sitio <small class="text-muted">  
  </small></h1>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item active" aria-current="page">Ajustes</li>
  </ol>
</nav>
  {#if isLoading}
    <p>Cargando ajustes...</p>
  {:else}
    <!--<h1 class="mb-4">Configuración del Sitio</h1>-->
    {#each settings as setting}
      <div class="form-group">
        <label for="{setting.id}">{setting.description}</label>
        <input 
          id="{setting.id}" 
          class="form-control field-{setting.key}" 
          type="text" 
          bind:value={setting.value}
          on:change="{() => updateSetting(setting.id, setting.value)}"
        >
      </div>
    {/each}
  {/if}
</div>

<div class="toast {showToast ? 'show' : ''}">
  Configuraciones actualizadas</div>

