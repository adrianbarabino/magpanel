<!-- Login.svelte -->

<script>
  import { writable } from 'svelte/store';
  import { broteNavigate } from './utils/navigation';

  // Creamos un estado para almacenar las credenciales del usuario
  const username = writable('');
  const password = writable('');

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    const credentials = {
      username: $username,
      password: $password
    };

    try {
      // Realizamos la solicitud POST para iniciar sesión
      const response = await fetch('https://api.mag-servicios.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        // Si la respuesta es exitosa, obtenemos el token de acceso y el nombre del usuario
        const data = await response.json();


        console.log("Inicio correctamente");
        // Guardamos el token de acceso en el almacenamiento local
        localStorage.setItem('accessToken', data.access_token);
        // Redirigimos al usuario a la página principal después de 1 segundo
        setTimeout(() => broteNavigate('/home'), 1000);
      } else {
        // Si hay un error en la respuesta, mostramos un mensaje de error
        console.error('Error al iniciar sesión:', response.statusText);
        alert('Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.');
      }
    } catch (error) {
      // Si hay un error en la solicitud, mostramos un mensaje de error
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Inténtalo nuevamente más tarde.');
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
</form>
