<script>
  import { broteNavigate } from './utils/navigation';
  import { username } from './routes';
  import SwitchButton from './SwitchButton.svelte'

  let greeting = '';
  const date = new Date();
  const hour = date.getHours();
  let allGreetings = [
      `¡Hola, ${username}!`,
      `¡Excelente verte, ${username}!`
  ];
  
  switch (true) {
      case hour < 6:
      allGreetings.push(`¡Buenas noches, ${username}!`, `¿Cómo te trata la noche, ${username}?`, `¡A relajarse, ${username}!`, `¡A descansar, ${username}!`);
          break;
      case hour < 12:
          allGreetings.push(`¡Buen día, ${username}!`, `¿Cómo amaneciste, ${username}?`, `¡Vamos arrancando, ${username}!`);
          break;
      case hour < 18:
          allGreetings.push(`¡Buenas, ${username}!`, `¿Cómo va la tarde, ${username}?`, `¡A seguir, ${username}!`);
          break;
      default:
          allGreetings.push(`¡Buenas noches, ${username}!`, `¿Cómo te trata la noche, ${username}?`, `¡A relajarse, ${username}!`, `¡A descansar, ${username}!`);
  }
  greeting = allGreetings[Math.floor(Math.random() * allGreetings.length)];
</script>


<nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
  <div class="container-fluid">
    <!-- Botón para versión móvil y elementos alineados a la izquierda -->
    <button class="navbar-toggler" type="button" id="sidebarCollapseTop" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href="#" on:click={(event) => broteNavigate('/home')}>Panel de Control</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" on:click={(event) => broteNavigate('/create-project')}>Crear Proyecto</a>
        </li>
      </ul>
    </div>

    <!-- Logo centralizado para todas las pantallas -->
    <a class="navbar-brand mx-auto" href="#" on:click={(event) => broteNavigate('/home')}>
      <img src="https://mag-servicios.com/wp-content/uploads/2019/10/04-Blanco-800x362.png" height="40" alt="Logo MAG">
    </a>

    <!-- Contenido alineado a la derecha -->
    {#if username}
      <div class="navbar-text d-none d-lg-block ml-auto">
        <span class="text-white mx-2">{greeting}</span>
        <a class="btn btn-danger text-white btn-sm" href="#" on:click={(event) => broteNavigate('/logout')}>Salir</a>
        <SwitchButton></SwitchButton>
      </div>
    {/if}
  </div>
</nav>
