<!-- Login.svelte -->

<script>
    import Swal from 'sweetalert2';
  import { writable } from 'svelte/store';
  import { broteNavigate } from '../utils/navigation';
  import { accessToken } from '../routes.js';

  // Creamos un estado para almacenar las credenciales del usuario
  const username = writable('');
  const password = writable('');

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    // lowercase the username
    
    // Obtenemos los valores actuales de los campos de usuario y contraseña
    // const $username = username;
    // const $password = password;

    // Creamos un objeto con las credenciales del usuario
    const credentials = {
      username: $username,
      password: $password
    };

    credentials.username = credentials.username.toLowerCase();
    try {
      // Realizamos la solicitud POST para iniciar sesión
      const response = await fetch('https://api.mag-servicios.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      // la respuesta por ejemplo seria: 
      // {
      //   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk3OTQzOTEsInVzZXJfaWQiOjd9.WhTRvdNf4dA-2DKb8z1_bXhW5MRnqGYueQl3N_yEy80"
      // }

      console.log(response);
      if (response.ok) {
        // Si la respuesta es exitosa, obtenemos el token de acceso y el nombre del usuario
        const data = await response.json();


        console.log("Inicio correctamente");
        // Guardamos el token de acceso en el almacenamiento local
        localStorage.setItem('accessToken', data.access_token);
        accessToken.set(data.access_token); // Modifica esta línea

        // Redirigimos al usuario a la página principal después de 1 segundo

        // si la pagina actual es /login, redirigir a /home
        if (window.location.pathname === '/login') {
          setTimeout(() => broteNavigate('/home'), 100);
        }
      } else {
        // Si hay un error en la respuesta, mostramos un mensaje de error
        console.error('Error al iniciar sesión:', response.statusText);
        // remove credentials from store
        username.set('');
        password.set('');

        alert('Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.');
      }
    } catch (error) {
      // Si hay un error en la solicitud, mostramos un mensaje de error
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Inténtalo nuevamente más tarde.');
      username.set('');
        password.set('');
    }
  };

  // La función para mostrar el modal de SweetAlert
  const showRecoverPassword = () => {
    Swal.fire({
      title: 'Recuperar Contraseña',
      input: 'email',
      inputLabel: 'Ingresa tu dirección de correo electrónico',
      inputPlaceholder: 'Email',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      
  if (response.status === 401) {
    // Lanzar swal con erro sobre acceso no autorizado y que deberá loguear nuevamente
    Swal.fire(
        'Error',
        'No tienes permisos para realizar esta acción. Por favor, inicia sesión nuevamente.',
        'error'
      );
      setTimeout(() => {

        localStorage.removeItem('accessToken');
        broteNavigate('/login');
      }, 3000);
  } else if (result.isConfirmed && result.value) {
        recoverPassword(result.value);
      }
    });
  };

  // La función para manejar la recuperación de contraseña
  const recoverPassword = async (email) => {
    try {
      const response = await fetch('https://api.mag-servicios.com/request-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: 'Revisa tu correo para las instrucciones de recuperación.',
        });
      } else {
        throw new Error('Algo salió mal con la solicitud de recuperación de contraseña.');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No pudimos procesar tu solicitud de recuperación de contraseña. Intentá de nuevo más tarde.',
      });
    }
  };
</script>

<style>
  /* Agregamos estilos de Bootstrap */
  .form-control {
    margin-bottom: 1rem;
  }

  .btn {
    width: 100%;
  }
</style>

<h2 class="mb-4">Iniciar Sesión</h2>
<form on:submit|preventDefault="{handleLogin}">
  <div class="form-group">
    <input type="text" class="form-control" bind:value={$username} placeholder="Usuario" required>
  </div>
  <div class="form-group">
    <input type="password" class="form-control" bind:value={$password} placeholder="Contraseña" required>
  </div>
  <button type="submit" class="btn btn-primary">Ingresar</button>
  <div class="mt-3">
    <a href="javascript:void(0);" on:click="{showRecoverPassword}">¿Olvidaste tu contraseña?</a>
  </div>
</form>
