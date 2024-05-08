<script>
  import { broteNavigate } from '../utils/navigation';
  import { username } from '../routes';
  import SwitchButton from './SwitchButton.svelte'
  import Swal from 'sweetalert2';
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

  const newFeedback = () => {
    Swal.fire({
      title: 'Feedback',
      input: 'textarea',
      inputLabel: '¿Qué sugerencia o comentario tenes para nosotros?',
      inputPlaceholder: 'Escribí aquí tu feedback',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (feedback) => {
        // agregar la pantalla actual al feedback
        let currentPage = window.location.pathname;
        let navigator = window.navigator.userAgent;

        let screenSize = window.screen.width + 'x' + window.screen.height;
        return fetch('https://api.mag-servicios.com/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          // send the message as message property
          body: JSON.stringify({ message: feedback, page: currentPage, navigator: navigator, screen: screenSize})
        })
          .then(response => {
            if (!response.ok) {
              Swal.fire ({
                title: 'Error al enviar el feedback',
                text: 'Por favor verifica los datos del formulario: ' + response.statusText,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }else {
              Swal.fire({
                title: 'Feedback enviado con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
            }
            return response.json();
          })
          .catch(error => {
            Swal.showValidationMessage(`Hubo un problema al enviar tu feedback: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  };
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
          <a class="nav-link" href="/home" on:click={(event) => broteNavigate('/home')}>Panel de Control</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/create-project" on:click={(event) => broteNavigate('/create-project')}>Crear Proyecto</a>
        </li>
      </ul>
    </div>

    <!-- Logo centralizado para todas las pantallas -->
    <a class="navbar-brand mx-auto" href="/home" on:click={(event) => broteNavigate('/home')}>
      <img src="https://mag-servicios.com/wp-content/uploads/2019/10/04-Blanco-800x362.png" height="40" alt="Logo MAG">
    </a>

    <!-- Contenido alineado a la derecha -->
    {#if username}
      <div class="navbar-text d-none d-lg-block ml-auto">
        <span class="text-white mx-2">{greeting}</span>
        <a class="btn btn-danger text-white btn-sm" href="/logout" on:click={(event) => broteNavigate('/logout')}>Salir</a>
        <SwitchButton></SwitchButton>
      </div>
    {/if}

    <div class="navbar-text d-none d-lg-block ml-auto">
      <button class="ml-1 btn btn-text " on:click={() => newFeedback()}>
      <i class="fa fa-comment"></i>
      </button>
    </div>
  </div>
</nav>
